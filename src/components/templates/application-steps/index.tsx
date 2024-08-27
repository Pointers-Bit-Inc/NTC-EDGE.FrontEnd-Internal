import React, { FC, ReactNode } from 'react';
import { View } from 'react-native';
import NavBar from '@molecules/navbar';
import Text from '@atoms/text';
import Button from '@atoms/button';
import ProgressSteps from '@atoms/progress-steps';
import { ArrowLeftIcon, CloseIcon } from '@atoms/icon';
import styles from './styles';

interface Steps {
  title?: string;
  content?: ReactNode;
  onPrevious?: any;
  onNext?: any;
  buttonLabel?: string;
  buttonDisabled?: boolean;
};

interface Props {
  steps?: Steps[];
  currentStep?: number;
  completed?: boolean;
  onExit?: any;
};

const ApplicationSteps: FC<Props> = ({
  steps = [],
  currentStep = 0,
  completed,
  onExit = () => {},
}) => {
  const totalSteps = steps?.length;
  const current = steps?.[currentStep] || {};
  const {
    title = '',
    content = <View />,
    onPrevious = () => {},
    onNext = () => {},
    buttonLabel = 'OK',
    buttonDisabled,
  } = current;
  const values = new Array(totalSteps).fill(0).map((n, index) => { return index < currentStep || completed ? 1 : 0; });

  if (!(totalSteps > 0)) return <View />;

  return (
    <View style={styles.mainContainer}>

      <NavBar
        title={title}
        titleStyle={styles.titleStyle}
        leftIcon={!completed && (<ArrowLeftIcon {...styles.iconStyle} />)}
        rightIcon={(<CloseIcon {...styles.iconStyle} />)}
        onLeft={onPrevious}
        onRight={onExit}
      />

      <View style={styles.progressContainer}>
        <ProgressSteps values={values} />
      </View>

      {content}

      <View style={styles.buttonContainer}>
        <Button
					style={buttonDisabled ? styles.buttonDisabled : styles.buttonEnabled}
					onPress={onNext}
					disabled={buttonDisabled}
				>
					<Text style={styles.buttonTxt}>
            {buttonLabel}
					</Text>
				</Button>
      </View>

    </View>
  )
};

export default ApplicationSteps;