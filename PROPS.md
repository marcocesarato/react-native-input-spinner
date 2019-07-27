# React Native Input Spinner

## 💡 Props List

| Property                | Description                                                         | Type             | Default          | Note                              |
| ----------------------- | ------------------------------------------------------------------- | ---------------- | ---------------- | --------------------------------- |
| `activeOpacity`         | Opacity on pressed button                                           | Number           | `0.85`           |
| `append`                | Custom element before right button                                  | Component        |                  |
| `arrows`                | Labels on button will be arrows (< and >) instead of plus and minus | Boolean          | `false`          |
| `background`            | Background color of number button                                   | String           | `transparent`    |                                   |
| `buttonFontFamily`      | Custom fontFamily of buttons of the Spinner                         | String           | `System Default` |                                   |
| `buttonFontSize`        | Custom fontSize of buttons of the Spinner                           | Number           | `14`             |                                   |
| `buttonLeftImage`       | Custom element on the button left of the spinner                    | Component        |                  |                                   |
| `buttonLeftText`        | Custom text on the button left of the spinner                       | String           |                  |                                   |
| `buttonPressLeftImage`  | Custom element on the button left of the spinner on pressed state   | Component        |                  |                                   |
| `buttonPressRightImage` | Custom element on the button right of the spinner on pressed state  | Component        |                  |                                   |
| `buttonPressStyle`      | Button Style on Pressed state (Plus and Minus buttons)              | Object           |                  | Could overwrite other props       |
| `buttonPressTextColor`  | Custom color of the button of the Spinner on Pressed state          | String           | `#FFFFFF`        |                                   |
| `buttonRightImage`      | Custom element on the button right of the spinner                   | Component        |                  |                                   |
| `buttonRightText`       | Custom text on the button right of the spinner                      | String           |                  |                                   |
| `buttonStyle`           | Button Style (Plus and Minus buttons)                               | Object           |                  | Could overwrite other props       |
| `buttonTextColor`       | Custom color of the button of the Spinner                           | String           | `#FFFFFF`        |                                   |
| `colorLeft`             | Custom color of the Spinner left button                             | String           | `#3E525F`        |                                   |
| `colorMax`              | Custom color of the Spinner when reach max value                    | String           |                  |                                   |
| `colorMin`              | Custom color of the Spinner when reach min value                    | String           |                  |                                   |
| `colorPress`            | Custom color of the Spinner button on touch press                   | String           | `#3E525F`        |                                   |
| `colorRight`            | Custom color of the Spinner right button                            | String           | `#3E525F`        |                                   |
| `color`                 | Custom color of the Spinner                                         | String           | `#3E525F`        |                                   |
| `disabled`              | Disable the Spinner or not                                          | Boolean          | `false`          |                                   |
| `editable`              | Set if input number field is editable or not                        | Boolean          | `true`           |                                   |
| `fontFamily`            | Custom fontFamily of the text input of the Spinner                  | String           | System Default   |                                   |
| `fontSize`              | Custom fontSize of the text input of the Spinner                    | Number           | `14`             |                                   |
| `height`                | Custom height of the Spinner                                        | Number           | `50`             |                                   |
| `inputStyle`            | Input Style (Text number at middle)                                 | Object           |                  | Could overwrite other props       |
| `max`                   | Max number permitted                                                | String<br>Number | `0`              |                                   |
| `min`                   | Min value permitted                                                 | String<br>Number | `99`             |                                   |
| `onChange`              | Get the number of the Spinner                                       | Function         |                  | `(num) => { ... }`                |
| `onDecrease`            | When decrease button is clicked get value decreased                 | Function         |                  | `(decreased) => { ... }`          |
| `onIncrease`            | When increase button is clicked get value increased                 | Function         |                  | `(increased) => { ... }`          |
| `onMax`                 | When max is reached get max number permitted                        | Function         |                  | `(max) => { ... }`                |
| `onMin`                 | When min is reached get min number permitted                        | Function         |                  | `(min) => { ... }`                |
| `precision`             | Max numbers permitted after comma                                   | Integer          | `2`              |                                   |
| `prepend`               | Custom element after left button                                    | Component        |                  |
| `rounded`               | Use circular button                                                 | Boolean          | `true`           |                                   |
| `showBorder`            | Show the border of the Spinner or not                               | Boolean          | `false`          | Use with `rounded={false}`        |
| `step`                  | Value to increment or decrement the current spinner value           | String<br>Number | `1`              |                                   |
| `style`                 | Container style                                                     | Object           |                  | Could overwrite other props       |
| `textColor`             | Custom number color                                                 | String           | `#000000`        |                                   |
| `type`                  | Type of spinner                                                     | String           | `int`            | Can be `int` or `real`/`float`... |
| `value`                 | Controlled value of the Spinner                                     | String<br>Number | `0`              |                                   |
| `width`                 | Custom width of the Spinner                                         | Number           | `150`            |                                   |
