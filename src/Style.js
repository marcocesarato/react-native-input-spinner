/**
 * Input Spinner - Style
 * @author Marco Cesarato <cesarato.developer@gmail.com>
 */

import {Platform, StyleSheet} from "react-native";

export const Style = StyleSheet.create({
	container: {
		borderWidth: 0.5,
		borderRadius: 4,
		flexDirection: "row",
		overflow: "hidden",
		width: 150,
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
				outline: "none"
			},
		})
	},
	buttonText: {
		color: "white",
		textAlign: "center",
	},
	numberText: {
		flex: 1,
		textAlign: "center",
		justifyContent: "center",
		borderWidth: 0,
		...Platform.select({
			web: {
				outlineWidth: 0,
				outline: "none"
			},
		})
	},
});
