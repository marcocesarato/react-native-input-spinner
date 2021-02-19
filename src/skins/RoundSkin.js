import React from "react";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	return {
		shadow: props.shadow ? props.shadow : true,
		colorAsBackground: true,
		buttonPressTextColor: props.buttonPressTextColor
			? props.buttonPressTextColor
			: "#EEE",
		inputStyle: mergeViewStyle(props.inputStyle, {
			backgroundColor: "#FFF",
		}),
	};
};
