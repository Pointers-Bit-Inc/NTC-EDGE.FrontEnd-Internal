import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const CloseIcon: FC<Props> = ({
  type,
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  switch(type) {
    case 'close':
      return (
        <AntDesign
          name="close"
          size={size}
          color={color}
          {...otherProps}
        />
      );
    default:
      return (
        <AntDesign
          name="closecircleo"
          size={size}
          color={color}
          {...otherProps}
        />
      );
  }
  
}

export default CloseIcon