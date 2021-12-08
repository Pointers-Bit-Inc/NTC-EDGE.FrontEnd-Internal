import React, { FC } from 'react'
import { Ionicons } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const VideoIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <Ionicons
      name="videocam-outline"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default VideoIcon
