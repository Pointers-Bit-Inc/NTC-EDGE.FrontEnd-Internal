import React, { ReactNode, FC } from 'react';
import { View } from 'react-native';
import { ProgressStep } from 'react-native-progress-steps';
import styles from './styles';

interface Props {
	label: string;
	content: ReactNode;
	stepCount: number;
	activeStep: number;
	setActiveStep: any;
	onNext: any;
	onSubmit: any;
	errors: boolean;
};

const Step: FC<Props> = ({
	label = '',
	content = <View />,
	stepCount = 0,
	activeStep = 0,
	setActiveStep = () => {},
	onNext = () => {},
	onSubmit = () => {},
	errors = false,
}: any) => {
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

export default Step;