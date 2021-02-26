import {StatusBar, StyleSheet} from "react-native";

export default StyleSheet.create({
	mainContainer: {
		flex: 1,
		marginTop: StatusBar.currentHeight || 0,
	},
	item: {
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: "row",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		textAlignVertical: "center",
	},
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
		paddingTop: 40,
	},
	col: {
		flex: 1,
		marginBottom: 20,
		flexDirection: "row",
		alignItems: "center",
		textAlign: "left",
		textAlignVertical: "center",
	},
	text: {
		flex: 3,
		marginRight: 20,
	},
	title: {
		marginBottom: 40,
		fontSize: 30,
	},
	spinner: {
		flex: 1,
		marginRight: 10,
		minWidth: 150,
	},
	simbol: {
		marginLeft: 10,
		marginRight: 10,
		height: "100%",
		justifyContent: "center",
		alignItems: "center",
		textAlign: "center",
		textAlignVertical: "center",
		lineHeight: 50,
	},
});
