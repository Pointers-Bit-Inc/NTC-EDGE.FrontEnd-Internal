import React, { FC } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
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
  isSender?: boolean,
  maxWidth?: any,
  style?: any,
  [x: string]: any;
}

const ChatBubble:FC<Props> = ({
  message,
  isSender = false,
  maxWidth = '60%',
  style,
}) => {
  return (
    <TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
      </View>
    </TouchableOpacity>
  )
}

export default ChatBubble
