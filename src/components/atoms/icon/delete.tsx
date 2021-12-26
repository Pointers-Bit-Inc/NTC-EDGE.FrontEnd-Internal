import React, { FC } from 'react'
import { AntDesign } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const WriteIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <AntDesign
      name="delete"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default WriteIcon
