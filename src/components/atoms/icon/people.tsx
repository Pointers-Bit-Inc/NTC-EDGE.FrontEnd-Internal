import React, { FC } from 'react'
import { MaterialIcons, AntDesign } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const PeopleIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'add') {
    return (
      <AntDesign
        name="adduser"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  }

  return (
    <MaterialIcons
      name="people-outline"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default PeopleIcon
