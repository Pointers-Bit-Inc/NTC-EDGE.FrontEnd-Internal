import React, { useCallback } from 'react'
import { View, Image, StyleSheet } from 'react-native'
import Text from '../text';
import { getInitial, getColorFromName } from 'src/utils/formatting';
import { primaryColor } from '@styles/color';
import { RFValue } from 'react-native-responsive-fontsize';
import { Bold } from '@styles/font';
import {isMobile} from "@pages/activities/isMobile";

const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: isMobile ? RFValue(1.5) : 1,
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
            height: isMobile ? RFValue(size) : size,
            width: isMobile ? RFValue(size) : size,
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
          height: isMobile ? RFValue(size) : size,
          width: isMobile ? RFValue(size) : size,
          borderRadius: size,
        },
        style
      ]}>
      <Text
        size={textSize}
        color={'white'}
        style={{ fontFamily: Bold, marginRight: -1, marginTop: 1 }}
      >
        {getInitial(name)}
      </Text>
    </View>
  )
}

export default ProfileImage
