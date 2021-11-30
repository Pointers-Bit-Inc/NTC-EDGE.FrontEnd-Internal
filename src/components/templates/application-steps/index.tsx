import React from 'react';
import { SafeAreaView } from 'react-native';
import Steps from '@molecules/steps';
import styles from './styles';

export default (props) => {
	return (
		<SafeAreaView style={styles.container}>
			<Steps {...props} />
		</SafeAreaView>
	)
};