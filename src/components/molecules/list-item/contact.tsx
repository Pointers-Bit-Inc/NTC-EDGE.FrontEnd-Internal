import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import { text, primaryColor } from 'src/styles/color';

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
    height: 35,
    width: 35,
    borderRadius: 35,
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
  contact?: string;
  onPress?: any;
  [x: string]: any;
}

const ChatItem: FC<Props> = ({
  image = '',
  name = '',
  contact = '',
  onPress = () => {},
  ...otherProps
}) => {
  const getInitial = (value:any) => {
    return value.match(/(\b\S)?/g).join("").match(/(^\S|\S$)?/g).join("").toUpperCase()
  }

  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
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
              <Text
                size={12}
                weight={'bold'}
                color={'white'}
              >
                {getInitial(name)}
              </Text>
            </View>
          )
        }
        <View style={styles.content}>
          <Text
            size={14}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text
            color={text.default}
            size={12}
            numberOfLines={1}
          >
            {contact}ninscervantes@gmail.com
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ChatItem
