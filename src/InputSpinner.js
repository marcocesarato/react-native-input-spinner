import React, {Component} from "react";
import {
	Platform,
	Text,
	TextInput,
	TouchableHighlight,
	View,
} from "react-native";
import PropTypes from "prop-types";
import {defaultColor, defaultTransparent, defaultFont, Style} from "./Style";
import {
	colorsToHex,
	debounce,
	getColorContrast,
	isCallable,
	isEmpty,
	isNumeric,
	isTransparentColor,
	mergeViewStyle,
	parseColor,
} from "./Utils";

/**
 * Default constants
 */
export const defaultSpeed = 7;
export const defaultAccelerationDelay = 1000;
export const defaultTypingTime = 500;

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

		let spinnerStep = this._parseNum(this.props.step);
		if (!this.isTypeDecimal() && spinnerStep < 1) {
			spinnerStep = 1;
		}
		let spinnerLongStep = this._parseNum(this.props.longStep);
		if (!this.isTypeDecimal() && spinnerLongStep < 1) {
			spinnerLongStep = 0;
		}

		const min = this.props.min != null ? this._parseNum(this.props.min) : null;
		const max = this.props.max != null ? this._parseNum(this.props.max) : null;

		let initialValue =
			this.props.initialValue != null && !isNaN(12)
				? this.props.initialValue
				: this.props.value;
		initialValue = this._parseNum(initialValue);
		initialValue = this._withinRange(initialValue, min, max);

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
			longStep: spinnerLongStep,
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
			let newValue = this._parseNum(this.props.value);
			newValue = this._withinRange(newValue);
			this._updateValue(newValue);
		}
		// Parse Min
		if (this.props.min !== prevProps.min) {
			this.setState({
				min: this.props.min != null ? this._parseNum(this.props.min) : null,
			});
		}
		// Parse Max
		if (this.props.max !== prevProps.max) {
			this.setState({
				max: this.props.max != null ? this._parseNum(this.props.max) : null,
			});
		}
		// Parse Step
		if (this.props.step !== prevProps.step) {
			let spinnerStep = this._parseNum(this.props.step);
			if (!this.isTypeDecimal() && spinnerStep < 1) {
				spinnerStep = 1;
			}
			this.setState({step: spinnerStep});
		}
		// Parse longStep
		if (this.props.longStep !== prevProps.longStep) {
			let spinnerLongStep = this._parseNum(this.props.longStep);
			if (!this.isTypeDecimal() && spinnerLongStep < 1) {
				spinnerLongStep = 0;
			}
			this.setState({longStep: spinnerLongStep});
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
	 * On increase event
	 * @param number
	 */
	onIncrease(number) {
		if (isCallable(this.props.onIncrease)) {
			return this.props.onIncrease(number);
		}
		return true;
	}

	/**
	 * On decrease event
	 * @param number
	 */
	onDecrease(number) {
		if (isCallable(this.props.onDecrease)) {
			return this.props.onDecrease(number);
		}
		return true;
	}

	/**
	 * On max reached event
	 * @param number
	 */
	onMax(number) {
		if (isCallable(this.props.onMax)) {
			this.props.onMax(number);
		}
		this._resetHoldTime();
	}

	/**
	 * On min reached event
	 * @param number
	 */
	onMin(number) {
		if (isCallable(this.props.onMin)) {
			this.props.onMin(number);
		}
		this._resetHoldTime();
	}

	/**
	 * On long press event.
	 * @param number
	 */
	onLongPress(number) {
		if (isCallable(this.props.onLongPress)) {
			this.props.onLongPress(number);
		}
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
		num = parsedNum = this._parseNum(String(num).replace(/^0+/, "")) || 0;
		if (!this.isMinReached(num)) {
			if (this.isMaxReached(num)) {
				if (this.isMaxReached(num)) {
					parsedNum = this.state.max;
					if (!isEmptyValue) {
						this.maxTimer = this._debounceSetMax();
					}
					this.onMax(parsedNum);
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

			this.onMin(parsedNum);
		}

		if (isEmptyValue && this.isEmptied()) {
			num = parsedNum = null;
		} else {
			num = this._withinRange(num);
		}

		if (this.state.value !== num && isCallable(this.props.onChange)) {
			const res = await this.props.onChange(parsedNum);
			if (!isEmptyValue) {
				if (res === false) {
					return;
				} else if (isNumeric(res)) {
					num = this._parseNum(res);
				}
			}
		}

		this.setState({value: num});
	}

	/**
	 * On buttons press out
	 * @param e
	 */
	onPressOut(e) {
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
	 * On Submit keyboard
	 * @returns {*}
	 * @param e
	 */
	onSubmit(e) {
		if (isCallable(this.props.onSubmit)) {
			this.props.onSubmit(this._parseNum(e.nativeEvent.text));
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
	 * Round number to props precision
	 * @private
	 * @param num
	 * @returns float|int
	 */
	_roundNum(num) {
		if (this.isTypeDecimal()) {
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
	 * @private
	 * @param value
	 * @param min
	 * @param max
	 * @returns float|int
	 */
	_withinRange(value, min = null, max = null) {
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
	 * @private
	 * @param num
	 * @returns float|int
	 */
	_parseNum(num) {
		num = String(num).replace(
			!isEmpty(this.props.decimalSeparator) ? this.props.decimalSeparator : ".",
			".",
		);
		if (this.isTypeDecimal()) {
			num = parseFloat(num);
		} else {
			num = parseInt(num);
		}
		if (isNaN(num)) {
			num = 0;
		}
		this._roundNum(num);
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
		if (this.isTypeDecimal() && this.decimalInput) {
			this.decimalInput = false;
			value = this._parseNum(value).toFixed(1).replace(/0+$/, "");
		} else if (this.isTypeDecimal()) {
			value = String(
				this._parseNum(this._parseNum(value).toFixed(this.props.precision)),
			);
		} else {
			value = String(this._parseNum(value));
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
	 * Get Placeholder
	 * @returns {*}
	 */
	getPlaceholderColor() {
		if (this.props.placeholderTextColor) {
			return this.props.placeholderTextColor;
		}
		let textColor = this._getInputTextColor();
		let parse = parseColor(textColor);
		parse[3] = Math.round(0.6 * 255);

		return colorsToHex(parse);
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
	isTypeDecimal() {
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
		this._clearTimers();
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
	 * On hold increase
	 * @param event
	 * @returns {Promise<void>}
	 */
	async increaseHold(event) {
		this.increase(event, true);
	}

	/**
	 * Increase
	 * @param event
	 * @param isLongPress
	 * @returns {Promise<void>}
	 */
	async increase(event, isLongPress = false) {
		if (this._isDisabledButtonRight()) return;
		let currentValue = this._parseNum(this.state.value);
		let num =
			currentValue +
			this._parseNum(
				isLongPress && this.state.longStep > 0
					? this.state.longStep
					: this.state.step,
			);
		if (isLongPress && this.state.longStep > 0) {
			num = Math.round(num / this.state.longStep) * this.state.longStep;
		}
		if (this.isTypeDecimal()) {
			num = Number(num.toFixed(this.props.precision));
		}

		if (
			this.isMaxReached(currentValue) &&
			!this.isEmptied() &&
			this.isContinuos()
		) {
			// Continuity mode
			num = this.state.min;
		} else if (this.isMaxReached(currentValue)) {
			return;
		}

		const res = await this.onIncrease(num);
		if (res === false) {
			return;
		} else if (isNumeric(res)) {
			num = this._parseNum(res);
		}

		let wait = this._getHoldChangeInterval();
		if (!isLongPress && this.increaseTimer === null) {
			this._startHoldTime();
			wait = this.props.accelerationDelay;
		} else if (isLongPress) {
			this.onLongPress(num);
		}

		if (isLongPress) {
			this.increaseTimer = setTimeout(
				this.increase.bind(this, event, true),
				wait,
			);
		}

		this.onChange(num, true);
	}

	/**
	 * On hold decrease
	 * @param event
	 * @returns {Promise<void>}
	 */
	async decreaseHold(event) {
		this.decrease(event, true);
	}

	/**
	 * Decrease
	 * @param event
	 * @param isLongPress
	 * @returns {Promise<void>}
	 */
	async decrease(event, isLongPress = false) {
		if (this._isDisabledButtonLeft()) return;
		let currentValue = this._parseNum(this.state.value);
		let num =
			currentValue -
			this._parseNum(
				isLongPress && this.state.longStep > 0
					? this.state.longStep
					: this.state.step,
			);
		if (isLongPress && this.state.longStep > 0) {
			num = Math.round(num / this.state.longStep) * this.state.longStep;
		}
		if (this.isTypeDecimal()) {
			num = Number(num.toFixed(this.props.precision));
		}

		if (
			this.isMinReached(currentValue) &&
			!this.isEmptied() &&
			this.isContinuos()
		) {
			// Continuity mode
			num = this.state.max;
		} else if (this.isMinReached(currentValue)) {
			return;
		}

		const res = await this.onDecrease(num);
		if (res === false) {
			return;
		} else if (isNumeric(res)) {
			num = this._parseNum(res);
		}

		let wait = this._getHoldChangeInterval();
		if (!isLongPress && this.decreaseTimer === null) {
			this._startHoldTime();
			wait = this.props.accelerationDelay;
		} else if (isLongPress) {
			this.onLongPress(num);
		}

		if (isLongPress) {
			this.decreaseTimer = setTimeout(
				this.decrease.bind(this, event, true),
				wait,
			);
		}

		this.onChange(num, true);
	}

	/**
	 * Max is reached
	 * @param num
	 * @returns {boolean}
	 */
	isMaxReached(num = null) {
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
	isMinReached(num = null) {
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
		let keyboardType = "number-pad";
		if (this.isTypeDecimal()) {
			keyboardType = "decimal-pad";
		}
		return keyboardType;
	}

	/**
	 * Get auto capitalize
	 * @returns {string}
	 * @private
	 */
	_getAutoCapitalize() {
		let autoCapitalize = this.props.autoCapitalize
			? this.props.autoCapitalize
			: "none";
		if (this.isTypeDecimal()) {
			autoCapitalize = "words";
		}
		return autoCapitalize;
	}

	/**
	 * Get main color
	 * @returns {String|*}
	 * @private
	 */
	_getMainColor() {
		let color = this.props.color;
		if (this.props.colorAsBackground) {
			color = defaultTransparent;
		} else if (isTransparentColor(color)) {
			color = defaultTransparent;
		}

		return color;
	}

	/**
	 * Get button color
	 * @returns {String|*}
	 * @private
	 */
	_getColor() {
		const color = this._getMainColor();

		return this.isMaxReached()
			? this._getColorMax()
			: this.isMinReached()
			? this._getColorMin()
			: color;
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
		const color = this.props.colorAsBackground
			? defaultTransparent
			: this.props.color;
		return this.props.colorPress !== defaultColor
			? this.props.colorPress
			: color;
	}

	/**
	 * Get color text on button press
	 * @returns {string}
	 * @private
	 */
	_getColorPressText() {
		const color = this.props.colorAsBackground
			? this._getColorBackground()
			: this._getColorPress();
		const pressColor = this.props.buttonPressTextColor
			? this.props.buttonPressTextColor
			: this._getColorText();
		let textColor =
			this.props.buttonPressTextColor !== this.props.buttonTextColor
				? pressColor
				: "auto";
		if (String(textColor).toLowerCase().trim() === "auto") {
			textColor = getColorContrast(color);
		}

		return textColor;
	}

	/**
	 * Get color text on button
	 * @returns {string}
	 * @private
	 */
	_getColorText() {
		const color = this.props.colorAsBackground
			? this._getColorBackground()
			: this._getColor();
		let textColor =
			this._getColor() !== this._getMainColor()
				? "auto"
				: this.props.buttonTextColor
				? this.props.buttonTextColor
				: "auto";
		if (String(textColor).toLowerCase().trim() === "auto") {
			textColor = getColorContrast(color);
		}

		return textColor;
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
	 * Get background color
	 * @returns {string|*}
	 * @private
	 */
	_getColorBackground() {
		let color = this.props.color;
		let background = this.props.background;
		if (isTransparentColor(color)) {
			color = defaultTransparent;
		}
		if (isTransparentColor(background)) {
			background = defaultTransparent;
		}
		return this.props.colorAsBackground
			? this.isMaxReached()
				? this._getColorMax()
				: this.isMinReached()
				? this._getColorMin()
				: color
			: background;
	}

	/**
	 * Get container style
	 * @returns {*[]}
	 * @private
	 */
	_getContainerStyle() {
		const backgroundColor = this._getColorBackground();
		return [
			Style.container,
			{
				minHeight: this.props.height,
				width: this.props.width,
				backgroundColor: backgroundColor,
			},
			this.props.showBorder
				? {borderWidth: 0.5, borderColor: this._getColor()}
				: {},
			this.props.shadow ? Style.containerShadow : {},
			this.props.rounded ? {borderRadius: this.props.height / 2} : {},
			this.props.style,
		];
	}

	/**
	 * Get input text color
	 * @returns {string|*}
	 * @private
	 */
	_getInputTextColor() {
		const backgroundColor = this._getColorBackground();
		return this.props.textColor
			? this.props.textColor
			: getColorContrast(backgroundColor);
	}

	/**
	 * Get input text style
	 * @returns {*[]}
	 * @private
	 */
	_getInputTextStyle() {
		const backgroundColor = this._getColorBackground();
		return [
			Style.numberText,
			{
				color: this._getInputTextColor(),
				fontSize: this.props.fontSize,
				fontFamily: this.props.fontFamily,
				backgroundColor: backgroundColor,
				height: this.props.height,
			},
			this.props.showBorder
				? {borderWidth: 0.5, borderColor: this._getColor()}
				: {},
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
				lineHeight: this.props.height,
			},
			this.props.buttonTextStyle ? this.props.buttonTextStyle : {},
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
					: this._getColorText(),
			},
			this._isLeftButtonPressed() ? this.props.buttonPressTextStyle : {},
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
					: this._getColorText(),
			},
			this._isRightButtonPressed() ? this.props.buttonPressTextStyle : {},
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
					? "❮"
					: this.props.buttonLeftText
					? this.props.buttonLeftText
					: "-";
			return <Text {...this.props.buttonTextProps} style={this._getStyleLeftButtonText()}>{text}</Text>;
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
					? "❯"
					: this.props.buttonRightText
					? this.props.buttonRightText
					: "+";
			return <Text {...this.props.buttonTextProps} style={this._getStyleRightButtonText()}>{text}</Text>;
		}
	}

	/**
	 * Render left button
	 * @returns {*}
	 * @private
	 */
	_renderLeftButton() {
		const colorLeft = this._getColorLeftButton();

		const buttonStyle = mergeViewStyle(
			this._isLeftButtonPressed()
				? this._getStyleButtonPress()
				: this.props.buttonStyle,
			[
				this._getStyleButton(),
				{
					borderColor: this.props.showBorder ? colorLeft : "transparent",
					backgroundColor: colorLeft,
				},
				this.props.rounded ? Style.buttonRounded : Style.buttonLeft,
			],
		);

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
				onLongPress={this.decreaseHold.bind(this)}
				delayLongPress={this.props.accelerationDelay}
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

		const buttonStyle = mergeViewStyle(
			this._isRightButtonPressed()
				? this._getStyleButtonPress()
				: this.props.buttonStyle,
			[
				this._getStyleButton(),
				{
					borderColor: this.props.showBorder ? colorRight : "transparent",
					backgroundColor: colorRight,
				},
				this.props.rounded ? Style.buttonRounded : Style.buttonRight,
			],
		);

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
				onLongPress={this.increaseHold.bind(this)}
				delayLongPress={this.props.accelerationDelay}
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
					placeholderTextColor={this.getPlaceholderColor()}
					selectionColor={this.props.selectionColor}
					selectTextOnFocus={this.props.selectTextOnFocus}
					returnKeyType={this.props.returnKeyType}
					returnKeyLabel={this.props.returnKeyLabel}
					autoFocus={this.props.autoFocus}
					autoCapitalize={this._getAutoCapitalize()} // Bug fix for Samsung Keyboard
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
	skin: PropTypes.string,
	min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	initialValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	longStep: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	precision: PropTypes.number,
	shadow: PropTypes.bool,
	rounded: PropTypes.bool,
	activeOpacity: PropTypes.number,
	color: PropTypes.string,
	colorPress: PropTypes.string,
	colorRight: PropTypes.string,
	colorLeft: PropTypes.string,
	colorMax: PropTypes.string,
	colorMin: PropTypes.string,
	colorAsBackground: PropTypes.bool,
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
	autoFocus: PropTypes.bool,
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
	buttonStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		PropTypes.number,
		PropTypes.string,
	]),
	buttonTextStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		PropTypes.number,
		PropTypes.string,
	]),
	buttonPressStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		PropTypes.number,
		PropTypes.string,
	]),
	buttonPressTextStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		PropTypes.number,
		PropTypes.string,
	]),
	inputStyle: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		PropTypes.number,
		PropTypes.string,
	]),
	style: PropTypes.oneOfType([
		PropTypes.object,
		PropTypes.array,
		PropTypes.number,
		PropTypes.string,
	]),
	append: PropTypes.element,
	prepend: PropTypes.element,
	decimalSeparator: PropTypes.string,
	containerProps: PropTypes.object,
	inputProps: PropTypes.object,
	leftButtonProps: PropTypes.object,
	rightButtonProps: PropTypes.object,
	buttonTextProps: PropTypes.object,
};

InputSpinner.defaultProps = {
	type: "int",
	skin: null,
	min: 0,
	max: null,
	value: 0,
	initialValue: null,
	step: 1,
	longStep: 0,
	precision: 2,
	rounded: true,
	shadow: false,
	activeOpacity: 0.85,
	color: defaultColor,
	colorPress: defaultColor,
	colorRight: defaultColor,
	colorLeft: defaultColor,
	colorAsBackground: false,
	background: "transparent",
	textColor: null,
	arrows: false,
	showBorder: false,
	fontSize: 14,
	fontFamily: defaultFont,
	buttonFontSize: 25,
	buttonFontFamily: defaultFont,
	buttonTextColor: null,
	buttonPressTextColor: null,
	maxLength: null,
	disabled: false,
	editable: true,
	autoFocus: false,
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
	buttonStyle: null,
	buttonTextStyle: null,
	buttonPressStyle: null,
	buttonPressTextStyle: null,
	inputStyle: null,
	style: null,
	decimalSeparator: ".",
	containerProps: null,
	inputProps: null,
	leftButtonProps: null,
	rightButtonProps: null,
	buttonTextProps: null,
};

export default InputSpinner;
