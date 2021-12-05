import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import TermsAndConditions from '@organisms/terms-and-conditions';
import ApplicationSteps from '@templates/application-steps';
import Submitted from '@pages/application-steps/submitted';

import StepOne from './step-one'; // change the step 1 here
import StepTwo from './step-two'; // change the step 2 here
import StepThree from './step-three'; // change the step 3 here

export default () => {
  const navigation = useNavigation();

  const [currentStep, setCurrentStep] = useState(0);
  const [agree, setAgree] = useState(false);
  const [completed, setSubmitted] = useState(false);

  const steps = [
    {
      title: 'About the Service', // change the step title here
      content: <StepOne />, // put the step component here
      onPrevious: () => navigation.navigate('Home'), // function to be called when user presses back
      onNext: () => setCurrentStep(currentStep + 1), // function to be called when user presses next
      buttonLabel: 'Next', // button label when user presses next
      buttonDisabled: false, // can be disabled if example application is not completely filled out yet
    },
    {
      title: 'Application',
      content: <StepTwo />,
      onPrevious: () => setCurrentStep(currentStep - 1),
      onNext: () => setCurrentStep(currentStep + 1),
      buttonLabel: 'Next',
      buttonDisabled: false,
    },
    {
      title: 'Requirements',
      content: <StepThree />,
      onPrevious: () => setCurrentStep(currentStep - 1),
      onNext: () => setCurrentStep(currentStep + 1),
      buttonLabel: 'Next',
      buttonDisabled: false,
    },
    {
      title: 'Submission',
      content: (
        <View style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 }}>
          {
            completed
              ? <Submitted />
              : <TermsAndConditions
                  termsAndCondition='I hereby declare that all the above entries are true and correct. Under the Revised Penal Code, I shall be held liable for any willful false statement(s) or misinterpretation(s) made in this application form that may serve as a valid ground for the denial of this application and/or cancellation/revocation of the permit issued/granted. Further, I am freely giving full consent for the collection and processing of personal information in accordance with Republic Act No. 10713, Data Privacy Act of 2012.'
                  agree={agree}
                  onClick={() => setAgree(!agree)}
                />
          }
          
        </View>
      ),
      onPrevious: () => setCurrentStep(currentStep - 1),
      onNext: () => {
        if (completed) navigation.navigate('Home');
        else if (agree) setSubmitted(true);
      },
      buttonLabel: completed ? 'Close' : 'Submit',
      buttonDisabled: completed ? !completed : !agree,
    }
  ];

  return (
    <ApplicationSteps
      steps={steps}
      currentStep={currentStep}
      completed={completed}
      onExit={() => navigation.navigate('Home')}
    />
  )
};