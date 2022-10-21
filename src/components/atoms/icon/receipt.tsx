import React, { FC } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { RNValue as RFValue } from "@utils/formatting";

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const Receipt: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <Ionicons
      name='receipt-outline'
      size={RFValue(size)}
      color={color}
      {...otherProps}
    />
  );
};

export default Receipt;