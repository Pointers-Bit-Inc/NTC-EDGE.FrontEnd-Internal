import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
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
    height: 55,
    width: 55,
    borderRadius: 55,
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
  }
})

interface Props {
  image?: string;
  name?: string;
  time?: string;
  message?: any;
  onPress?: any;
  [x: string]: any;
}

const ChatItem: FC<Props> = ({
  image = '',
  name = '',
  time = '',
  message = {},
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, styles.horizontal]}>
        {
          !!image ? (
            <Image
              style={styles.image}
              resizeMode={'contain'}
              source={{ uri: image }}
            />
          ) : (
            <View style={styles.image}>
              <GroupIcon color={'white'} />
            </View>
          )
        }
        <View style={styles.content}>
          <View style={[styles.horizontal, styles.channelInfo]}>
            <View style={{ flex: 1 }}>
              <Text
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
              {message?.time}
            </Text>
          </View>
          <Text
            color={text.default}
            size={14}
            numberOfLines={1}
          >
            {`${message.sender}: ${message.message}`}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
    
  )
}

export default ChatItem
