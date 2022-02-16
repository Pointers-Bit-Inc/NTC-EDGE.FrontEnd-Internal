import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const Left: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <AntDesign
      name='left'
      size={RFValue(size)}
      color={color}
      {...otherProps}
    />
  );
};

export default Left;