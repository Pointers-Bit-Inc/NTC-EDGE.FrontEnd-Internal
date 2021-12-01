import React, { FC } from 'react';
import { ProgressSteps } from 'react-native-progress-steps';
import Step from '@atoms/step';
import styles from './styles';

interface Props {
	steps: object;
};

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

const Steps: FC<Props> = ({ steps = [] }: any) => {
	return (
		<ProgressSteps {...styles}>
			{renderEveryStep(steps)}
		</ProgressSteps>
	);
}

export default Steps;