import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import ProfileImage from '@components/atoms/image/profile';
import { text, primaryColor } from 'src/styles/color';
import { GroupIcon } from '@components/atoms/icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 45,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10
  },
  channelInfo: {
    paddingBottom: 3,
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seenIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: primaryColor
  }
})

interface Props {
  image?: string;
  name?: string;
  time?: string;
  seen?: boolean,
  isSender?: boolean,
  isGroup?: boolean,
  message?: any;
  onPress?: any;
  [x: string]: any;
}

const ChatItem: FC<Props> = ({
  image = '',
  name = '',
  time = '',
  seen = false,
  isSender = false,
  isGroup = false,
  message = {},
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, styles.horizontal]}>
        {
          !isGroup ? (
            <ProfileImage
              image={image}
              name={name}
              size={45}
              textSize={14}
            />
          ) : (
            <View style={styles.image}>
              <GroupIcon size={18} color={'white'} />
            </View>
          )
        }
        <View style={styles.content}>
          <View style={[styles.horizontal, styles.channelInfo]}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Text
                weight={!seen ? 'bold' : 'normal'}
                size={16}
                numberOfLines={1}
              >
                {name}
              </Text>
            </View>
            <Text
              color={text.default}
              size={12}
            >
              {time}
            </Text>
          </View>
          <View style={styles.horizontal}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Text
                weight={!seen ? 'bold' : 'normal'}
                color={text.default}
                size={14}
                numberOfLines={1}
              >
                {`${isSender ? 'You' : message?.sender?.firstname}: ${message.message}`}
              </Text>
            </View>
            {
              !seen && (
                <View style={styles.seenIndicator} />
              )
            }
          </View>
        </View>
      </View>
    </TouchableOpacity>
    
  )
}

export default ChatItem
