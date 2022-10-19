import React, { FC } from 'react'
import { AntDesign, Ionicons } from '@expo/vector-icons';

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
    case 'md-close':
      return (
          <Ionicons
              name="md-close"
              size={size}
              color={color}
              {...otherProps}
          />
      );
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
