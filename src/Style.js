import {Platform, StyleSheet} from "react-native";

/**
 * Palette constants
 */
export const defaultColor = "#3E525F";
export const defaultTransparent = "#FFFFFF00";
export const defaultFont = Platform.select({
	ios: "System",
	android: "System",
	web: "sans-serif",
});

/**
 * Default style
 */
export const Style = StyleSheet.create({
	container: {
		borderRadius: 4,
		flexDirection: "row",
		overflow: "visible",
		width: 150,
		alignItems: "center",
		justifyContent: "center",
	},
	containerShadow: {
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 6,
		},
		shadowOpacity: 0.39,
		shadowRadius: 8.3,

		elevation: 10,
	},
	buttonLeft: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 2,
		borderBottomRightRadius: 0,
		borderTopRightRadius: 0,
	},
	buttonRight: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 2,
		borderBottomLeftRadius: 0,
		borderTopLeftRadius: 0,
	},
	buttonRounded: {
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 999,
		...Platform.select({
			web: {
				outlineWidth: 0,
			},
		}),
	},
	buttonText: {
		color: "white",
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
		textAlignVertical: "center",
	},
	numberText: {
		flexGrow: 1,
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
		textAlignVertical: "center",
		borderWidth: 0,
		...Platform.select({
			web: {
				width: "100%",
				outlineWidth: 0,
			},
		}),
	},
});
