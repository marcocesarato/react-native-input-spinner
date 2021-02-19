import * as CleanSkin from "./skins/CleanSkin";
import * as ModernSkin from "./skins/ModernSkin";
import * as PaperSkin from "./skins/PaperSkin";
import * as RoundSkin from "./skins/RoundSkin";
import * as SquareSkin from "./skins/SquareSkin";

/**
 * Get skin props
 * @returns {*}
 */
export const getSkin = (skin, props) => {
	skin = String(props.skin).trim().toLowerCase();
	switch (skin) {
		case "clean":
			return CleanSkin.getProps(props);
		case "modern":
			return ModernSkin.getProps(props);
		case "paper":
			return PaperSkin.getProps(props);
		case "round":
			return RoundSkin.getProps(props);
		case "square":
			return SquareSkin.getProps(props);
		default:
			return {};
	}
};
