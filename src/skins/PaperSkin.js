import React from "react";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	const colorFallback = props.color ? props.color : "#eeeafd";
	const colorPressFallback = props.colorPress ? props.colorPress : "#a28df6";
	return {
		style: mergeViewStyle(props.style, {padding: 10, borderRadius: 3}),
		height: props.height ? props.height : 30,
		shadow: props.shadow ? props.shadow : true,
		background: props.background ? props.background : "#FFF",
		color: colorFallback,
		colorPress: props.colorPress ? props.colorPress : colorPressFallback,
		buttonTextColor: colorPressFallback,
		buttonPressTextColor: "auto",
	};
};
