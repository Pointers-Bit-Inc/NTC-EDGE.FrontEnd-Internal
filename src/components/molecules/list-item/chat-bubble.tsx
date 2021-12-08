import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/atoms/text'
import { primaryColor, bubble, text } from '@styles/color'

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    padding: 5,
    paddingHorizontal: 10,
  }
})

interface Props {
  message?: string;
  backgroundColor?: string,
  TextColor?: string,
  isSender?: boolean,
  maxWidth?: any,
  style?: any,
}

const ChatBubble:FC<Props> = ({
  message,
  isSender = false,
  maxWidth = '60%',
  style
}) => {
  return (
    <View style={[
      styles.container,
      {
        backgroundColor: isSender ? bubble.primary : bubble.secondary,
        maxWidth,
      },
      style
    ]}>
      <Text
        size={14}
        color={isSender ? 'white' : text.default}
      >
        {message}
      </Text>
    </View>
  )
}

export default ChatBubble
