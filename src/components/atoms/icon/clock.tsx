import React, { FC } from 'react'
import { Feather } from '@expo/vector-icons';
import {RNValue as RFValue} from "../../../utils/formatting";

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const Clock: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <Feather
      name='clock'
      size={RFValue(size)}
      color={color}
      {...otherProps}
    />
  );
};

export default Clock;
