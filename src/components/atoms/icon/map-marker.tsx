import React, { FC } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {RNValue as RFValue} from "../../../utils/formatting";

interface Props {
  type?: string;
  size?: number;
  color?: string;
  [x: string]: any;
};

const MapMarker: FC<Props> = ({
  type = '',
  size = 24,
  color = '#000',
  ...otherProps
}) => {
  return (
    <MaterialCommunityIcons
      name='map-marker-radius-outline'
      size={RFValue(size)}
      color={color}
      {...otherProps}
    />
  );
}

export default MapMarker;
