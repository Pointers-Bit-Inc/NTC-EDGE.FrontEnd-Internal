import React, { FC } from 'react'
import { AntDesign, SimpleLineIcons } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const WriteIcon: FC<Props> = ({
  type = '',
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  if (type === 'pen') {
    return (
      <SimpleLineIcons
        name="pencil"
        size={size}
        color={color}
        {...otherProps}
      />
    );
  }

  return (
    <AntDesign
      name="form"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default WriteIcon
