react-native-input-spinner
---

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[npm-image]: http://img.shields.io/npm/v/react-native-input-spinner.svg?style=flat-square
[npm-url]: http://npmjs.org/package/react-native-input-spinner
[download-image]: https://img.shields.io/npm/dm/react-native-input-spinner.svg?style=flat-square
[download-url]: https://npmjs.org/package/react-native-input-spinner

An extendible input number spinner component for react-native.


## Install

```
npm install react-native-input-spinner --save
```

## Usage

```
// Require
include InputSpinner from 'react-native-input-spinner';

// Use
<InputSpinner 
		max={10}
        min={2}
        value={5}
        color="#f60"
        numColor="#f60"
        onChange={(num)=>{console.log(num)}}
```

## Screenshot

<img src="example.png" />

## Props

Property          | Description | Type | Default | Note
------------------|-------------|------|---------|-------
max               | Max number permitted | number | 0  |
min               | Min value permitted | number | 99 |
type            | Type of spinner | Number | Int | Can be `float` or `int`) 
precision            | Max numbers permitted after comma | number | 2 |
offset            | Value to increment or decrement the current spinner value | number | 1 |
value             | Controlled value of the Spinner | number | 0 | If `value` is defined, then the value can change only via the property. This means that `onNumChange` must be defined and change external state.
color             | Custom color of the Spinner | string | ‘#3e525f' |
textColor          | Custom number color | string | ‘#000000' |
background        | Background color of number button | string | ’transparent' |
onChange       | Get the number of the Spinner | func | |
showBorder        | Show the border of the Spinner or not | bool | false |
disabled          | Disable the Spinner or not | bool | false |
fontSize          | Custom fontSize of the text input in the Spinner | number | 14 |
buttonFontSize        | Custom fontSize of buttons in the Spinner | number | 14 |
buttonTextColor   | Custom color of the button in the Spinner | string | 'white' |
width             | Custom width of the Spinner | number | 150 |
height            | Custom height of the Spinner | number | 50 |
style | Container style | Object |  |
buttonStyle | Button Style | Object |  |
inputStyle | InputStyle | Object |  |

