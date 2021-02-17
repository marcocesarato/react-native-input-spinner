import React, {Component} from "react";
import {Text, TextInput, TouchableHighlight, View} from "react-native";
import PropTypes from "prop-types";
import {Style} from "./Style";
import {debounce, isNumeric, isEmpty} from "./Utils";

/**
 * Default constants
 */
const defaultSpeed = 7;
const defaultAccelerationDelay = 1000;
const defaultColor = "#3E525F";
const defaultTypingTime = 500;

/**
 * Input Spinner
 * @author Marco Cesarato <cesarato.developer@gmail.com>
 */
class InputSpinner extends Component {
	/**
	 * Constructor
	 * @param props
	 */
	constructor(props) {
		super(props);

		// Timers
		this.increaseTimer = null;
		this.decreaseTimer = null;
		this.holdTime = null;

		let spinnerStep = this.parseNum(this.props.step);
		if (!this.typeDecimal() && spinnerStep < 1) {
			spinnerStep = 1;
		}

		const min = this.props.min != null ? this.parseNum(this.props.min) : null;
		const max = this.props.max != null ? this.parseNum(this.props.max) : null;

		let initialValue =
			this.props.initialValue != null && !isNaN(12)
				? this.props.initialValue
				: this.props.value;
		initialValue = this.parseNum(initialValue);
		initialValue = this.withinRange(initialValue, min, max);

		// Set debounce
		this._debounceSetMax = debounce(
			this._setStateMax.bind(this),
			this.props.typingTime,
		);
		this._debounceSetMin = debounce(
			this._setStateMin.bind(this),
			this.props.typingTime,
		);
		this._updateValue = debounce((value) => {
			this.setState({value: value});
		}, 250);

		this.state = {
			min: min,
			max: max,
			value: initialValue,
			step: spinnerStep,
			focused: false,
			buttonPress: null,
		};
	}

	/**
	 * Component did update
	 * @param prevProps
	 * @returns {*}
	 */
	componentDidUpdate(prevProps) {
		// Parse Value
		if (this.props.value !== prevProps.value) {
			let newValue = this.parseNum(this.props.value);
			newValue = this.withinRange(newValue);
			this._updateValue(newValue);
		}
		// Parse Min
		if (this.props.min !== prevProps.min) {
			this.setState({
				min: this.props.min != null ? this.parseNum(this.props.min) : null,
			});
		}
		// Parse Max
		if (this.props.max !== prevProps.max) {
			this.setState({
				max: this.props.max != null ? this.parseNum(this.props.max) : null,
			});
		}
		// Parse Step
		if (this.props.step !== prevProps.step) {
			let spinnerStep = this.parseNum(this.props.step);
			if (!this.typeDecimal() && spinnerStep < 1) {
				spinnerStep = 1;
			}
			this.setState({step: spinnerStep});
		}
	}

	/**
	 * Set state to min
	 * @param callback
	 * @private
	 */
	_setStateMin(callback = null) {
		return this.setState({value: ""}, callback);
	}

	/**
	 * Set state to max
	 * @param callback
	 * @private
	 */
	_setStateMax(callback = null) {
		return this.setState({value: this.state.max}, callback);
	}

	/**
	 * Clear min timer
	 * @private
	 */
	_clearMinTimer() {
		clearTimeout(this.maxTimer);
		this.maxTimer = null;
	}

	/**
	 * Clear max timer
	 * @private
	 */
	_clearMaxTimer() {
		clearTimeout(this.minTimer);
		this.minTimer = null;
	}

	/**
	 * Clear increase timer
	 * @private
	 */
	_clearIncreaseTimer() {
		clearTimeout(this.increaseTimer);
		this.increaseTimer = null;
	}

	/**
	 * Clear decrease timer
	 * @private
	 */
	_clearDecreaseTimer() {
		clearTimeout(this.decreaseTimer);
		this.decreaseTimer = null;
	}

	/**
	 * Clear on change timers
	 * @private
	 */
	_clearOnChangeTimers() {
		this._clearMaxTimer();
		this._clearMinTimer();
	}

	/**
	 * Clear all timers
	 * @private
	 */
	_clearTimers() {
		this._clearOnChangeTimers();
		this._clearIncreaseTimer();
		this._clearDecreaseTimer();
	}

	/**
	 * On value change
	 * @param value
	 * @param isPressEvent
	 */
	async onChange(value, isPressEvent = false) {
		const isEmptyValue = isEmpty(value);
		this._clearOnChangeTimers();

		let num = value;
		let parsedNum = value;
		if (isEmptyValue) {
			num = this.state.min;
		}

		if (this.props.disabled) return;

		const separator = !isEmpty(this.props.decimalSeparator)
			? this.props.decimalSeparator
			: ".";
		if (
			String(num).endsWith(separator) &&
			!this.getValue().endsWith(separator + "0")
		) {
			this.decimalInput = true;
		}
		num = parsedNum = this.parseNum(String(num).replace(/^0+/, "")) || 0;
		if (!this.minReached(num)) {
			if (this.maxReached(num)) {
				if (this.maxReached(num)) {
					parsedNum = this.state.max;
					if (!isEmptyValue) {
						this.maxTimer = this._debounceSetMax();
					}
					if (this.props.onMax) {
						this.props.onMax(this.state.max);
					}
				}
			}
		} else {
			if (!isEmptyValue) {
				this.minTimer = this._debounceSetMin();
			}

			if (isEmptyValue && this.isEmptied()) {
				num = parsedNum = null;
			} else {
				parsedNum = this.state.min;
			}

			if (this.props.onMin) {
				this.props.onMin(parsedNum);
			}
		}

		if (isEmptyValue && this.isEmptied()) {
			num = parsedNum = null;
		}

		if (this.state.value !== num && this.props.onChange) {
			const res = await this.props.onChange(parsedNum);
			if (!isEmptyValue) {
				if (res === false) {
					return;
				} else if (isNumeric(res)) {
					num = this.parseNum(res);
				}
			}
		}

		if (!isEmptyValue) {
			this.setState({value: num});
		} else {
			this.setState({value: value});
		}
	}

	/**
	 * On buttons press out
	 * @param e
	 */
	onPressOut(e) {
		this._clearTimers();
		this._resetHoldTime();
	}

	/**
	 * On Button Press
	 * @param buttonDirection
	 */
	onShowUnderlay(buttonDirection) {
		this.setState({buttonPress: buttonDirection});
	}

	/**
	 * On Button Unpress
	 */
	onHideUnderlay() {
		this.setState({buttonPress: null});
	}

	/**
	 * Round number to props precision
	 * @param num
	 */
	roundNum(num) {
		if (this.typeDecimal()) {
			let val = num * Math.pow(10, this.props.precision);
			let fraction = Math.round((val - parseInt(val)) * 10) / 10;
			if (fraction === -0.5) {
				fraction = -0.6;
			}
			val =
				Math.round(parseInt(val) + fraction) /
				Math.pow(10, this.props.precision);
			return val;
		}
		return num;
	}

	/**
	 * Limit value to be within max and min range
	 * @param value
	 * @param min
	 * @param max
	 * @returns {*}
	 */
	withinRange(value, min = null, max = null) {
		if (min == null && this.state && this.state.min != null) {
			min = this.state.min;
		}
		if (max == null && this.state && this.state.max != null) {
			max = this.state.max;
		}
		if (min != null && value < min) {
			value = min;
		}
		if (max != null && value > max) {
			value = max;
		}
		return value;
	}

	/**
	 * Parse number type
	 * @param num
	 * @returns {*}
	 */
	parseNum(num) {
		num = String(num).replace(
			!isEmpty(this.props.decimalSeparator) ? this.props.decimalSeparator : ".",
			".",
		);
		if (this.typeDecimal()) {
			num = parseFloat(num);
		} else {
			num = parseInt(num);
		}
		if (isNaN(num)) {
			num = 0;
		}
		this.roundNum(num);
		return num;
	}

	/**
	 * Convert value to string
	 * @returns {string}
	 */
	getValue() {
		let value = this.state.value;
		if (isEmpty(value)) {
			return "";
		}
		if (this.typeDecimal() && this.decimalInput) {
			this.decimalInput = false;
			value = this.parseNum(value).toFixed(1).replace(/0+$/, "");
		} else if (this.typeDecimal()) {
			value = String(
				this.parseNum(this.parseNum(value).toFixed(this.props.precision)),
			);
		} else {
			value = String(this.parseNum(value));
		}
		let hasPlaceholder = value === "0" && !isEmpty(this.props.placeholder);
		return hasPlaceholder
			? ""
			: value.replace(
					".",
					!isEmpty(this.props.decimalSeparator)
						? this.props.decimalSeparator
						: ".",
			  );
	}

	/**
	 * Get Placeholder
	 * @returns {*}
	 */
	getPlaceholder() {
		if (!isEmpty(this.props.placeholder)) {
			return this.props.placeholder;
		} else if (isEmpty(this.state.value) && this.isEmptied()) {
			return "";
		} else {
			return String(this.state.min);
		}
	}

	/**
	 * Get Type
	 * @returns {String}
	 */
	getType() {
		let type = this.props.type;
		if (this.props.type != null) {
			type = this.props.type;
		}
		return String(type).toLowerCase();
	}

	/**
	 * Detect if type is decimal
	 * @returns {boolean}
	 */
	typeDecimal() {
		let type = this.getType();
		return (
			type === "float" ||
			type === "double" ||
			type === "decimal" ||
			type === "real"
		);
	}

	/**
	 * Update holding time
	 * @private
	 */
	_startHoldTime() {
		this.holdTime = new Date().getTime();
	}

	/**
	 * Get the holding time
	 * @private
	 */
	_getHoldTime() {
		if (isEmpty(this.holdTime)) {
			return 0;
		}
		let now = new Date().getTime();
		return now - this.holdTime;
	}

	/**
	 * Reset holding time
	 * @private
	 */
	_resetHoldTime() {
		this.holdTime = null;
	}

	/**
	 * Find the interval between changing values after a button has been held for a certain amount of time
	 * @returns {number}
	 * @author Tom Hardern <https://gist.github.com/taeh98/f709451457400818094d802cd33694d5>
	 * @private
	 */
	_getHoldChangeInterval() {
		const minInterval = 10;
		var time = (10 - Math.log(this.props.speed * this._getHoldTime())) * 100;
		return time < minInterval ? minInterval : time;
	}

	/**
	 * Increase
	 */
	async increase() {
		if (this._isDisabledButtonRight()) return;
		let currentValue = this.parseNum(this.state.value);
		let num = currentValue + this.parseNum(this.state.step);

		if (
			this.maxReached(currentValue) &&
			!this.isEmptied() &&
			this.isContinuos()
		) {
			// Continuity mode
			num = this.state.min;
		} else if (this.maxReached(currentValue)) {
			return;
		}
		if (this.props.onIncrease) {
			let increased_num = num;
			const res = await this.props.onIncrease(increased_num);
			if (res === false) {
				return;
			} else if (isNumeric(res)) {
				num = this.parseNum(res);
			}
		}

		let wait = this._getHoldChangeInterval();
		if (this.increaseTimer === null) {
			this._startHoldTime();
			wait = this.props.accelerationDelay;
		} else {
			if (this.props.onLongPress) {
				await this.props.onLongPress(num);
			}
		}

		this.increaseTimer = setTimeout(this.increase.bind(this), wait);
		this.onChange(num, true);
	}

	/**
	 * Decrease
	 */
	async decrease() {
		if (this._isDisabledButtonLeft()) return;
		let currentValue = this.parseNum(this.state.value);
		let num = currentValue - this.parseNum(this.state.step);

		if (
			this.minReached(currentValue) &&
			!this.isEmptied() &&
			this.isContinuos()
		) {
			// Continuity mode
			num = this.state.max;
		} else if (this.minReached(currentValue)) {
			return;
		}

		if (this.props.onDecrease) {
			let decreased_num = num;
			const res = await this.props.onDecrease(decreased_num);
			if (res === false) {
				return;
			} else if (isNumeric(res)) {
				num = this.parseNum(res);
			}
		}

		let wait = this._getHoldChangeInterval();
		if (this.decreaseTimer === null) {
			this._startHoldTime();
			wait = this.props.accelerationDelay;
		} else {
			if (this.props.onLongPress) {
				await this.props.onLongPress(num);
			}
		}

		this.decreaseTimer = setTimeout(this.decrease.bind(this), wait);
		this.onChange(num, true);
	}

	/**
	 * On Submit keyboard
	 * @returns {*}
	 * @param e
	 */
	onSubmit(e) {
		if (this.props.onSubmit) {
			this.props.onSubmit(this.parseNum(e.nativeEvent.text));
		}
	}

	/**
	 * On Focus
	 * @returns {*}
	 * @param e
	 */
	onFocus(e) {
		if (this.props.onFocus) {
			this.props.onFocus(e);
		}
		this.setState({focused: true});
	}

	/**
	 * On Blur
	 * @returns {*}
	 * @param e
	 */
	onBlur(e) {
		if (this.props.onBlur) {
			this.props.onBlur(e);
		}
		this.setState({focused: false});
	}

	/**
	 * On Key Press
	 * @returns {*}
	 * @param e
	 */
	onKeyPress(e) {
		if (this.props.onKeyPress) {
			this.props.onKeyPress(e);
		}
	}

	/**
	 * Max is reached
	 * @param num
	 * @returns {boolean}
	 */
	maxReached(num = null) {
		if (this.state.max != null) {
			if (num == null) {
				num = this.state.value;
			}
			return num >= this.state.max;
		}
		return false;
	}

	/**
	 * Min is reached
	 * @param num
	 * @returns {boolean}
	 */
	minReached(num = null) {
		if (this.state.min != null) {
			if (num == null) {
				num = this.state.value;
			}
			return num <= this.state.min;
		}
		return false;
	}

	/**
	 * Blur
	 */
	blur() {
		this.textInput.blur();
	}

	/**
	 * Focus
	 */
	focus() {
		this.textInput.focus();
	}

	/**
	 * Clear
	 */
	clear() {
		this.textInput.clear();
	}

	/**
	 * Is text input editable
	 * @returns {boolean|Boolean}
	 */
	isEditable() {
		return (
			(this.props.disabled !== true || this.props.disabled != null) &&
			this.props.editable !== false
		);
	}

	/**
	 * If continuity mode enabled
	 * @returns {boolean|Boolean}
	 */
	isContinuos() {
		return this.props.continuity !== false;
	}

	/**
	 * If input can be empty
	 * @returns {boolean|Boolean}
	 */
	isEmptied() {
		return this.props.emptied !== false;
	}

	/**
	 * Is text input focused
	 * @returns {boolean|Boolean}
	 */
	isFocused() {
		return this.state.focus !== false;
	}

	/**
	 * Is left button disabled
	 * @returns {Boolean}
	 * @private
	 */
	_isDisabledButtonLeft() {
		return (
			this.props.disabled !== false || this.props.buttonLeftDisabled !== false
		);
	}

	/**
	 * Is right button disabled
	 * @returns {Boolean}
	 * @private
	 */
	_isDisabledButtonRight() {
		return (
			this.props.disabled !== false || this.props.buttonRightDisabled !== false
		);
	}

	/**
	 * Is right button pressed
	 * @returns {boolean}
	 * @private
	 */
	_isRightButtonPressed() {
		return this.state.buttonPress === "right";
	}

	/**
	 * Is left button pressed
	 * @returns {boolean}
	 * @private
	 */
	_isLeftButtonPressed() {
		return this.state.buttonPress === "left";
	}

	/**
	 * Get keyboard type
	 * @returns {string}
	 * @private
	 */
	_getKeyboardType() {
		// Keyboard type
		let keyboardType = "numeric";
		if (this.typeDecimal()) {
			keyboardType = "decimal-pad";
		} else {
			keyboardType = "number-pad";
		}
		return keyboardType;
	}

	/**
	 * Get main color
	 * @returns {String|*}
	 * @private
	 */
	_getColor() {
		return this.maxReached()
			? this._getColorMax()
			: this.minReached()
			? this._getColorMin()
			: this.props.color;
	}

	/**
	 * Get min color
	 * @returns {String}
	 * @private
	 */
	_getColorMin() {
		if (!this.props.colorMin) {
			return this.props.color;
		}
		return this.props.colorMin;
	}

	/**
	 * Get max color
	 * @returns {String}
	 * @private
	 */
	_getColorMax() {
		if (!this.props.colorMax) {
			return this.props.color;
		}
		return this.props.colorMax;
	}

	/**
	 * Get color on button press
	 * @returns {String|*}
	 * @private
	 */
	_getColorPress() {
		const color =
			this.props.colorPress !== defaultColor
				? this.props.colorPress
				: this.props.color;
		return this.maxReached()
			? this._getColorMax()
			: this.minReached()
			? this._getColorMin()
			: color;
	}

	/**
	 * Get color text on button press
	 * @returns {string}
	 * @private
	 */
	_getColorPressText() {
		return this.props.buttonPressTextColor !== this.props.buttonTextColor
			? this.props.buttonPressTextColor
			: this.props.buttonTextColor;
	}

	/**
	 * Get left button color
	 * @returns {string}
	 * @private
	 */
	_getColorLeftButton() {
		const color = this._getColor();
		return this.props.colorLeft !== defaultColor ? this.props.colorLeft : color;
	}

	/**
	 * Get right button color
	 * @returns {string}
	 * @private
	 */
	_getColorRightButton() {
		const color = this._getColor();
		return this.props.colorRight !== defaultColor
			? this.props.colorRight
			: color;
	}

	/**
	 * Get container style
	 * @returns {*[]}
	 * @private
	 */
	_getContainerStyle() {
		return [
			Style.container,
			{
				borderColor: this.props.showBorder ? this._getColor() : "transparent",
				width: this.props.width,
				height: this.props.height,
			},
			this.props.style,
		];
	}

	/**
	 * Get input text style
	 * @returns {*[]}
	 * @private
	 */
	_getInputTextStyle() {
		return [
			Style.numberText,
			{
				color: this.props.textColor,
				fontSize: this.props.fontSize,
				fontFamily: this.props.fontFamily,
				borderColor: this.props.showBorder ? this._getColor() : "transparent",
				backgroundColor: this.props.background,
				height: this.props.height,
			},
			this.props.inputStyle,
		];
	}

	/**
	 * Get button style
	 * @returns {*}
	 * @private
	 */
	_getStyleButton() {
		const size = this.props.height;
		return {
			height: size,
			width: size,
		};
	}

	/**
	 * Get button pressed style
	 * @returns {Object}
	 * @private
	 */
	_getStyleButtonPress() {
		return isEmpty(this.props.buttonPressStyle)
			? this.props.buttonStyle
			: this.props.buttonPressStyle;
	}

	/**
	 * Get button text style
	 * @returns {*[]}
	 * @private
	 */
	_getStyleButtonText() {
		return [
			Style.buttonText,
			{
				fontSize: this.props.buttonFontSize,
				fontFamily: this.props.buttonFontFamily,
			},
		];
	}

	/**
	 * Get left button text style
	 * @returns {*[]}
	 * @private
	 */
	_getStyleLeftButtonText() {
		return [
			Style.buttonText,
			this._getStyleButtonText(),
			{
				color: this._isLeftButtonPressed()
					? this._getColorPressText()
					: this.props.buttonTextColor,
			},
		];
	}

	/**
	 * Get right button text style
	 * @returns {*[]}
	 * @private
	 */
	_getStyleRightButtonText() {
		return [
			Style.buttonText,
			this._getStyleButtonText(),
			{
				color: this._isRightButtonPressed()
					? this._getColorPressText()
					: this.props.buttonTextColor,
			},
		];
	}

	/**
	 * Render left button element
	 * @returns {*}
	 * @private
	 */
	_renderLeftButtonElement() {
		if (this.props.buttonLeftImage) {
			return this.props.buttonLeftImage;
		} else if (this._isLeftButtonPressed() && this.props.buttonPressLeftImage) {
			return this.props.buttonPressLeftImage;
		} else {
			const text =
				this.props.arrows !== false
					? "<"
					: this.props.buttonLeftText
					? this.props.buttonLeftText
					: "-";
			return <Text style={this._getStyleLeftButtonText()}>{text}</Text>;
		}
	}

	/**
	 * Render right button element
	 * @returns {*}
	 * @private
	 */
	_renderRightButtonElement() {
		if (this.props.buttonRightImage) {
			return this.props.buttonRightImage;
		} else if (
			this._isRightButtonPressed() &&
			this.props.buttonPressRightImage
		) {
			return this.props.buttonPressRightImage;
		} else {
			const text =
				this.props.arrows !== false
					? ">"
					: this.props.buttonRightText
					? this.props.buttonRightText
					: "+";
			return <Text style={this._getStyleRightButtonText()}>{text}</Text>;
		}
	}

	/**
	 * Render left button
	 * @returns {*}
	 * @private
	 */
	_renderLeftButton() {
		const colorLeft = this._getColorLeftButton();

		const buttonStyle = [
			this._getStyleButton(),
			{
				borderColor: this.props.showBorder ? colorLeft : "transparent",
				backgroundColor: colorLeft,
			},
			this.props.rounded ? Style.buttonRounded : Style.buttonLeft,
			this._isLeftButtonPressed()
				? this._getStyleButtonPress()
				: this.props.buttonStyle,
		];

		return (
			<TouchableHighlight
				activeOpacity={this.props.activeOpacity}
				underlayColor={this._getColorPress()}
				onHideUnderlay={this.onHideUnderlay.bind(this)}
				onShowUnderlay={this.onShowUnderlay.bind(this, "left")}
				disabled={this._isDisabledButtonLeft()}
				style={buttonStyle}
				onPressIn={this.decrease.bind(this)}
				onPressOut={this.onPressOut.bind(this)}
				{...this.props.leftButtonProps}>
				{this._renderLeftButtonElement()}
			</TouchableHighlight>
		);
	}

	/**
	 * Render right button
	 * @returns {*}
	 * @private
	 */
	_renderRightButton() {
		const colorRight = this._getColorRightButton();

		const buttonStyle = [
			this._getStyleButton(),
			{
				borderColor: this.props.showBorder ? colorRight : "transparent",
				backgroundColor: colorRight,
			},
			this.props.rounded ? Style.buttonRounded : Style.buttonRight,
			this._isRightButtonPressed()
				? this._getStyleButtonPress()
				: this.props.buttonStyle,
		];

		return (
			<TouchableHighlight
				activeOpacity={this.props.activeOpacity}
				underlayColor={this._getColorPress()}
				onHideUnderlay={this.onHideUnderlay.bind(this)}
				onShowUnderlay={this.onShowUnderlay.bind(this, "right")}
				disabled={this._isDisabledButtonRight()}
				style={buttonStyle}
				onPressIn={this.increase.bind(this)}
				onPressOut={this.onPressOut.bind(this)}
				{...this.props.rightButtonProps}>
				{this._renderRightButtonElement()}
			</TouchableHighlight>
		);
	}

	/**
	 * Render
	 * @returns {*}
	 */
	render() {
		return (
			<View style={this._getContainerStyle()} {...this.props.containerProps}>
				{this._renderLeftButton()}

				{this.props.prepend}

				<TextInput
					ref={(input) => (this.textInput = input)}
					style={this._getInputTextStyle()}
					value={this.getValue()}
					placeholder={this.getPlaceholder()}
					placeholderTextColor={this.props.placeholderTextColor}
					selectionColor={this.props.selectionColor}
					selectTextOnFocus={this.props.selectTextOnFocus}
					returnKeyType={this.props.returnKeyType}
					returnKeyLabel={this.props.returnKeyLabel}
					autofocus={this.props.autofocus}
					editable={this.isEditable()}
					maxLength={this.props.maxLength}
					onKeyPress={this.onKeyPress.bind(this)}
					onFocus={this.onFocus.bind(this)}
					onBlur={this.onBlur.bind(this)}
					keyboardType={this._getKeyboardType()}
					onChangeText={this.onChange.bind(this)}
					onSubmitEditing={this.onSubmit.bind(this)}
					{...this.props.inputProps}
				/>

				{this.props.children}
				{this.props.append}

				{this._renderRightButton()}
			</View>
		);
	}
}

InputSpinner.propTypes = {
	type: PropTypes.string,
	min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	precision: PropTypes.number,
	rounded: PropTypes.bool,
	activeOpacity: PropTypes.number,
	color: PropTypes.string,
	colorPress: PropTypes.string,
	colorRight: PropTypes.string,
	colorLeft: PropTypes.string,
	colorMax: PropTypes.string,
	colorMin: PropTypes.string,
	background: PropTypes.string,
	textColor: PropTypes.string,
	arrows: PropTypes.bool,
	showBorder: PropTypes.bool,
	fontSize: PropTypes.number,
	fontFamily: PropTypes.string,
	buttonFontSize: PropTypes.number,
	buttonFontFamily: PropTypes.string,
	buttonTextColor: PropTypes.string,
	maxLength: PropTypes.number,
	disabled: PropTypes.bool,
	editable: PropTypes.bool,
	autofocus: PropTypes.bool,
	selectTextOnFocus: PropTypes.bool,
	placeholder: PropTypes.string,
	placeholderTextColor: PropTypes.string,
	selectionColor: PropTypes.string,
	returnKeyLabel: PropTypes.string,
	returnKeyType: PropTypes.string,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	onFocus: PropTypes.func,
	onBlur: PropTypes.func,
	onKeyPress: PropTypes.func,
	onMin: PropTypes.func,
	onMax: PropTypes.func,
	onIncrease: PropTypes.func,
	onDecrease: PropTypes.func,
	onSubmit: PropTypes.func,
	onLongPress: PropTypes.func,
	accelerationDelay: PropTypes.number,
	speed: PropTypes.number,
	emptied: PropTypes.bool,
	continuity: PropTypes.bool,
	typingTime: PropTypes.number,
	buttonLeftDisabled: PropTypes.bool,
	buttonRightDisabled: PropTypes.bool,
	buttonLeftText: PropTypes.string,
	buttonRightText: PropTypes.string,
	buttonLeftImage: PropTypes.element,
	buttonRightImage: PropTypes.element,
	buttonPressLeftImage: PropTypes.element,
	buttonPressRightImage: PropTypes.element,
	buttonStyle: PropTypes.object,
	buttonPressStyle: PropTypes.object,
	inputStyle: PropTypes.object,
	style: PropTypes.object,
	append: PropTypes.element,
	prepend: PropTypes.element,
	decimalSeparator: PropTypes.string,
	containerProps: PropTypes.object,
	inputProps: PropTypes.object,
	leftButtonProps: PropTypes.object,
	rightButtonProps: PropTypes.object,
};

InputSpinner.defaultProps = {
	type: "int",
	min: 0,
	max: null,
	value: 0,
	initialValue: null,
	step: 1,
	precision: 2,
	rounded: true,
	activeOpacity: 0.85,
	color: defaultColor,
	colorPress: defaultColor,
	colorRight: defaultColor,
	colorLeft: defaultColor,
	background: "transparent",
	textColor: "#000000",
	arrows: false,
	showBorder: false,
	fontSize: 14,
	fontFamily: null,
	buttonFontSize: 25,
	buttonFontFamily: null,
	buttonTextColor: "#FFFFFF",
	buttonPressTextColor: "#FFFFFF",
	maxLength: null,
	disabled: false,
	editable: true,
	autofocus: false,
	selectTextOnFocus: null,
	selectionColor: null,
	returnKeyLabel: null,
	returnKeyType: null,
	width: "auto",
	height: 50,
	accelerationDelay: defaultAccelerationDelay,
	speed: defaultSpeed,
	emptied: false,
	continuity: false,
	typingTime: defaultTypingTime,
	buttonLeftDisabled: false,
	buttonRightDisabled: false,
	buttonLeftText: null,
	buttonRightText: null,
	buttonStyle: {},
	buttonPressStyle: {},
	inputStyle: {},
	style: {},
	decimalSeparator: ".",
	containerProps: {},
	inputProps: {},
	leftButtonProps: {},
	rightButtonProps: {},
};

export default InputSpinner;
