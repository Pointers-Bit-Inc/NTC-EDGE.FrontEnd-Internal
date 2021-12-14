import React, { FC } from 'react'
import { MaterialIcons } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const PeopleIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

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
