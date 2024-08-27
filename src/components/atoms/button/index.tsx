import React, { ReactNode, FC } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import lodash from 'lodash'; 

const styles = StyleSheet.create({
  default: {
    padding: 15,
    alignItems: 'center'
  }
});

interface Props {
  children: ReactNode;
  onPress?: any;
  style?: any;
  [x: string]: any;
}

const Button: FC<Props> = ({
  children,
  onPress = () => {},
  style,
  ...otherProps
}) => {
  const debouncedOnPress = lodash.debounce(onPress, 300, { leading: true, trailing: false });
  
  return (
    <TouchableOpacity
      style={[styles.default, style]}
      onPress={debouncedOnPress}
      {...otherProps}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;
