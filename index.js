import React, {Component} from "react";
import {Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import PropTypes from 'prop-types';
import Style from './style';

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
        if (!this.isRealType() && spinnerStep < 1) {
            spinnerStep = 1;
        }

        let colorMin = this.props.colorMin;
        let colorMax = this.props.colorMax;

        if(colorMin == null){
            colorMin = this.props.color;
        }

        if(colorMax == null){
            colorMax = this.props.color;
        }

        this.state = {
            min: this.parseNum(this.props.min),
            max: this.parseNum(this.props.max),
            value: this.parseNum(this.props.value),
            step: spinnerStep,
            disabled: this.props.disabled,
            width: this.props.width,
            height: this.props.height,
            color: this.props.color,
            colorMin: colorMin,
            colorMax: colorMax,
            type: this.props.type,
        };
    }

    /**
     * Component did update
     * @param prevProps
     * @returns {*}
     */
    componentDidUpdate(prevProps) {

        // Disabled
        if (this.props.disabled !== prevProps.disabled) {
            this.setState({disabled: this.props.disabled});
        }

        // Min
        if (this.props.min !== prevProps.min) {
            this.setState({min: this.parseNum(this.props.min)});
        }

        // Max
        if (this.props.max !== prevProps.max) {
            this.setState({max: this.parseNum(this.props.max)});
        }

        // Value
        if (this.props.value !== prevProps.value) {
            this.setState({value: this.parseNum(this.props.value)});
        }

        // Width
        if (this.props.width !== prevProps.width) {
            this.setState({width: this.props.width});
        }

        // Height
        if (this.props.height !== prevProps.height) {
            this.setState({height: this.props.height});
        }

        // Color Min
        if (this.props.colorMin !== prevProps.colorMin) {
            this.setState({colorMin: this.props.colorMin});
        }

        // Color Max
        if (this.props.colorMax !== prevProps.colorMax) {
            this.setState({colorMax: this.props.colorMax});
        }

        // Color
        if (this.props.color !== prevProps.color) {
            let newState = {color: this.props.color};

            if(prevProps.color == prevProps.colorMin){
                newState.colorMin = this.props.color;
            }

            if(prevProps.color == prevProps.colorMax){
                newState.colorMax = this.props.color;
            }
            this.setState(newState);
        }

        // Type
        if (this.props.type !== prevProps.type) {
            this.setState({type: this.props.type});
        }
    }

    /**
     * On value change
     * @param num
     */
    onChange(num) {
        if (this.state.disabled) return;
        const current_value = this.state.value;
        if(String(num).endsWith('.')){
            this.end_point = true;
        }
        num = this.parseNum(String(num).replace(/^0+/, '')) || 0;
        if (num >= this.state.min) {
            if (this.state.max <= num) {
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
     * Round number to props precision
     * @param num
     */
    roundNum(num){
        return Number(Math.round(num + "e+" + this.props.precision) + "e-" + this.props.precision);
    }

    /**
     * Parse number type
     * @param num
     * @returns {*}
     */
    parseNum(num) {
        if (this.isRealType()) {
            num = parseFloat(num);
        } else {
            num = parseInt(num);
        }
        if(isNaN(num)){
            num = 0;
        }
        if (this.isRealType()) {
            num = this.roundNum(num);
        }
        return num;
    }

    /**
     * Convert value to string
     * @returns {string}
     */
    getValue() {
        let value = this.state.value;
        if (this.isRealType() && this.end_point) {
            this.end_point = false;
            return this.parseNum(value).toFixed(1);
        }
        return String(this.parseNum(value));
    }

    /**
     * Get Type
     * @returns {String}
     */
    getType(){
        let type = this.props.type;
        if(this.state instanceof Object && this.state.type != null){
            type = this.state.type;
        }
        return String(type).toLowerCase();
    }

    /**
     * Detect if type is decimal
     * @returns {boolean}
     */
    isRealType() {
        let type = this.getType();
        return (type === 'float' || type === 'double' || type === 'decimal' || type === 'real' );
    }

    /**
     * Increase
     */
    increase() {
        if (this.state.disabled) return;
        let num = this.parseNum(this.state.value) + this.parseNum(this.state.step);
        if (this.props.onIncrease) {
            let increased_num = num;
            if (num > this.state.max) {
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
        if (this.state.disabled) return;
        let num = this.parseNum(this.state.value) - this.parseNum(this.state.step);
        if (this.props.onDecrease) {
            let decreased_num = num;
            if (num < this.state.min) {
                decreased_num = this.state.min;
            }
            this.props.onDecrease(decreased_num);
        }
        this.onChange(num);
    }

    /**
     * Render
     * @returns {*}
     */
    render() {

        let keyboardType = "numeric";
        if (Platform.OS) {
            if (this.isRealType()) {
                keyboardType = "number-pad"
            } else {
                keyboardType = "decimal-pad"
            }
        }

        let isMax = (this.state.value === this.state.max);
        let isMin = (this.state.value === this.state.min);

        let color = (isMax ? this.state.colorMax : (isMin ? this.state.colorMin : this.state.color));

        return (
            <View style={[Style.container, this.props.style,
                {borderColor: this.props.showBorder ? color : 'transparent'},
                {width: this.state.width}]}>

                <TouchableOpacity
                    style={[(this.props.rounded ? Style.buttonRounded : Style.button), this.props.buttonStyle,
                        {backgroundColor: color},
                        {borderColor: this.props.showBorder ? color : 'transparent'},
                        {height: this.state.height, width: this.state.height}]}
                    onPress={() => this.decrease()}>

                    <Text style={[Style.buttonText,
                        {color: this.props.buttonTextColor, fontSize: this.props.buttonFontSize}]}>-</Text>

                </TouchableOpacity>

                <TextInput
                    style={[Style.numberText, this.props.inputStyle,
                        {color: this.props.textColor},
                        {fontSize: this.props.fontSize},
                        {borderColor: this.props.showBorder ? color : 'transparent'},
                        {backgroundColor: this.props.background},
                        {height: this.props.height}]}
                    value={this.getValue()}
                    editable={(!this.state.disabled && this.props.editable)}
                    keyboardType={keyboardType}
                    onChangeText={this.onChange.bind(this)}/>

                <TouchableOpacity
                    style={[(this.props.rounded ? Style.buttonRounded : Style.button), this.props.buttonStyle,
                        {backgroundColor: color},
                        {borderColor: this.props.showBorder ? color : 'transparent'},
                        {height: this.state.height, width: this.state.height}]}
                    onPress={() => this.increase()}>

                    <Text style={[Style.buttonText,
                        {color: this.props.buttonTextColor, fontSize: this.props.buttonFontSize}]}>+</Text>

                </TouchableOpacity>
            </View>
        )
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
    color: PropTypes.string,
    colorMax: PropTypes.string,
    colorMin: PropTypes.string,
    background: PropTypes.string,
    textColor: PropTypes.string,
    showBorder: PropTypes.bool,
    fontSize: PropTypes.number,
    buttonFontSize: PropTypes.number,
    buttonTextColor: PropTypes.string,
    disabled: PropTypes.bool,
    editable: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    onChange: PropTypes.func,
    onMin: PropTypes.func,
    onMax: PropTypes.func,
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func,
    buttonStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    style: PropTypes.object,
};

InputSpinner.defaultProps = {
    type: 'int',
    min: 0,
    max: 999,
    value: 0,
    step: 1,
    precision: 2,
    rounded: true,
    color: '#3e525f',
    background: 'transparent',
    textColor: '#000000',
    showBorder: false,
    fontSize: 14,
    buttonFontSize: 25,
    buttonTextColor: 'white',
    disabled: false,
    editable: true,
    width: 150,
    height: 50,
    buttonStyle: {},
    inputStyle: {},
    style: {},
};

export default InputSpinner;