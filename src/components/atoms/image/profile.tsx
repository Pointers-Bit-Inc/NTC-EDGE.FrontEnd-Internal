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
    borderWidth: isMobile ? RFValue(2) : 2,
    borderColor: 'white',
    overflow: 'hidden'
  },
  onlineBorder: {
    backgroundColor: 'black',
    borderColor: '#34C759',
    borderWidth: isMobile ? RFValue(2) : 2,
    overflow: 'hidden',
  }
});

const ProfileImage = ({
  image = '',
  name = '',
  others = '',
  size = 35,
  textSize = 14,
  backgroundColor = '',
  isOnline = false,
  style = {},
  onlineStyle = {},
}) => {
  const imageSize = isOnline ? isMobile ? RFValue(size - 5) : size - 5 : isMobile ? RFValue(size) : size

  const getBackgroundColor = useCallback(() => {
    if (!backgroundColor) {
      return getColorFromName(name);
    }
    return backgroundColor;
  }, [name]);

  if (image) {
    return (
      <View style={isOnline && [styles.onlineBorder, { borderRadius: size * 1.5 }, onlineStyle]}>
        <View style={[
            styles.image,
            {
              backgroundColor: getBackgroundColor(),
              height: imageSize,
              width: imageSize,
              borderRadius: imageSize,
            },
            style
          ]}>
            <Image
              width={imageSize}
              height={imageSize}
              resizeMode={"cover"}
              source={{ uri: image }}
              style={{
                height: imageSize,
                width: imageSize,
                borderRadius: imageSize
              }}
            />
        </View>
        
      </View>
    );
  }
  return (
    <View style={isOnline && [styles.onlineBorder, { borderRadius: size * 2 }, onlineStyle]}>
      <View
        style={[
          styles.image,
          {
            backgroundColor: getBackgroundColor(),
            height: imageSize,
            width: imageSize,
            borderRadius: size,
          },
          style
        ]}>
        <Text
          size={textSize}
          color={'white'}
          style={{ fontFamily: Bold, marginRight: -1, marginTop: 1 }}
        >
          {others || getInitial(name)}
        </Text>
      </View>
    </View>
  )
}

export default ProfileImage
