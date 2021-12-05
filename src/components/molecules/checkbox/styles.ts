import { StyleSheet } from 'react-native';
import { disabledColor } from '@styles/color';

export default StyleSheet.create({
	view: {
		flexDirection: 'row',
    alignItems: 'center',
	},
	text: {
		marginLeft: 10,
	},
	checkbox: {
		borderColor: disabledColor,
	},
});