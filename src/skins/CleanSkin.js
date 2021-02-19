import React from "react";

export const getProps = (props) => {
	return {
		shadow: props.shadow ? props.shadow : true,
		color: props.color ? props.color : "#FFF",
		background: props.background ? props.background : "#FFF",
		buttonTextColor: props.buttonTextColor ? props.buttonTextColor : "#000",
		buttonPressTextColor: props.buttonPressTextColor
			? props.buttonPressTextColor
			: "#888",
	};
};
