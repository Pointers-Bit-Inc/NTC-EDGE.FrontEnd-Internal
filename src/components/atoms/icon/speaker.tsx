import React, { FC } from 'react'
import { Ionicons } from '@expo/vector-icons';

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const SpeakerIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'speaker-off') {
    return (
      <Ionicons
        name="md-volume-off"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  }

  return (
    <Ionicons
      name="md-volume-medium-sharp"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default SpeakerIcon
