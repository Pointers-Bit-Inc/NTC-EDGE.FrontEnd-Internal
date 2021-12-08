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
  },
});

const ProfileImage = ({
  image = '',
  name = '',
  size = 35,
  textSize = 14,
  backgroundColor = primaryColor,
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
          }
        ]}
        resizeMode={'contain'}
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
        }
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
