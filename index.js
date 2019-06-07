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

        let spinner_step = this.parseNum(this.props.step);
        if (!this.isTypeDecimal() && spinner_step < 1) {
            spinner_step = 1;
        }

        this.state = {
            min: this.parseNum(this.props.min),
            max: this.parseNum(this.props.max),
            value: this.parseNum(this.props.value),
            step: spinner_step,
            disabled: this.props.disabled,
            width: this.props.width,
            height: this.props.height,
            color: this.props.color,
            type: this.props.type,
        };
    }

    /**
     * Component did update
     * @param prevProps
     * @returns {*}
     */
    componentDidUpdate(prevProps) {
        if (this.props.disabled !== prevProps.disabled) {
            this.setState({disabled: this.props.disabled});
        } else if (this.props.min !== prevProps.min) {
            this.setState({min: this.parseNum(this.props.min)});
        } else if (this.props.max !== prevProps.max) {
            this.setState({max: this.parseNum(this.props.max)});
        } else if (this.props.value !== prevProps.value) {
            this.setState({value: this.parseNum(this.props.value)});
        } else if (this.props.width !== prevProps.width) {
            this.setState({width: this.props.width});
        } else if (this.props.height !== prevProps.height) {
            this.setState({height: this.props.height});
        } else if (this.props.color !== prevProps.color) {
            this.setState({color: this.props.color});
        } else if (this.props.type !== prevProps.type) {
            this.setState({type: this.props.type});
        }
    }

    /**
     * On value change
     * @param num
     */
    onChange(num) {
        if (this.state.disabled) return;
        let current_value = this.state.value;
        num = this.parseNum(String(num).replace(/^0+/, '')) || 0;
        if (num >= this.state.min) {
            if (this.state.max <= num) {
                num = this.state.max;
                if (this.props.onReachMax) {
                    this.props.onReachMax(this.state.max);
                }
            }
            this.setState({value: num});
        } else {
            if (this.props.onReachMin) {
                this.props.onReachMin(this.state.min);
            }
            num = this.state.min;
            this.setState({value: num});
        }
        if (current_value !== num && this.props.onChange) {
            this.props.onChange(num);
        }
    };

    /**
     * Detect if type is decimal
     * @returns {boolean}
     */
    isTypeDecimal() {
        let type = this.getType();
        return (type === 'float' || type === 'double' || type === 'decimal' || type === 'real' );
    }

    /**
     * Parse number type
     * @param num
     * @returns {*}
     */
    parseNum(num) {
        if (this.isTypeDecimal()) {
            num = parseFloat(num);
        } else {
            num = parseInt(num);
        }
        if(isNaN(num)){
            num = 0;
        }
        return num;
    }

    /**
     * Convert value to string
     * @returns {string}
     */
    getValue() {
        if (this.isTypeDecimal()) {
            return this.parseNum(this.state.value).toFixed(this.props.precision);
        }
        return String(this.parseNum(this.state.value));
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
     * Increase
     */
    increase() {
        if (this.state.disabled) return;
        let num = this.parseNum(this.state.value) + this.parseNum(this.state.step);
        if (this.props.onIncrease) {
            this.props.onIncrease(num);
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
            this.props.onDecrease(num);
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
            if (this.isTypeDecimal()) {
                keyboardType = "number-pad"
            } else {
                keyboardType = "decimal-pad"
            }
        }

        return (
            <View style={[Style.container, this.props.style,
                {borderColor: this.props.showBorder ? this.state.color : 'transparent'},
                {width: this.state.width}]}>

                <TouchableOpacity
                    style={[Style.button, this.props.buttonStyle,
                        {backgroundColor: this.state.color},
                        {borderColor: this.props.showBorder ? this.state.color : 'transparent'},
                        {height: this.state.height, width: this.state.height}]}
                    onPress={() => this.decrease()}>

                    <Text style={[Style.buttonText,
                        {color: this.props.buttonTextColor, fontSize: this.props.buttonFontSize}]}>-</Text>

                </TouchableOpacity>

                <TextInput
                    style={[Style.numberText, this.props.inputStyle,
                        {color: this.props.textColor},
                        {fontSize: this.props.fontSize},
                        {borderColor: this.props.showBorder ? this.state.color : 'transparent'},
                        {backgroundColor: this.props.background},
                        {height: this.props.height}]}
                    value={this.getValue()}
                    editable={!this.state.disabled}
                    keyboardType={keyboardType}
                    onChangeText={this.onChange.bind(this)}/>

                <TouchableOpacity
                    style={[Style.button, this.props.buttonStyle,
                        {backgroundColor: this.state.color},
                        {borderColor: this.props.showBorder ? this.state.color : 'transparent'},
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
    color: PropTypes.string,
    background: PropTypes.string,
    textColor: PropTypes.string,
    showBorder: PropTypes.bool,
    fontSize: PropTypes.number,
    buttonFontSize: PropTypes.number,
    buttonTextColor: PropTypes.string,
    disabled: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,
    onChange: PropTypes.func,
    onReachMin: PropTypes.func,
    onReachMax: PropTypes.func,
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
    color: '#3e525f',
    background: 'transparent',
    textColor: '#000000',
    showBorder: false,
    fontSize: 14,
    buttonFontSize: 25,
    buttonTextColor: 'white',
    disabled: false,
    width: 150,
    height: 50,
    buttonStyle: {},
    inputStyle: {},
    style: {},
};

export default InputSpinner;
