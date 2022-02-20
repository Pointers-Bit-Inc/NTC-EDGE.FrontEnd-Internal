import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import { text, primaryColor } from 'src/styles/color';
import ProfileImage from '@components/atoms/image/profile';
import { Regular500 } from '@styles/font';

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
  rightIcon?: any;
  [x: string]: any;
}

const ChatItem: FC<Props> = ({
  image = '',
  name = '',
  contact = '',
  onPress = () => {},
  rightIcon,
  ...otherProps
}) => {
  return (
    <TouchableOpacity onPress={onPress} {...otherProps}>
      <View style={[styles.container, styles.horizontal]}>
        <ProfileImage
          image={image}
          name={name}
          size={42}
          textSize={14}
        />
        <View style={styles.content}>
          <Text
            color={'black'}
            size={16}
            numberOfLines={1}
            style={{ fontFamily: Regular500, marginBottom: -3 }}
          >
            {name}
          </Text>
          <Text
            color={text.default}
            size={12}
            numberOfLines={1}
          >
            {contact}
          </Text>
        </View>
        {rightIcon}
      </View>
    </TouchableOpacity>
  )
}

export default ChatItem
