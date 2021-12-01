import React, { FC } from 'react';
import { SafeAreaView } from 'react-native';
import Steps from '@molecules/steps';
import styles from './styles';

interface Props {
	[x: string]: any;
};

const ApplicationSteps: FC<Props> = ({ ...props }) => {
	return (
		<SafeAreaView style={styles.container}>
			<Steps {...props} />
		</SafeAreaView>
	)
}

export default ApplicationSteps;