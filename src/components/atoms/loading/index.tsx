import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import {primaryColor} from "@styles/color";

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

const Loading = ({
  size = 12,
  space = 5,
  color = 'black',
  numberOfDots = 5,
  speed = 1000,
  style = {},
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const RunAnimation = () =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: speed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: speed,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]),
    );

  useEffect(() => {
    const animation = RunAnimation();
    animation.start();
    return () => animation.stop();
  }, []);

  const renderDots = () => {
    const dots = [];
    for (let loop = 0; loop < numberOfDots; loop++) {
      const interval = 1 / numberOfDots;
      const loopInterval = loop + 1;
      const inputRange = [
        loopInterval * (interval / numberOfDots),
        loopInterval * interval,
      ];
      dots.push(
        <Animated.View
          key={loop}
          style={{
            opacity: opacity.interpolate({
              inputRange,
              outputRange: [0, 1],
            }),
            borderRadius: size,
            height: size,
            width: size,
            backgroundColor: color,
            marginHorizontal: space,
          }}
        />,
      );
    }
    return dots;
  };

  return <View style={[styles.container, style]}>{renderDots()}</View>;
};

export default Loading;
