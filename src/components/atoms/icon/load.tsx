import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons';
import {RNValue as RFValue} from "@/src/utils/formatting";

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const Load: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <AntDesign
      name='loading1'
      size={RFValue(size)}
      color={color}
      {...otherProps}
    />
  );
}

export default Load;