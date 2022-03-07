import React, { FC } from 'react'
import { AntDesign, SimpleLineIcons, Feather } from '@expo/vector-icons'; 

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

  if (type === 'arrow-left') {
    return (
      <SimpleLineIcons
        name="arrow-left"
        size={size}
        color={color}
        style={{ fontWeight: 'bold' }}
        {...otherProps}
      />
    );
  }

  if (type === 'chevron-left') {
    return (
      <Feather
        name="chevron-left"
        size={size}
        color={color}
        style={{ fontWeight: 'bold' }}
        {...otherProps}
      />
    );
  }

  return (
    <AntDesign
      name="arrowleft"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default CloseIcon
