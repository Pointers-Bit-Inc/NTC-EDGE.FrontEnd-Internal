import React, { FC } from 'react'
import { FontAwesome } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const ToggleIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <FontAwesome
      name="toggle-on"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default ToggleIcon
