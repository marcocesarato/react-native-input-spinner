import React, {Component} from "react";
import PropTypes from 'prop-types';
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import SpinnerStyle from './style';

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
        this.state = {
            min: this.parseNum(this.props.min),
            max: this.parseNum(this.props.max),
            value: this.parseNum(this.props.value)
        };
    }

    /**
     * On value change
     * @param num
     */
    onChange(num) {
        if (this.state.disabled) return;
        if (this.state.min <= this.state.value && num >= this.state.min) {
            num = this.parseNum(String(num).replace(/^0+/, ''), 10) || 0;
            if (this.state.max <= num) num = this.state.max;
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
     * Parse number type
     * @param num
     * @returns {*}
     */
    parseNum(num) {
        if (this.props.type === 'float') {
            num = parseFloat(num);
            num = parseFloat(num.toFixed(this.props.precision));
        } else {
            num = parseInt(num);
        }
        return num;
    }

    /**
     * Increase
     */
    increase() {
        if (this.state.disabled) return;
        let num = this.parseNum(this.state.value) + this.props.offset;
        this.onChange(num);
    };

    /**
     * Decrease
     */
    decrease() {
        if (this.state.disabled) return;
        let num = this.parseNum(this.state.value) - this.props.offset;
        this.onChange(num);
    };

    /**
     * Render
     * @returns {*}
     */
    render() {
        return (
            <View style={[SpinnerStyle.container, this.props.style,
                {borderColor: this.props.showBorder ? this.props.color : 'transparent'},
                {width: this.props.width}]}>

                <TouchableOpacity
                    style={[SpinnerStyle.button, this.props.buttonStyle,
                        {backgroundColor: this.props.color},
                        {borderColor: this.props.showBorder ? this.props.color : 'transparent'},
                        {height: this.props.height, width: this.props.height}]}
                    onPress={() => this.decrease()}>

                    <Text style={[SpinnerStyle.buttonText,
                        {color: this.props.buttonTextColor, fontSize: this.props.buttonFontSize}]}>-</Text>

                </TouchableOpacity>

                <TextInput
                    style={[SpinnerStyle.numberText, this.props.inputStyle,
                        {color: this.props.textColor},
                        {fontSize: this.props.fontSize},
                        {borderColor: this.props.showBorder ? this.props.color : 'transparent'},
                        {backgroundColor: this.props.background},
                        {height: this.props.height}]}
                    value={String(this.state.value)}
                    editable={!this.props.disabled}
                    keyboardType={'numeric'}
                    onChangeText={this.onChange.bind(this)}/>

                <TouchableOpacity
                    style={[SpinnerStyle.button, this.props.buttonStyle,
                        {backgroundColor: this.props.color},
                        {borderColor: this.props.showBorder ? this.props.color : 'transparent'},
                        {height: this.props.height, width: this.props.height}]}
                    onPress={() => this.increase()}>

                    <Text style={[SpinnerStyle.buttonText,
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
