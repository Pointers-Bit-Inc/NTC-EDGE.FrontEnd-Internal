import React, { FC } from 'react'
import { Feather } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const CalendarIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <Feather
      name="calendar"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default CalendarIcon
