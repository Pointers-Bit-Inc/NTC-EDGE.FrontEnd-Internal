import React, { FC } from 'react'
import { SimpleLineIcons } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const EyeIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <SimpleLineIcons
      name="eye"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default EyeIcon
