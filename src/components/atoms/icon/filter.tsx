import React, { FC } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
}

const FilterIcon: FC<Props> = ({
  size = 24,
  color = 'black',
  ...otherProps
}) => {

  return (
    <MaterialCommunityIcons
      name="filter-variant"
      size={size}
      color={color}
      {...otherProps}
    />
  );
}

export default FilterIcon
