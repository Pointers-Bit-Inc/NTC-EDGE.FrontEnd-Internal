import React from 'react';
import { View } from 'react-native';
import CheckBox from 'react-native-check-box';
import styles from './styles';

export default ({
	isChecked = false,
	onClick = () => {},
}) => {
	return (
		<View>
			<CheckBox
				{...styles}
				isChecked={isChecked}
				onClick={() => onClick()}
			/>
		</View>
	)
};