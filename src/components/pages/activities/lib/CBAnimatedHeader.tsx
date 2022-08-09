import React, { FunctionComponent } from "react";
import {Animated, Platform, StyleSheet, ViewProps} from "react-native";

import { CBTabViewOffset } from "./CBAnimatedTabView";
import { Theme } from "./CBTheme";

export interface CBAnimatedHeaderProps extends Omit<ViewProps, "style"> {
  scrollY: Animated.AnimatedValue;
  headerHeight: any;
}

export const CBAnimatedHeader: FunctionComponent<CBAnimatedHeaderProps> = ({
  scrollY,
                                                                             headerHeight,
  children,
  ...otherProps
}) => {
  const _CBTabViewOffset = Platform.OS === "ios" ? -headerHeight : 0
  const translateY = scrollY.interpolate({
    inputRange: [_CBTabViewOffset, _CBTabViewOffset + headerHeight],
    outputRange: [0, -headerHeight],
    extrapolateLeft: "clamp",
  });
  return (
    <Animated.View
      style={[styles.header, { transform: [{ translateY }] }]}
      {...otherProps}
    >
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    top: 0,
    width: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    zIndex: 2,

  },
});
