import React, { FC } from 'react'
import { Feather, Ionicons } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const CameraIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'switch') {
    return (
      <Ionicons
        name="camera-reverse"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  }

  return (
    <Feather
      name="camera"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default CameraIcon
