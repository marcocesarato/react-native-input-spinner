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
                        value={this.state.value}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Custom color</Text>
                    <InputSpinner
                        value={this.state.value}
                        color={"#40c5f4"}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Disabled</Text>
                    <InputSpinner
                        value={this.state.value}
                        disabled={true}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Not editable</Text>
                    <InputSpinner
                        value={this.state.value}
                        editable={false}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>onChange</Text>
                    <InputSpinner
                        value={this.state.value}
                        onChange={(num)=>{alert('onChange new value: ' + num)}}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>onMin and onMax (min 0, max 3)</Text>
                    <InputSpinner
                        value={this.state.value}
                        min={0}
                        max={3}
                        onMax={() => {alert('onMax reached!')}}
                        onMin={() => {alert('onMin reached!')}}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Min & Max colors (min 0, max 2)</Text>
                    <InputSpinner
                        value={this.state.value + 1}
                        min={0}
                        max={2}
                        colorMax={"#f04048"}
                        colorMin={"#82cc62"}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Type real (step 0.5, precision 1)</Text>
                    <InputSpinner
                        value={this.state.valueReal}
                        type={'real'}
                        step={0.5}
                        precision={1}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>Type real (step 0.05, precision 2)</Text>
                    <InputSpinner
                        value={this.state.valueReal}
                        type={'real'}
                        step={0.05}
                        precision={2}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>rounded false and showBorder</Text>
                    <InputSpinner
                        value={this.state.value}
                        rounded={false}
                        showBorder={true}/>
                </View>
                <View style={styles.col}>
                    <Text style={styles.text}>color, background and textColor</Text>
                    <InputSpinner
                        value={this.state.value}
                        textColor={"#FFF"}
                        color={"#25863f"}
                        background={"#82cc62"}
                        rounded={false}
                        showBorder={true}/>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40,
    },
    col: {
        flex: 1,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        marginRight: 20,
        width: 200,
    },
    title: {
        marginLeft: 20,
        marginBottom: 20,
        fontSize: 30
    }
});
