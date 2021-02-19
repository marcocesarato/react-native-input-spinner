import React from "react";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	const colorFallback = props.color ? props.color : "#333";
	const backgroundFallback = props.background ? props.background : "#FFF";
	return {
		shadow: props.shadow ? props.shadow : true,
		color: backgroundFallback,
		colorAsBackground: true,
		buttonTextColor: props.buttonTextColor
			? props.buttonTextColor
			: colorFallback,
		buttonPressTextColor: props.buttonPressTextColor
			? props.buttonPressTextColor
			: "#888",
		inputStyle: mergeViewStyle(props.inputStyle, {
			backgroundColor: props.background ? props.background : backgroundFallback,
		}),
	};
};
