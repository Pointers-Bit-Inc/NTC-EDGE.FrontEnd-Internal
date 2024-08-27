import React,{FC,useEffect} from 'react'
import { View, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native'
import lodash from 'lodash';
import Text from '@components/atoms/text'
import GroupImage from '@components/molecules/image/group';
import ProfileImage from '@components/atoms/image/profile';
import { text, primaryColor } from 'src/styles/color';
import { GroupIcon } from '@components/atoms/icon';
import { Bold, Regular, Regular500 } from '@styles/font';
import {Hoverable} from "react-native-web-hooks";
import {isMobile} from "@pages/activities/isMobile";
import {RootStateOrAny,useSelector} from "react-redux";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingLeft: Platform.OS === 'web' ? 25 : 20,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    height: 45,
    width: 45,
    borderRadius: 45,
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
  },
  seenIndicator: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#2863D6'
  }
})

interface Props {
  image?: string;
  imageSize?: number;
  textSize?: number;
  name?: string;
  time?: string;
  seen?: boolean,
  isGroup?: boolean,
  message?: any;
  onPress?: any;
  participants?: any;
  user?: any;
  [x: string]: any;
}

const ChatItem: FC<Props> = ({
  image = '',
  imageSize = 35,
  textSize = 18,
  name = '',
  time = '',
  seen = false,
  isGroup = false,
  message = {},
  onPress = () => {},
  participants = [],
  ...otherProps
}) => {
  return (

      <TouchableOpacity onPress={onPress} {...otherProps}>
      <View style={[styles.container, styles.horizontal]}>
        {
          (!seen && Platform.OS === 'web') && (
            <View style={[styles.seenIndicator, { left: -15, marginRight: -10 }]} />
          )
        }
        {
          !isGroup ? (
            <ProfileImage
              image={image}
              name={name}
              size={imageSize}
              textSize={textSize}
              isOnline={participants[0]?.isOnline}
            />
          ) : (
            <GroupImage
              participants={participants}
              size={imageSize}
              textSize={textSize}
            />
          )
        }
        <View style={styles.content}>
          <View style={[styles.horizontal]}>
            <View style={{ flex: 1, paddingRight: 5 }}>
              <Text
                color={'black'}
                size={18}
                numberOfLines={1}
                style={{ fontFamily: !seen ? Regular500 : Regular }}
              >
                {name}
              </Text>
            </View>
          </View>
          <View style={styles.horizontal}>
            <View style={[styles.horizontal, { flex: 1, paddingRight: 60, marginTop: Platform.OS === 'ios' ? 0 : -5 }]}>
              <Text
                color={!seen ? 'black' : text.default}
                size={12}
                numberOfLines={1}
                style={{ fontFamily: Regular }}
              >
                {message?.message}
              </Text>
              <Text
                color={text.default}
                size={12}
                style={{ fontFamily: Regular }}
              >
                {message?.message ? ` · ${time}` : `${time}`}
              </Text>
            </View>
          </View>
        </View>
        {
          (!seen && Platform.OS !== 'web') && (
            <View style={styles.seenIndicator} />
          )
        }
      </View>
    </TouchableOpacity>

  )
}

export default ChatItem
