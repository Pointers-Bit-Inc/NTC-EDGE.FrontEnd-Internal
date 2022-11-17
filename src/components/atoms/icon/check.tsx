import React, { FC } from 'react'
import { FontAwesome, FontAwesome5, Octicons } from '@expo/vector-icons';
import {RNValue as RFValue} from "@utils/formatting";

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const CheckIcon: FC<Props> = ({
                            type = '',
                            size = 24,
                            color = '#000',
                            ...otherProps
                          }) => {
  switch(type) {
    case 'circle':
      return (
          <FontAwesome5
              name='check-circle'
              size={RFValue(size)}
              color={color}
              {...otherProps}
          />
      );
    case 'block-circle':
      return (
          <FontAwesome
              name='check-circle'
              size={RFValue(size)}
              color={color}
              {...otherProps}
          />
      );
    case 'square':
      return (
          <FontAwesome5
              name='check-square'
              size={RFValue(size)}
              color={color}
              {...otherProps}
          />
      );
    default:
      return (
          <Octicons
              name='check'
              size={RFValue(size)}
              color={color}
              {...otherProps}
          />
      );
  }
}

export default CheckIcon;
