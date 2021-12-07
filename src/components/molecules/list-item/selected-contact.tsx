import React, { FC } from 'react'
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import { button, primaryColor } from 'src/styles/color';
import { CloseIcon } from '@components/atoms/icon';

const imageSize = 45;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    width: imageSize + 30,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: imageSize,
    width: imageSize,
    borderRadius: imageSize,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
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
  floating: {
    position: 'absolute',
    zIndex: 9,
    right: 10,
    top: 10,
  },
  button: {
    height: 20,
    width: 20,
    borderRadius: 20,
    backgroundColor: '#707070',
    alignItems: 'center',
    justifyContent: 'center',
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
    <View style={[styles.container]} {...otherProps}>
      <View style={styles.floating}>
        <TouchableOpacity onPress={onPress}>
          <View style={styles.button}>
            <CloseIcon
              type={'close'}
              color={'white'}
              size={12}
            />
          </View>
        </TouchableOpacity>
      </View>
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
              size={14}
              weight={'bold'}
              color={'white'}
            >
              {getInitial(name)}
            </Text>
          </View>
        )
      }
      <Text
        size={14}
        numberOfLines={1}
      >
        {name}
      </Text>
    </View>
  )
}

export default ChatItem
