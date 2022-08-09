import React, { FunctionComponent, ReactNode } from "react";
import {Animated, StyleSheet, ViewProps, View, Platform} from "react-native";

import { CBTabViewOffset } from "./CBAnimatedTabView";
import { Theme } from "./CBTheme";

export interface CBAnimatedTabBarProps extends Omit<ViewProps, "style"> {
  scrollY: Animated.AnimatedValue;
  children: ReactNode;
  headerHeight:any
}

export const CBAnimatedTabBar: FunctionComponent<CBAnimatedTabBarProps> = ({
  children,
  scrollY,
                                                                             headerHeight,
  ...otherProps
}) => {
  const _CBTabViewOffset = Platform.OS === "ios" ? -headerHeight : 0

  const translateY = scrollY.interpolate({
    inputRange: [_CBTabViewOffset, _CBTabViewOffset + headerHeight],
    outputRange: [headerHeight, 0],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [
      _CBTabViewOffset + headerHeight,
      _CBTabViewOffset + headerHeight + 20,
    ],
    outputRange: [0, 1],
    extrapolateRight: "clamp",
  });

  return (
      <>
        <Animated.View
            style={[styles.tabBar, { transform: [{ translateY }] }]}
            {...otherProps}
        >
          {children}

        </Animated.View>
        <Animated.View style={{ opacity }}>
          <View style={styles.border} />
        </Animated.View>
      </>

  );
};

const styles = StyleSheet.create({
  tabBar: {
    width: "100%",
    zIndex: 10,
    paddingBottom: 10,
    backgroundColor: "#fff",
  },
  border: {
    height: 1,
    backgroundColor: "#eee",
  },
});
