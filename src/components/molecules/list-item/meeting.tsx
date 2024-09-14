import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/atoms/text'
import Button from '@components/atoms/button'
import ProfileImage from '@components/atoms/image/profile'
import { VideoIcon } from '@components/atoms/icon'
import { text, outline, button, primaryColor } from '@/src/styles/color';
import { getDateTimeString, getDayMonthString, getTimeString } from '@/src/utils/formatting';
import { Regular, Regular500 } from '@styles/font'
import {fontValue as RFValue} from "@pages/activities/fontValue";

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: RFValue(45),
    width: RFValue(45),
    borderRadius: RFValue(45),
    backgroundColor: button.info,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    padding: 5,
    paddingHorizontal: 20,
    backgroundColor: button.info,
    borderRadius: 20,
  },
  closeButton: {
    padding: 8,
    paddingHorizontal: 15,
    borderColor: outline.error,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
  },
})

interface Props {
  name?: string,
  time?: any,
  participants?: [],
  onJoin?: () => void,
  ended?: boolean,
  data: any,
  others: any,
  style?: any,
}

const Meeting: FC<Props> = ({
  name = '',
  time,
  participants = [],
  onJoin = () => {},
  ended = false,
  data = {},
  others = 0,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.circle}>
        <VideoIcon
          type='video'
          color='white'
          size={RFValue(18)}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: -5 }}>
            <Text
              style={{ flex: 1 }}
              color={text.default}
              size={16}
              numberOfLines={1}
            >
              {name}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
            <Text
              color={text.default}
              size={14}
            >
              You &
            </Text>
            <View
              style={{ flexDirection: 'row', marginLeft: 2 }}
            >
              {
                participants.map((seen:any) => (
                  <ProfileImage
                    style={{ marginHorizontal: 1, }}
                    key={seen._id}
                    image={seen?.profilePicture?.thumb}
                    name={`${seen.firstName} ${seen.lastName}`}
                    size={20}
                    textSize={8}
                  />
                ))
              }
              {
                others > 0 && (
                  <ProfileImage
                    style={{ marginHorizontal: 1, }}
                    key={'others'}
                    image={''}
                    others={`+${others}`}
                    size={20}
                    textSize={8}
                  />
                )
              }
            </View>
          </View>
        </View>
        <View style={{ paddingRight: 15, alignSelf: 'flex-start', marginTop: RFValue(3) }}>
          <Text
            color={text.default}
            size={12}
            style={{ fontFamily: Regular }}
          >
            {getDateTimeString(data.createdAt, 'MM/DD')}
          </Text>
        </View>
        {
          ended ? (
            <Button
              disabled={true}
              style={[styles.joinButton, { backgroundColor: '#E5E5E5', paddingHorizontal: 15 }]}
              onPress={onJoin}
            >
              <Text
                color={text.default}
                size={12}
                style={{ fontFamily: Regular500 }}
              >
                Call ended
              </Text>
            </Button>
          ) : (
            <Button
              style={styles.joinButton}
              onPress={onJoin}
            >
              <Text
                color='white'
                size={12}
                style={{ fontFamily: Regular500 }}
              >
                Join now
              </Text>
            </Button>
          )
        }
      </View>
    </View>
  )
}

export default Meeting
