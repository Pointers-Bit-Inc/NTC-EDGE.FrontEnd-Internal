import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import TermsAndConditions from '@organisms/terms-and-conditions';
import ApplicationSteps from '@templates/application-steps';

export default () => {
	const navigation = useNavigation();
	const stepCount = 4;
	const [activeStep, setActiveStep] = useState(0);
	const [showTC, setShowTC] = useState(false);
	const [errors, setErrors] = useState({
		error1: false,
		error2: false,
		error3: true,
		error4: false,
	});
	const steps = [
		{
			label: 'About the Service',
			content: (
				<View style={{ alignItems: 'center' }}>
					<Text>About the Service content</Text>
				</View>
			),
			stepCount,
			activeStep,
			setActiveStep: (n: number) => setActiveStep(n),
			onNext: () => {}, // do validations && handle error/s here
			errors: errors.error1, // if true, next will not proceed
		},
		{
			label: 'Application',
			content: (
				<View style={{ alignItems: 'center' }}>
					<Text>Application Form</Text>
				</View>
			),
			stepCount,
			activeStep,
			setActiveStep: (n: number) => setActiveStep(n),
			onNext: () => {}, // do validations && handle error/s here
			errors: errors.error2, // if true, next will not proceed
		},
		{
			label: 'Requirements',
			content: (
				<View style={{ alignItems: 'center' }}>
					<TermsAndConditions
						visible={showTC}
						termsAndConditions='Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
						onCancel={() => setShowTC(false)}
						onAgree={() => {
							setErrors({...errors, error3: false});
							setShowTC(false);
						}}
					/>
					<Text>Requirements Form</Text>
				</View>
			),
			stepCount,
			activeStep,
			setActiveStep: (n: number) => setActiveStep(n),
			onNext: () => setShowTC(true),
			errors: errors.error3,
		},
		{
			label: 'Submit',
			content: (
				<View style={{ alignItems: 'center' }}>
					<Text>Your application has been submitted!</Text>
				</View>
			),
			stepCount,
			activeStep,
			setActiveStep: (n: number) => setActiveStep(n),
			onSubmit: () => navigation.navigate('Home'), // do validations && handle error/s here
			errors: errors.error4, // if true, next will not proceed
		}
	];
	return <ApplicationSteps steps={steps} />
};