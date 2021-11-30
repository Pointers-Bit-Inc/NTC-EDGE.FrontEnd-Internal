import React from 'react';
import { ProgressSteps } from 'react-native-progress-steps';
import Step from '@atoms/step';
import styles from './styles';

const renderEveryStep = (steps = []) => {
	return steps.map((step, index) => {
		return (
			<Step
				key={index}
				{...step}
			/>
		)
	});
};

export default ({ steps = [] }) => {
	return (
		<ProgressSteps {...styles}>
			{renderEveryStep(steps)}
		</ProgressSteps>
	);
};