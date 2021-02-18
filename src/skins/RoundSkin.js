import React from "react";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	return {
		shadow: props.shadow ? props.shadow : true,
		background: props.color ? props.color : "#3E525F",
		buttonPressTextColor: props.buttonPressTextColor
			? props.buttonPressTextColor
			: "#EEE",
		inputStyle: mergeViewStyle(props.inputStyle, {
			backgroundColor: "#FFF",
		}),
	};
};
