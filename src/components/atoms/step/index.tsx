import React from 'react';
import { View } from 'react-native';
import { ProgressStep } from 'react-native-progress-steps';
import styles from './styles';

export default ({
	label = '',
	content = <View />,
	stepCount = 0,
	activeStep = 0,
	setActiveStep = () => {},
	onNext = () => {},
	onSubmit = () => {},
	errors = false,
}) => {
	return (
		<ProgressStep
			{...styles}
			label={label}
			stepCount={stepCount}
			activeStep={activeStep}
			setActiveStep={setActiveStep}
			onNext={onNext}
			onSubmit={onSubmit}
			errors={errors}
		>
			{content}
		</ProgressStep>
	)
};