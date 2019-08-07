import React, {Component} from "react";
import {Text, TextInput, TouchableHighlight, View} from "react-native";
import PropTypes from "prop-types";
import {Style} from "./style";

/**
 * Default Color
 * @type {string}
 */
const defaultColor = "#3E525F";

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

		let spinnerStep = this.parseNum(this.props.step);
		if (!this.typeDecimal() && spinnerStep < 1) {
			spinnerStep = 1;
		}

		this.state = {
			min: this.parseNum(this.props.min),
			max: this.parseNum(this.props.max),
			value: this.parseNum(this.props.value),
			step: spinnerStep,
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
			this.setState({value: this.parseNum(this.props.value)});
		}
		// Parse Min
		if (this.props.min !== prevProps.min) {
			this.setState({min: this.parseNum(this.props.min)});
		}
		// Parse Max
		if (this.props.max !== prevProps.max) {
			this.setState({max: this.parseNum(this.props.max)});
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
	 * On value change
	 * @param num
	 */
	onChange(num) {
		if (this.props.disabled) return;
		const current_value = this.state.value;
		if (String(num).endsWith(".") && !this.getValue().endsWith(".0")) {
			this.decimalInput = true;
		}
		num = this.parseNum(String(num).replace(/^0+/, "")) || 0;
		if (!this.minReached(num)) {
			if (this.maxReached(num)) {
				num = this.state.max;
				if (this.props.onMax) {
					this.props.onMax(this.state.max);
				}
			}
			this.setState({value: num});
		} else {
			if (this.props.onMin) {
				this.props.onMin(this.state.min);
			}
			num = this.state.min;
			this.setState({value: num});
		}
		if (current_value !== num && this.props.onChange) {
			this.props.onChange(num);
		}
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
	 * Parse number type
	 * @param num
	 * @returns {*}
	 */
	parseNum(num) {
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
		if (this.typeDecimal() && this.decimalInput) {
			this.decimalInput = false;
			return this.parseNum(value).toFixed(1);
		} else if (this.typeDecimal()) {
			value = this.parseNum(value).toFixed(this.props.precision);
		}
		return String(this.parseNum(value));
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
	 * Increase
	 */
	increase() {
		if (this.props.disabled) return;
		let num =
			this.parseNum(this.state.value) + this.parseNum(this.state.step);
		if (this.props.onIncrease) {
			let increased_num = num;
			if (this.maxReached(num)) {
				increased_num = this.state.max;
			}
			this.props.onIncrease(increased_num);
		}
		this.onChange(num);
	}

	/**
	 * Decrease
	 */
	decrease() {
		if (this.props.disabled) return;
		let num =
			this.parseNum(this.state.value) - this.parseNum(this.state.step);
		if (this.props.onDecrease) {
			let decreased_num = num;
			if (this.minReached(num)) {
				decreased_num = this.state.min;
			}
			this.props.onDecrease(decreased_num);
		}
		this.onChange(num);
	}

	/**
	 * Max is reached
	 * @param num
	 * @returns {boolean}
	 */
	maxReached(num = null) {
		if (num == null) {
			num = this.state.value;
		}
		return num >= this.state.max;
	}

	/**
	 * Min is reached
	 * @param num
	 * @returns {boolean}
	 */
	minReached(num = null) {
		if (num == null) {
			num = this.state.value;
		}
		return num <= this.state.min;
	}

	/**
	 * Is object empty
	 * @param obj
	 * @returns {boolean}
	 */
	isObjectEmpty(obj) {
		return Object.entries(obj).length === 0 && obj.constructor === Object;
	}

	/**
	 * Is text input editable
	 * @returns {boolean|Boolean}
	 */
	isEditable() {
		return !this.props.disabled && this.props.editable;
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
		return this.props.colorLeft !== defaultColor
			? this.props.colorLeft
			: color;
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
				borderColor: this.props.showBorder
					? this._getColor()
					: "transparent",
				width: this.props.width,
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
				borderColor: this.props.showBorder
					? this._getColor()
					: "transparent",
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
		return this.isObjectEmpty(this.props.buttonPressStyle)
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
		} else if (
			this._isLeftButtonPressed() &&
			this.props.buttonPressLeftImage
		) {
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
				style={buttonStyle}
				onPress={() => this.decrease()}>
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
				style={buttonStyle}
				onPress={() => this.increase()}>
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
			<View style={this._getContainerStyle()}>
				{this._renderLeftButton()}

				{this.props.prepend}

				<TextInput
					style={this._getInputTextStyle()}
					value={this.getValue()}
					editable={this.isEditable()}
					keyboardType={this._getKeyboardType()}
					onChangeText={this.onChange.bind(this)}
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
	disabled: PropTypes.bool,
	editable: PropTypes.bool,
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	onChange: PropTypes.func,
	onMin: PropTypes.func,
	onMax: PropTypes.func,
	onIncrease: PropTypes.func,
	onDecrease: PropTypes.func,
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
};

InputSpinner.defaultProps = {
	type: "int",
	min: 0,
	max: 999,
	value: 0,
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
	disabled: false,
	editable: true,
	width: 150,
	height: 50,
	buttonLeftText: null,
	buttonRightText: null,
	buttonStyle: {},
	buttonPressStyle: {},
	inputStyle: {},
	style: {},
};

export default InputSpinner;
