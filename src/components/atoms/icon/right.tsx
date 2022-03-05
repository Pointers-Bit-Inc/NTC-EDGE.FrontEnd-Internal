import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import {fontValue} from "@pages/activities/script";

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const Right: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <AntDesign
      name='right'
      size={fontValue(size)}
      color={color}
      {...otherProps}
    />
  );
};

export default Right;