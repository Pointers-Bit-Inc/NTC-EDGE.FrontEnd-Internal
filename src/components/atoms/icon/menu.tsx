import React, { FC } from 'react'
import { SimpleLineIcons, Feather } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const MenuIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {
  if (type === 'more') {
    return (
      <Feather
        name="more-vertical"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  } else if (type === 'more-horizontal') {
    return (
      <Feather
        name="more-horizontal"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  }
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
