import React from "react";
import InputSpinner from "./InputSpinner";
import {getSkin} from "./Skins";

// Export
export default (props) => {
	const skin = String(props.skin).trim().toLowerCase();
	const skinProps = getSkin(skin, props);
	const overwriteProps = {...props, ...skinProps};
	return <InputSpinner {...overwriteProps} />;
};
