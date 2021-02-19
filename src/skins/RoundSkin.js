import React from "react";
import {defaultColor} from "../Style";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	return {
		shadow: props.shadow ? props.shadow : true,
		background: props.color ? props.color : defaultColor,
		buttonPressTextColor: props.buttonPressTextColor
			? props.buttonPressTextColor
			: "#EEE",
		inputStyle: mergeViewStyle(props.inputStyle, {
			backgroundColor: "#FFF",
		}),
	};
};
