import React from "react";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	return {
		shadow: props.shadow ? props.shadow : true,
		colorAsBackground: true,
		textColor: "#000",
		inputStyle: mergeViewStyle(props.inputStyle, {
			backgroundColor: "#FFF",
		}),
	};
};
