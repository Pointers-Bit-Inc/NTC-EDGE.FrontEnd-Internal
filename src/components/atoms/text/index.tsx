import React, { ReactNode, FC } from 'react';
import { StyleSheet, Text as RNText } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

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
  color = 'black',
  size = 12,
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
        { color, fontSize: RFValue(size), fontWeight: weight, textAlign: align, fontFamily: 'Poppins_400Regular' },
        style
      ]}
      {...otherProps}
    >
      {children}
    </RNText>
  );
};

export default Text;
