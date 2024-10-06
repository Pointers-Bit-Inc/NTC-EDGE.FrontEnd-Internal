import React, { useRef } from 'react';
import { Animated, ScrollView, StyleSheet, ViewStyle, ScrollViewProps } from 'react-native';

interface AnimatedScrollViewProps extends ScrollViewProps {
  fadeOutEffect?: boolean; // Toggle fade-out effect
  scaleEffect?: boolean; // Toggle scale effect
  parallaxEffect?: boolean; // Toggle parallax effect (translateY)
  animationRange?: [number, number]; // Custom range for the animation
  contentPadding?: number; // Custom content padding
  animatedStyle?: ViewStyle;
}

const AnimatedScrollView: React.FC<AnimatedScrollViewProps> = ({
                                                                                 children,
                                                                                 fadeOutEffect = false, // Enable fade-out by default
                                                                                 scaleEffect = true, // Enable scale by default
                                                                                 parallaxEffect = true, // Enable parallax by default
                                                                                 animationRange = [0, 200], // Default animation range
                                                                                 contentPadding = 20, // Default padding
                                                                                 animatedStyle,
                                                                                 ...otherProps // Capture any additional props for ScrollView
                                                                               }) => {
  // Create an animated value to track scroll position
  const scrollY = useRef(new Animated.Value(0)).current;

  // Conditionally apply fade-out effect
  const contentOpacity = fadeOutEffect
    ? scrollY.interpolate({
      inputRange: animationRange,
      outputRange: [1, 0], // Fades out content as you scroll
      extrapolate: 'clamp',
    })
    : 1; // No opacity change if fadeOutEffect is false

  // Conditionally apply scale effect
  const contentScale = scaleEffect
    ? scrollY.interpolate({
      inputRange: animationRange,
      outputRange: [1, 1.05], // Scales down content as you scroll
      extrapolate: 'clamp',
    })
    : 1; // No scaling if scaleEffect is false

  // Conditionally apply parallax effect
  const contentTranslateY = parallaxEffect
    ? scrollY.interpolate({
      inputRange: animationRange,
      outputRange: [0, -50], // Moves content up as you scroll
      extrapolate: 'clamp',
    })
    : 0; // No translation if parallaxEffect is false

  return (
    <Animated.ScrollView
      contentContainerStyle={[styles.scrollViewContent, { padding: contentPadding }]}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true } // Enable smooth animation
      )}
      scrollEventThrottle={16}
      {...otherProps} // Pass additional props to ScrollView
    >
      <Animated.View
        style={[
          {
            opacity: contentOpacity, // Apply fade-out effect (if enabled)
            transform: [
              { scale: contentScale }, // Apply scale effect (if enabled)
              { translateY: contentTranslateY }, // Apply translateY (if enabled)
            ],
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    // Dynamically adjust based on props
  },
});

export default AnimatedScrollView;
