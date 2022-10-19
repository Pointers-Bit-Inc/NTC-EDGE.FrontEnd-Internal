import React, { FC } from 'react';
import { View, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

interface Props {
  size?: number;
  color?: string;
  [x: string]: any;
};

const Dot: FC<Props> = ({
  size = 24,
  color = '#000',
  style = {},
}) => {

  size = RFValue(size);

  let styles = StyleSheet.create({
    view: {
      height: size,
      width: size,
      borderRadius: size,
      backgroundColor: color,
    }
  });

  return (
    <View style={[styles.view, style]} />
  );

};

export default Dot;