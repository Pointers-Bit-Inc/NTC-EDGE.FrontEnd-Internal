import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  circle?: boolean;
  [x: string]: any;
}

const CloseIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  circle,
  ...otherProps
}) => {

  return (
    <AntDesign
      name={circle ? 'closecircleo' : 'close'}
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default CloseIcon
