import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Text from '../text';
import { getInitial } from 'src/utils/formatting';
import { primaryColor } from '@styles/color';

const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
});

const ProfileImage = ({
  image = '',
  name = '',
  size = 35,
  textSize = 14,
  backgroundColor = '#42495B',
  style = {},
}) => {
  if (image) {
    return (
      <Image
        style={[
          styles.image,
          {
            backgroundColor,
            height: size,
            width: size,
            borderRadius: size,
          },
          style
        ]}
        borderRadius={size}
        source={{ uri: image }}
      />
    );
  }
  return (
    <View
      style={[
        styles.image,
        {
          backgroundColor,
          height: size,
          width: size,
          borderRadius: size,
        },
        style
      ]}>
      <Text
        size={textSize}
        weight={'bold'}
        color={'white'}
      >
        {getInitial(name)}
      </Text>
    </View>
  )
}

export default ProfileImage
