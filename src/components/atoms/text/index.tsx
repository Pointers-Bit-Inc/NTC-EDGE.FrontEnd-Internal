import React, { ReactNode, FC } from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

const styles = StyleSheet.create({
  default: {
    color: 'black',
    fontSize: 12,
    fontWeight: 'normal'
  }
});

interface Props {
  color?: string;
  size?: number;
  weight?: string;
  children: ReactNode;
  style?: any;
  align?: string;
  [x: string]: any;
}

const Text: FC<Props> = ({
  color,
  size,
  weight,
  children,
  style,
  align,
  ...otherProps
}) => {
  return (
    <RNText
      style={[
        styles.default,
        { color, fontSize: size, fontWeight: weight, textAlign: align },
        style
      ]}
      {...otherProps}
    >
      {children}
    </RNText>
  );
};

export default Text;
