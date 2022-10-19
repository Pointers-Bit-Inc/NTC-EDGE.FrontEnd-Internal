import React, { FC } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const PlusIcon: FC<Props> = ({
                               size = 24,
                               color = 'black',
                               ...otherProps
                             }) => {

  return (
      <FontAwesome5
          name="plus"
          size={size}
          color={color}
          {...otherProps}
      />
  );
}

export default PlusIcon
