import React, { FC } from 'react'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'; 

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
