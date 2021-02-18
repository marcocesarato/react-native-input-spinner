import {Platform} from "react-native";
import React from "react";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	return {
		style: mergeViewStyle(props.style, {
			minWidth: 150,
			maxWidth: 150,
		}),
		shadow: props.shadow ? props.shadow : true,
		width: props.width ? props.width : 150,
		background: props.background ? props.background : "#898aff",
		color: props.color ? props.color : "#898aff",
		colorPress: props.colorPress ? props.colorPress : "#898aff",
		buttonTextColor: props.buttonTextColor ? props.buttonTextColor : "#dbd2ef",
		buttonPressTextColor: props.buttonPressTextColor
			? props.buttonPressTextColor
			: "#EEE",
		inputStyle: mergeViewStyle(props.sinputStyletyle, {
			borderRadius: 30,
			backgroundColor: "#FFF",
			minWidth: 50,
			maxWidth: 50,
			height: 50,
		}),
	};
};
