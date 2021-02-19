import React from "react";
import InputSpinner from "./InputSpinner";

// Skins
import * as CleanSkin from "./skins/CleanSkin";
import * as ModernSkin from "./skins/ModernSkin";
import * as PaperSkin from "./skins/PaperSkin";
import * as RoundSkin from "./skins/RoundSkin";
import * as SquareSkin from "./skins/SquareSkin";

// Export
export default (props) => {
	const skin = String(props.skin).trim().toLowerCase();
	let skinProps;
	switch (skin) {
		case "clean":
			skinProps = CleanSkin.getProps(props);
			break;
		case "modern":
			skinProps = ModernSkin.getProps(props);
			break;
		case "paper":
			skinProps = PaperSkin.getProps(props);
			break;
		case "round":
			skinProps = RoundSkin.getProps(props);
			break;
		case "square":
			skinProps = SquareSkin.getProps(props);
			break;
		default:
			skinProps = {};
	}
	let overwriteProps = {...props, ...skinProps};
	return <InputSpinner {...overwriteProps} />;
};
