import React, { FC, ReactNode } from 'react';
import { View } from 'react-native';
import Statusbar from '@atoms/status-bar';
import Text from '@atoms/text';
import ProgressSteps from '@atoms/progress-steps';
import NTCAlert from '@atoms/alert';
import { Bottom } from '@molecules/buttons';
import NavBar from '@organisms/navbar';
import styles from './styles';
import Close from "@atoms/icon/close";
import ArrowLeft from "@atoms/icon/arrow-left";

interface Steps {
  title?: string;
  content?: ReactNode;
  onPrevious?: any;
  onNext?: any;
  buttonLabel?: string;
  buttonDisabled?: boolean;
};

interface Props {
  tabview: JSX.Element,
  steps?: Steps[];
  currentStep?: number;
  completed?: boolean;
  onExit?: any;
  loading?: any;
  UDAAlert?: any;
  generatingApplication?: boolean;
};

const ApplicationSteps: FC<Props> = ({
  tabview,
  steps = [],
  currentStep = 0,
  completed,
  onExit = () => {},
  loading,
  UDAAlert = {},
  generatingApplication,
}) => {
  const totalSteps = steps?.length;
  if (!(totalSteps > 0)) return <View />;

  const current = steps?.[currentStep] || {};
  const {
    title = '',
    onPrevious = () => {},
    onNext = () => {},
    buttonLabel = 'OK',
    buttonDisabled,
  } = current;
  const values = new Array(totalSteps - 1).fill(0).map((n, index) => { return index <= currentStep || completed ? 1 : 0; });

  return (
    <View style={styles.mainContainer}>

      <NTCAlert
        visible={UDAAlert?.active}
        title={UDAAlert?.title || 'Alert'}
        message={UDAAlert?.message}
        confirmText='OK'
        onConfirm={UDAAlert?.onConfirm}
      />

      {
        completed
          ? <Statusbar barStyle='dark-content' backgroundColor='#fff' />
          : <NavBar
              title={title}
              leftIcon={((currentStep + 1) >= totalSteps) ? <Close {...styles.iconStyle} /> : !completed && <ArrowLeft {...styles.iconStyle} />}
              rightIcon={((currentStep + 1) < totalSteps) && <Text style={styles.iconStyle}>Close</Text>}
              onLeft={onPrevious}
              onRight={onExit}
            />
      }

      {
        generatingApplication ||
        ((currentStep + 1) >= totalSteps) //currentStep is by index
          ? <View />
          : <View style={styles.progressContainer}>
              <ProgressSteps values={values} />
            </View>
      }

      {tabview}



      <Bottom
        label={buttonLabel}
        onPress={() => setTimeout(() => onNext(), 100)}
        disabled={buttonDisabled || loading}
        loading={loading}
      />

    </View>
  )
};

export default React.memo(ApplicationSteps);
