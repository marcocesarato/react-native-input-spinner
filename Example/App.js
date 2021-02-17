import React, {Component} from "react";
import {
	Text,
	View,
	ScrollView,
	Image,
	FlatList,
	SafeAreaView,
	Button,
} from "react-native";
import InputSpinner from "react-native-input-spinner";
import Styles from "./Styles";

export default class App extends Component {
	constructor(props) {
		super(props);
		let data = [];
		for (var i = 0; i < 10; i++) {
			data.push({
				key: String(i),
				value: Math.floor(Math.random() * 100) + 1,
			});
		}
		this.state = {
			value: 1,
			valueReal: 1.5,
			colorLeft: this.getRandomColor(),
			colorRight: this.getRandomColor(),
			data: data,
		};
	}

	renderItem({item}) {
		return (
			<View style={Styles.item}>
				<Text style={{marginRight: 20}}>
					Key: {item.key}
					{"\n"}Value: {item.value}
				</Text>
				<View style={{marginRight: 20}}>
					<Button
						style={{marginRight: 20}}
						onPress={() => {
							var data = this.state.data;
							data[item.key].value = data[item.key].value - 5;
							this.setState({data: data});
						}}
						title="- 5"
					/>
				</View>
				<View style={{marginRight: 20}}>
					<Button
						onPress={() => {
							var data = this.state.data;
							data[item.key].value = data[item.key].value + 5;
							this.setState({data: data});
						}}
						title="+ 5"
					/>
				</View>
				<InputSpinner
					value={item.value}
					style={Styles.spinner}
					onChange={(num) => {
						var data = this.state.data;
						data[item.key].value = num;
						this.setState({data: data});
					}}
				/>
			</View>
		);
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
			<SafeAreaView style={Styles.mainContainer}>
				<ScrollView style={Styles.container}>
					<Text style={Styles.title}>
						Example{"\n"}react-native-input-spinner
					</Text>
					<View style={Styles.col}>
						<Text style={Styles.text}>Standard</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Custom color</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							color={"#40c5f4"}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Arrows</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							arrows
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>
							Custom button text and fontSize
						</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							buttonFontSize={10}
							buttonLeftText={"▲"}
							buttonRightText={"▼"}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Disabled</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							disabled
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Not editable</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							editable={false}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>onChange</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							onChange={(num) => {
								alert("onChange new value: " + num);
							}}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>
							onMin and onMax (min 0, max 3)
						</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
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
					<View style={Styles.col}>
						<Text style={Styles.text}>
							Min & Max colors (min 5, max 10)
						</Text>
						<InputSpinner
							value={this.state.value + 1}
							style={Styles.spinner}
							min={5}
							max={10}
							colorMax={"#f04048"}
							colorMin={"#82cc62"}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>
							Type real (step 0.5, precision 1)
						</Text>
						<InputSpinner
							value={this.state.valueReal}
							style={Styles.spinner}
							type={"real"}
							step={0.5}
							precision={1}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>
							Type real (step 0.05, precision 2)
						</Text>
						<InputSpinner
							value={this.state.valueReal}
							style={Styles.spinner}
							type={"real"}
							step={0.05}
							precision={2}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>
							rounded false and showBorder
						</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							rounded={false}
							showBorder
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>
							color, background and textColor
						</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							textColor={"#FFF"}
							color={"#25863f"}
							background={"#82cc62"}
							rounded={false}
							showBorder
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Button image</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
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
					<View style={Styles.col}>
						<Text style={Styles.text}>
							colorLeft and colorRight
						</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
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
					<View style={Styles.col}>
						<Text style={Styles.text}>Colors on press</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							color={"#C4C4C4"}
							colorPress={"#F00"}
							buttonTextColor={"#000"}
							buttonPressTextColor={"#FFF"}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Children</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}>
							<Text style={Styles.simbol}>$</Text>
						</InputSpinner>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Prepend and append</Text>
						<InputSpinner
							value={this.state.value}
							style={Styles.spinner}
							append={<Text style={Styles.simbol}>Append</Text>}
							prepend={
								<Text style={Styles.simbol}>Prepend</Text>
							}>
							<Text style={Styles.simbol}>$</Text>
						</InputSpinner>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Placeholder</Text>
						<InputSpinner
							style={Styles.spinner}
							placeholder={"Placeholder"}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>Mixed</Text>
						<InputSpinner
							style={Styles.spinner}
							value={80}
							min={18}
							max={48}
							step={2}
							rounded={false}
							showBorder={true}
							editable={false}
							onChange={(value) => {
								this.setState({value: value});
							}}
						/>
					</View>
					<View style={Styles.col}>
						<Text style={Styles.text}>
							Emptied (
							{this.state.value == null
								? "null"
								: this.state.value}
							)
						</Text>
						<InputSpinner
							style={Styles.spinner}
							step={1}
							max={10}
							min={1}
							emptied={true}
							value={this.state.value}
							onChange={(value) => {
								this.setState({value: value});
							}}
						/>
					</View>
					<Text style={Styles.title}>List</Text>
					<FlatList
						style={{height: 500}}
						data={this.state.data}
						renderItem={this.renderItem.bind(this)}
						keyExtractor={(item) => item.key}
					/>
				</ScrollView>
			</SafeAreaView>
		);
	}
}
