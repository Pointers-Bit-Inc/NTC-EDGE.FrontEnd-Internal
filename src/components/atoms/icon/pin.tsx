import React, { FC } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const Pin: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <MaterialCommunityIcons
      name='pin'
      size={RFValue(size)}
      color={color}
      {...otherProps}
    />
  );
};

export default Pin;