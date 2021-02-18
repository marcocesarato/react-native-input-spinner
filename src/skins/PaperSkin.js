import React from "react";
import {mergeViewStyle} from "../Utils";

export const getProps = (props) => {
	console.log(mergeViewStyle(props.style, {padding: 10, borderRadius: 3}));
	return {
		style: mergeViewStyle(props.style, {padding: 10, borderRadius: 3}),
		height: props.height ? props.height : 30,
		shadow: props.shadow ? props.shadow : true,
		color: props.color ? props.color : "#eeeafd",
		background: props.background ? props.background : "#FFF",
		colorPress: props.colorPress ? props.colorPress : "#a28df6",
		buttonTextColor: props.buttonTextColor ? props.buttonTextColor : "#a28df6",
		buttonPressTextColor: props.buttonPressTextColor
			? props.buttonPressTextColor
			: "#FFF",
	};
};
