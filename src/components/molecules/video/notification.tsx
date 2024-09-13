import { Animated, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Text from '@components/atoms/text'

const { width } = Dimensions.get('screen');

const styles = StyleSheet.create({
  notif: {
    marginBottom: 5,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 5,
  }
})

const VideoNotification = ({ message = '', setNotification = (message:string) => {} }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (message) {
      fadeAnim.setValue(1);
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }
      ).start(() => setNotification(''));
    }
  }, [message]);

  return (
    <Animated.View style={[styles.notif, { opacity: fadeAnim }]}>
      <Text
        color='white'
        size={12}
      >
        {message}
      </Text>
    </Animated.View>
  )
}

export default VideoNotification