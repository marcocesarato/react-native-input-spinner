import React, {Component} from "react";
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import InputSpinner from "react-native-input-spinner";

export default class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            value: 1,
            valueReal: 1.5
        }
    }

    render(){
        return (
            <ScrollView style={styles.container}>
                <Text style={styles.title}>Example{"\n"}react-native-input-spinner</Text>
                <View style={styles.col}>
                    <Text style={styles.text}>Standard</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Custom color</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        color={"#40c5f4"}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Arrows</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        arrow/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Disabled</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        disabled/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Not editable</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        editable/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>onChange</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        onChange={(num)=>{alert('onChange new value: ' + num)}}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>onMin and onMax (min 0, max 3)</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        min={0}
                        max={3}
                        onMax={() => {alert('onMax reached!')}}
                        onMin={() => {alert('onMin reached!')}}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Min & Max colors (min 0, max 2)</Text>
                    <InputSpinner
                        value={this.state.value + 1}
                        style={styles.spinner}
                        min={0}
                        max={2}
                        colorMax={"#f04048"}
                        colorMin={"#82cc62"}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Type real (step 0.5, precision 1)</Text>
                    <InputSpinner
                        value={this.state.valueReal}
                        style={styles.spinner}
                        type={'real'}
                        step={0.5}
                        precision={1}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Type real (step 0.05, precision 2)</Text>
                    <InputSpinner
                        value={this.state.valueReal}
                        style={styles.spinner}
                        type={'real'}
                        step={0.05}
                        precision={2}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>rounded false and showBorder</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        rounded={false}
                        showBorder/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>color, background and textColor</Text>
                    <InputSpinner
                        value={this.state.value}
                        style={styles.spinner}
                        textColor={"#FFF"}
                        color={"#25863f"}
                        background={"#82cc62"}
                        rounded={false}
                        showBorder/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 40,
    },
    col: {
        flex: 1,
        marginBottom: 20,
        flexDirection: 'row',
    },
    text: {
        flex: 3,
        marginRight: 20,
    },
    title: {
        marginBottom: 40,
        fontSize: 30
    },
    spinner: {
        flex: 1,
        width: "auto",
        minWidth: 150,
    }
});
