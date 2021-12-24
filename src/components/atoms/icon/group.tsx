import React, { FC } from 'react'
import { FontAwesome } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const GroupIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <FontAwesome
      name="group"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default GroupIcon
