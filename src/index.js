import React from "react";
import InputSpinner from "./InputSpinner";
import {getSkin} from "./Skins";

// Export
export default (props) => {
	const skinProps = getSkin(props.skin, props);
	const finalProps = {...props, ...skinProps};
	return <InputSpinner {...finalProps} />;
};
