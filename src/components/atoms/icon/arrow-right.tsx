import React, { FC } from 'react'
import { AntDesign, Feather } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const CloseIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'chevron-right') {
    return (
      <Feather
        name="chevron-right"
        size={size}
        color={color}
        style={{ fontWeight: 'bold' }}
        {...otherProps}
      />
    );
  }

  return (
    <AntDesign
      name="arrowright"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default CloseIcon
