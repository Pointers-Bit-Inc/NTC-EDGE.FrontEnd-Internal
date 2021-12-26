import React, { FC } from 'react'
import { Feather, FontAwesome } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const MicIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'mic') {
    return (
      <FontAwesome
        name="microphone"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  } else if (type === 'muted') {
    return (
      <FontAwesome
        name="microphone-slash"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  }

  return (
    <Feather
      name="mic"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default MicIcon
