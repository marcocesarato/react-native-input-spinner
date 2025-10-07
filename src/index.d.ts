import React, {Component} from "react";
import {
	NativeSyntheticEvent,
	StyleProp,
	TextInputFocusEventData,
	TextInputKeyPressEventData,
	TextProps,
	ViewStyle,
} from "react-native";

export interface ReactNativeInputSpinnerProps {
	type?: string;
	skin?: "clean" | "modern" | "paper" | "round" | "square";
	min?: string | number;
	max?: string | number;
	value?: string | number;
	initialValue?: string | number;
	step?: string | number;
	longStep?: string | number;
	precision?: number;
	shadow?: boolean;
	rounded?: boolean;
	activeOpacity?: number;
	color?: string;
	colorPress?: string;
	colorRight?: string;
	colorLeft?: string;
	colorMax?: string;
	colorMin?: string;
	colorAsBackground?: boolean;
	background?: string;
	textColor?: string;
	arrows?: boolean;
	showBorder?: boolean;
	fontSize?: number;
	fontFamily?: string;
	buttonFontSize?: number;
	buttonFontFamily?: string;
	buttonTextColor?: string;
	maxLength?: number;
	disabled?: boolean;
	editable?: boolean;
	autoFocus?: boolean;
	selectTextOnFocus?: boolean;
	placeholder?: string;
	placeholderTextColor?: string;
	selectionColor?: string;
	returnKeyLabel?: string;
	returnKeyType?: string;
	width?: string | number;
	height?: string | number;
	onChange?: (value: number | null) => void | false | number;
	onFocus?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	onBlur?: (e: NativeSyntheticEvent<TextInputFocusEventData>) => void;
	onKeyPress?: (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => void;
	onMin?: (value: number) => void;
	onMax?: (value: number) => void;
	onIncrease?: (value: number) => void;
	onDecrease?: (value: number) => void;
	onSubmit?: (value: number) => void;
	onLongPress?: (value: number) => void;
	accelerationDelay?: number;
	delayPressIn?: number;
	delayPressOut?: number;
	speed?: number;
	emptied?: boolean;
	continuity?: boolean;
	typingTime?: number;
	buttonLeftDisabled?: boolean;
	buttonRightDisabled?: boolean;
	buttonLeftText?: string;
	buttonRightText?: string;
	buttonLeftImage?: React.ReactElement;
	buttonRightImage?: React.ReactElement;
	buttonPressLeftImage?: React.ReactElement;
	buttonPressRightImage?: React.ReactElement;
	buttonStyle?: StyleProp<ViewStyle>;
	buttonTextStyle?: StyleProp<ViewStyle>;
	buttonPressStyle?: StyleProp<ViewStyle>;
	buttonPressTextStyle?: StyleProp<ViewStyle>;
	inputStyle?: StyleProp<ViewStyle>;
	style?: StyleProp<ViewStyle>;
	append?: React.ReactElement;
	prepend?: React.ReactElement;
	decimalSeparator?: string;
	containerProps?: object;
	inputProps?: object;
	leftButtonProps?: object;
	rightButtonProps?: object;
	buttonTextProps?: TextProps;
	formatter?: (value: number) => string;
}
export default class InputSpinner extends Component<ReactNativeInputSpinnerProps> {}
