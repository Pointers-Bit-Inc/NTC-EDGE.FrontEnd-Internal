import React, { FC } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import { primaryColor, bubble, text } from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubble: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 2
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: primaryColor,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
  }
})

interface Props {
  message?: string;
  sender?: any;
  isSender?: boolean,
  maxWidth?: any,
  style?: any,
  [x: string]: any;
}

const ChatBubble:FC<Props> = ({
  message,
  sender = {},
  isSender = false,
  maxWidth = '60%',
  style,
  ...otherProps
}) => {
  return (
    <TouchableOpacity {...otherProps}>
      <View style={[styles.container, { maxWidth }, style]}>
        {
          !isSender ?(
            <ProfileImage
              image={sender.image}
              name={`${sender.firstname} ${sender.lastname}`}
              size={25}
              textSize={10}
            />
          ) : null
        }
        <View style={{ marginLeft: 10 }}>
          {
            !isSender ? (
              <Text
                size={10}
                color={text.default}
              >
                {sender.firstname}
              </Text>
            ) : null
          }
          <View style={[
            styles.bubble,
            {
              backgroundColor: isSender ? bubble.primary : bubble.secondary
            }
          ]}>
            <Text
              size={14}
              color={isSender ? 'white' : text.default}
            >
              {message}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ChatBubble
