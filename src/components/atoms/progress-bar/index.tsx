import React, { FC } from 'react';
import propsStyles from '@atoms/progress-steps/props-styles';
import styles from './styles';
import Bar from "@atoms/expo-progress/Bar";

interface Props {
  [x: string]: any;
};

const ProgressBar: FC<Props> = ({
  ...otherProps
}) => {
  return (
    <Bar
      style={styles.progress}
      {...propsStyles.progress}
      {...otherProps}
      duration={700}
      isIndeterminate
    />
  )
};

export default ProgressBar;