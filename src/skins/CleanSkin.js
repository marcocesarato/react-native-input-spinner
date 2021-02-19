import React from "react";

export const getProps = (props) => {
	const backgroundFallback = props.background ? props.background : "#FFF";
	return {
		shadow: props.shadow ? props.shadow : true,
		color: backgroundFallback,
		colorAsBackground: true,
	};
};
