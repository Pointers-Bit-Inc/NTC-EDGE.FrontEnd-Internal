import React, { FC } from 'react'
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const PhoneIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'hangup') {
    return (
      <MaterialCommunityIcons
        name="phone-hangup"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  }

  return (
    <Feather
      name="phone"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default PhoneIcon
