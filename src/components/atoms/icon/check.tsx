import React, { FC } from 'react'
import { FontAwesome5, Feather } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const CheckIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  switch(type) {
    case 'check':
      return (
        <Feather
          name="check"
          size={size}
          color={color}
          {...otherProps}
        />
      );
    case 'check-square':
      return (
        <FontAwesome5
          name="check-square"
          size={size}
          color={color}
          {...otherProps}
        />
      );
    default:
      return (
        <FontAwesome5
          name="check-circle"
          size={size}
          color={color}
          {...otherProps}
        />
      );
  }
}

export default CheckIcon
