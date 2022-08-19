import React, { useCallback } from 'react'
import {View,Image,StyleSheet,Platform} from 'react-native'
import Text from '../text';
import { getInitial, getColorFromName } from 'src/utils/formatting';
import { primaryColor } from '@styles/color';
import { RFValue } from 'react-native-responsive-fontsize';
import { Bold, Regular } from '@styles/font';
import {isMobile} from "@pages/activities/isMobile";
import {isTablet} from "react-native-device-info";
import FastImage from 'react-native-fast-image'
const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    borderRadius: 35,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: (isMobile && !(Platform?.isPad || isTablet())) ? RFValue(2) : 2,
    borderColor: 'white',
    overflow: 'hidden'
  },
  onlineBorder: {
    backgroundColor: 'black',
    borderColor: '#34C759',
    borderWidth: (isMobile && !(Platform?.isPad || isTablet())) ? RFValue(2) : 2,
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
  const imageSize = isOnline ? (isMobile && !(Platform?.isPad || isTablet())) ? RFValue(size - 5) : size - 5 : (isMobile && !Platform?.isPad) ? RFValue(size) : size

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
            <View style={{ position: 'absolute' }}>
              <Text
                size={imageSize / 2.3}
                color={'white'}
                style={{ fontFamily: Regular, marginRight: -1, marginTop: 1 }}
              >
                {others || getInitial(name)}
              </Text>
            </View>
            <FastImage
              resizeMode={"cover"}
              source={{ uri: image }}
              style={[{
                height: imageSize,
                width: imageSize,
                borderRadius: imageSize
              },  style]}
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
