import React, { FC } from 'react'
import { Feather, FontAwesome5 } from '@expo/vector-icons';

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const VideoIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'video') {
    return (
      <FontAwesome5
        name="video"
        size={size}
        color={color}
        {...otherProps}
      />
    )
  } else if (type === 'muted') {
    return (
      <FontAwesome5
        name="video-slash"
        size={size}
        color={color}
        {...otherProps}
      />
    )
  }

  return (
    <Feather
      name="video"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default VideoIcon
