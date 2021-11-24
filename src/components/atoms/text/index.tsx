import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

const styles = StyleSheet.create({
  main: {
    fontSize: 12,
  },
});

const Text = ({
  children,
  style,
  color = 'black',
  weight = 'normal',
  fontSize = 12,
  numberOfLines = 2,
}: any) => {
  return (
    <RNText
      style={[styles.main, { color, fontWeight: weight, fontSize }, style]}
      numberOfLines={numberOfLines}>
      {children}
    </RNText>
  );
};

export default Text;
