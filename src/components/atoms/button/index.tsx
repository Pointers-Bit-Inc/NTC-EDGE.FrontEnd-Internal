import React, { ReactNode, FC } from 'react';
import { StyleSheet } from 'react-native';
import lodash from 'lodash';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native';
const styles = StyleSheet.create({
  default: {
    padding: 15,
    alignItems: 'center',
  },
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

  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.95, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, { duration: 100 });
  };

  return (
     <TouchableOpacity
       onPressIn={handlePressIn}
       onPressOut={handlePressOut}
       onPress={debouncedOnPress}
       {...otherProps}
     >
       <Animated.View style={[styles.default, style, animatedStyle]}>
         {children}
       </Animated.View>
     </TouchableOpacity>
  );
};

export default Button;
