/**
 * Input Spinner - Style
 * @author Marco Cesarato <cesarato.developer@gmail.com>
 */

import {StyleSheet} from 'react-native';

export const Style = StyleSheet.create({
    container: {
        borderWidth: 0.5,
        borderRadius: 4,
        flexDirection: 'row',
        overflow: 'hidden',
        width: 150
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
    },
    buttonRounded: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    numberText: {
        flex: 1,
        textAlign: 'center',
        justifyContent: 'center'
    }
});
