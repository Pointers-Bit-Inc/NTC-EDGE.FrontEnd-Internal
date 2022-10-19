import React, { FC } from 'react';
import * as Progress from 'expo-progress';
import propsStyles from '@atoms/progress-steps/props-styles';
import styles from './styles';

interface Props {
  [x: string]: any;
};

const ProgressBar: FC<Props> = ({
  ...otherProps
}) => {
  return (
    <Progress.Bar 
      style={styles.progress}
      {...propsStyles.progress}
      {...otherProps}
      duration={700}
      isIndeterminate
    />
  )
};

export default ProgressBar;