<img src="images/logo.png" width="100%"/>

## 💡 Props List

| Property                | Description                                                                             | Type             | Default          | Note                              |
| ----------------------- | --------------------------------------------------------------------------------------- | ---------------- | ---------------- | --------------------------------- |
| `activeOpacity`         | Opacity on pressed button                                                               | Number           | `0.85`           |
| `append`                | Custom element before right button                                                      | Component        |                  |
| `arrows`                | Labels on button will be arrows (< and >) instead of plus and minus                     | Boolean          | `false`          |
| `autofocus`             | If `true`, focuses the input on `componentDidMount`.                                    |                  | `false`          |                                   |
| `background`            | Background color of number button                                                       | String           | `transparent`    |                                   |
| `buttonFontFamily`      | Custom fontFamily of buttons of the Spinner                                             | String           | `System Default` |                                   |
| `buttonFontSize`        | Custom fontSize of buttons of the Spinner                                               | Number           | `14`             |                                   |
| `buttonLeftDisabled`    | Disable left button                                                                     | Boolean          | `false`          |                                   |
| `buttonLeftImage`       | Custom element on the button left of the spinner                                        | Component        |                  |                                   |
| `buttonLeftText`        | Custom text on the button left of the spinner                                           | String           |                  |                                   |
| `buttonPressLeftImage`  | Custom element on the button left of the spinner on pressed state                       | Component        |                  |                                   |
| `buttonPressRightImage` | Custom element on the button right of the spinner on pressed state                      | Component        |                  |                                   |
| `buttonPressStyle`      | Button Style on Pressed state (Plus and Minus buttons)                                  | Object           |                  | Could overwrite other props       |
| `buttonPressTextColor`  | Custom color of the button of the Spinner on Pressed state                              | String           | `#FFFFFF`        |                                   |
| `buttonRightDisabled`   | Disable right button                                                                    | Boolean          | `false`          |                                   |
| `buttonRightImage`      | Custom element on the button right of the spinner                                       | Component        |                  |                                   |
| `buttonRightText`       | Custom text on the button right of the spinner                                          | String           |                  |                                   |
| `buttonStyle`           | Button Style (Plus and Minus buttons)                                                   | Object           |                  | Could overwrite other props       |
| `buttonTextColor`       | Custom color of the button of the Spinner                                               | String           | `#FFFFFF`        |                                   |
| `colorLeft`             | Custom color of the Spinner left button                                                 | String           | `#3E525F`        |                                   |
| `colorMax`              | Custom color of the Spinner when reach max value                                        | String           |                  |                                   |
| `colorMin`              | Custom color of the Spinner when reach min value                                        | String           |                  |                                   |
| `colorPress`            | Custom color of the Spinner button on touch press                                       | String           | `#3E525F`        |                                   |
| `colorRight`            | Custom color of the Spinner right button                                                | String           | `#3E525F`        |                                   |
| `color`                 | Custom color of the Spinner                                                             | String           | `#3E525F`        |                                   |
| `disabled`              | Disable the Spinner or not                                                              | Boolean          | `false`          |                                   |
| `editable`              | Set if input number field is editable or not                                            | Boolean          | `true`           |                                   |
| `fontFamily`            | Custom fontFamily of the text input of the Spinner                                      | String           | System Default   |                                   |
| `fontSize`              | Custom fontSize of the text input of the Spinner                                        | Number           | `14`             |                                   |
| `height`                | Custom height of the Spinner                                                            | Number           | `50`             |                                   |
| `initialValue`          | Initial value of the Spinner                                                            | String<br>Number | `0`              |                                   |
| `inputStyle`            | Input Style (Text number at middle)                                                     | Object           |                  | Could overwrite other props       |
| `maxLength`             | Limits the maximum number of characters that can be entered.                            | Number           |                  |                                   |
| `max`                   | Max number permitted                                                                    | String<br>Number | `0`              |                                   |
| `min`                   | Min value permitted                                                                     | String<br>Number | `99`             |                                   |
| `onBlur`                | Callback that is called when the text input is blurred.                                 | (e) => { ... }   |
| `onChange`              | Get the number of the Spinner                                                           | Function         |                  | `(num) => { ... }`                |
| `onDecrease`            | When decrease button is clicked get value decreased                                     | Function         |                  | `(decreased) => { ... }`          |
| `onFocus`               | Callback that is called when the text input is focused.                                 | (e) => { ... }   |
| `onIncrease`            | When increase button is clicked get value increased                                     | Function         |                  | `(increased) => { ... }`          |
| `onKeyPress`            | Callback that is called when a key is pressed.                                          | (e) => { ... }   |
| `onMax`                 | When max is reached get max number permitted                                            | Function         |                  | `(max) => { ... }`                |
| `onMin`                 | When min is reached get min number permitted                                            | Function         |                  | `(min) => { ... }`                |
| `onSubmitEditing`       | Callback that is called when the text input's submit button is pressed                  | (e) => { ... }   |
| `precision`             | Max numbers permitted after comma                                                       | Integer          | `2`              |                                   |
| `prepend`               | Custom element after left button                                                        | Component        |                  |
| `returnKeyLabel`        | Sets the return key to the label. Use it instead of `returnKeyType`.                    | String           |                  |                                   |
| `returnKeyType`         | Determines how the return key should look. On Android you can also use `returnKeyLabel` | String           |                  |
| `rounded`               | Use circular button                                                                     | Boolean          | `true`           |                                   |
| `selectTextOnFocus`     | If `true`, all text will automatically be selected on focus.                            | Bool             | `false`          |                                   |
| `selectionColor`        | The highlight and cursor color of the text input.                                       | String           | `null`           |                                   |
| `showBorder`            | Show the border of the Spinner or not                                                   | Boolean          | `false`          | Use with `rounded={false}`        |
| `step`                  | Value to increment or decrement the current spinner value                               | String<br>Number | `1`              |                                   |
| `style`                 | Container style                                                                         | Object           |                  | Could overwrite other props       |
| `textColor`             | Custom number color                                                                     | String           | `#000000`        |                                   |
| `type`                  | Type of spinner                                                                         | String           | `int`            | Can be `int` or `real`/`float`... |
| `value`                 | Controlled value of the Spinner                                                         | String<br>Number | `0`              |                                   |
| `width`                 | Custom width of the Spinner                                                             | Number           | `150`            |                                   |
