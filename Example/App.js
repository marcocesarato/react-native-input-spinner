import React, {Component} from "react";
import {StyleSheet, Text, View, ScrollView, Image} from "react-native";
import InputSpinner from "react-native-input-spinner";

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: 1,
			valueReal: 1.5,
			colorLeft: this.getRandomColor(),
			colorRight: this.getRandomColor(),
		};
	}

	getRandomColor() {
		var letters = "0123456789ABCDEF";
		var color = "#";
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	render() {
		return (
			<ScrollView style={styles.container}>
				<Text style={styles.title}>
					Example{"\n"}react-native-input-spinner
				</Text>
				<View style={styles.col}>
					<Text style={styles.text}>Standard</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Custom color</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						color={"#40c5f4"}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Arrows</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						arrows
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>
						Custom button text and fontSize
					</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						buttonFontSize={10}
						buttonLeftText={"▲"}
						buttonRightText={"▼"}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Disabled</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						disabled
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Not editable</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						editable={false}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>onChange</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						onChange={(num) => {
							alert("onChange new value: " + num);
						}}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>
						onMin and onMax (min 0, max 3)
					</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						min={0}
						max={3}
						onMax={() => {
							alert("onMax reached!");
						}}
						onMin={() => {
							alert("onMin reached!");
						}}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>
						Min & Max colors (min 0, max 2)
					</Text>
					<InputSpinner
						value={this.state.value + 1}
						style={styles.spinner}
						min={0}
						max={2}
						colorMax={"#f04048"}
						colorMin={"#82cc62"}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>
						Type real (step 0.5, precision 1)
					</Text>
					<InputSpinner
						value={this.state.valueReal}
						style={styles.spinner}
						type={"real"}
						step={0.5}
						precision={1}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>
						Type real (step 0.05, precision 2)
					</Text>
					<InputSpinner
						value={this.state.valueReal}
						style={styles.spinner}
						type={"real"}
						step={0.05}
						precision={2}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>
						rounded false and showBorder
					</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						rounded={false}
						showBorder
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>
						color, background and textColor
					</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						textColor={"#FFF"}
						color={"#25863f"}
						background={"#82cc62"}
						rounded={false}
						showBorder
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Button image</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						color={"#FFF"}
						colorPress={"#0F0"}
						height={50}
						buttonLeftImage={
							<Image
								style={{width: 50, height: 50}}
								source={{
									uri:
										"https://image.flaticon.com/icons/png/512/54/54194.png",
								}}
							/>
						}
						buttonRightImage={
							<Image
								style={{width: 50, height: 50}}
								source={{
									uri:
										"https://image.flaticon.com/icons/png/512/69/69301.png",
								}}
							/>
						}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>colorLeft and colorRight</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						colorPress={"#F00"}
						colorLeft={this.state.colorLeft}
						colorRight={this.state.colorRight}
						onChange={(num) => {
							// ...
							this.setState({
								colorLeft: this.getRandomColor(),
								colorRight: this.getRandomColor(),
							});
						}}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Colors on press</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						color={"#C4C4C4"}
						colorPress={"#F00"}
						buttonTextColor={"#000"}
						buttonPressTextColor={"#FFF"}
					/>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Children</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}>
						<Text style={styles.simbol}>$</Text>
					</InputSpinner>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Prepend and append</Text>
					<InputSpinner
						value={this.state.value}
						style={styles.spinner}
						append={<Text style={styles.simbol}>Append</Text>}
						prepend={<Text style={styles.simbol}>Prepend</Text>}>
						<Text style={styles.simbol}>$</Text>
					</InputSpinner>
				</View>
				<View style={styles.col}>
					<Text style={styles.text}>Mixed</Text>
					<InputSpinner
						style={styles.spinner}
						value={80}
						min={18}
						max={48}
						step={2}
						rounded={false}
						showBorder={true}
						height={35}
						editable={false}
						onChange={(value) => {
							this.setState({value: value});
						}}
					/>
				</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({
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
		width: "auto",
		minWidth: 300,
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
