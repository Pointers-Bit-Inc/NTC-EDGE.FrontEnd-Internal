import React, { useCallback } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Text from '../text';
import { getInitial, getColorFromName } from 'src/utils/formatting';
import { primaryColor } from '@styles/color';
import { RFValue } from 'react-native-responsive-fontsize';

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
  backgroundColor = '',
  style = {},
}) => {
  const getBackgroundColor = useCallback(() => {
    if (!backgroundColor) {
      return getColorFromName(name);
    }
    return backgroundColor;
  }, []);

  if (image) {
    return (
      <Image
        style={[
          styles.image,
          {
            backgroundColor: getBackgroundColor(),
            height: RFValue(size),
            width: RFValue(size),
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
          backgroundColor: getBackgroundColor(),
          height: RFValue(size),
          width: RFValue(size),
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
