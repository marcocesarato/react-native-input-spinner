import React from "react";
import InputSpinner from "./InputSpinner";
import {getSkin} from "./Skins";

// Export
export default React.forwardRef((props, ref) => {
	const skinProps = getSkin(props.skin, props);
	const finalProps = {...props, ...skinProps};
	return <InputSpinner {...finalProps} ref={ref} />;
});
