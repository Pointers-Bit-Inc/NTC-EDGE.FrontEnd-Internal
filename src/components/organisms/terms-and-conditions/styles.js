import React from 'react';
import { Dimensions } from 'react-native';
import { primaryColor, disabledColor } from '@styles/color';

const { height } = Dimensions.get('window');

export default {
	modal: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		padding: 15,
	},
	view: {
		backgroundColor: '#fff',
		padding: 30,
		maxHeight: height * .75,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 16,
		alignSelf: 'center',
		marginBottom: 30,
	},
	TCText: {},
	iAgreeContainer: {
		marginTop: 30,
		flexDirection: 'row',
		alignItems: 'center',
	},
	iAgreeTxt: {
		marginLeft: 5,
	},
	buttonEnabled: {
		backgroundColor: primaryColor,
	},
	buttonDisabled: {
		backgroundColor: disabledColor,
	},
	buttonTxt: {
		color: '#fff',
	},
};