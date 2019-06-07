import React, {Component} from "react";
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
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

        let spinner_offset = this.parseNum(this.props.offset);
        if(!this.typeDecimal() && spinner_offset < 1){
            spinner_offset = 1;
        }

        this.state = {
            min: this.parseNum(this.props.min),
            max: this.parseNum(this.props.max),
            value: this.parseNum(this.props.value),
            offset: spinner_offset,
            disabled: this.props.disabled,
            width: this.props.width,
            height: this.props.height,
            color: this.props.color,
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
        }
    }

    /**
     * On value change
     * @param num
     */
    onChange(num) {
        if (this.state.disabled) return;
        num = this.parseNum(String(num).replace(/^0+/, '')) || 0;
        if (num >= this.state.min) {

            if (this.state.max <= num) {
                num = this.state.max;
            }

            this.setState({value: num});
            if (this.props.onChange) {
                this.props.onChange(num);
            }
        }
        if (this.props.onChange) {
            this.props.onChange(num);
        }
    };

    /**
     * Detect if type is decimal
     * @returns {boolean}
     */
    typeDecimal() {
        return (this.props.type === 'float' ||
            this.props.type === 'double' ||
            this.props.type === 'decimal');
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
        return num;
    }

    /**
     * Convert value to string
     * @returns {string}
     */
    getValue() {
        if (this.typeDecimal()) {
            return this.parseNum(this.state.value).toFixed(this.props.precision);
        }
        return String(this.parseNum(this.state.value));
    }

    /**
     * Increase
     */
    increase() {
        if (this.state.disabled) return;
        let num = this.parseNum(this.state.value) + this.parseNum(this.state.offset);
        this.onChange(num);
    }

    /**
     * Decrease
     */
    decrease() {
        if (this.state.disabled) return;
        let num = this.parseNum(this.state.value) - this.parseNum(this.state.offset);
        this.onChange(num);
    }

    /**
     * Render
     * @returns {*}
     */
    render() {
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
                    editable={!this.props.disabled}
                    keyboardType={'numeric'}
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
    min: PropTypes.number,
    max: PropTypes.number,
    type: PropTypes.string,
    value: PropTypes.number,
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
    offset: PropTypes.number,
    precision: PropTypes.number,
    onChange: PropTypes.func,
    buttonStyle: PropTypes.object,
    inputStyle: PropTypes.object,
    style: PropTypes.object,
};

InputSpinner.defaultProps = {
    min: 0,
    max: 999,
    type: 'int',
    value: 0,
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
    offset: 1,
    precision: 2,
    buttonStyle: {},
    inputStyle: {},
    style: {},
};

export default InputSpinner;
