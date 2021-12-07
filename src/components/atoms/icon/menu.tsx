import React, { FC } from 'react'
import { SimpleLineIcons } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const MenuIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <SimpleLineIcons
      name="menu"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default MenuIcon
