import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/atoms/text'
import Button from '@components/atoms/button'
import ProfileImage from '@components/atoms/image/profile'
import { VideoIcon } from '@components/atoms/icon'
import { text, outline, button, primaryColor } from 'src/styles/color';
import { getDayMonthString } from 'src/utils/formatting';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: 45,
    width: 45,
    borderRadius: 45,
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  joinButton: {
    padding: 5,
    paddingHorizontal: 20,
    backgroundColor: button.primary,
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
  style?: any,
}

const Meeting: FC<Props> = ({
  name = '',
  time,
  participants = [],
  onJoin = () => {},
  ended = false,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.circle}>
        <VideoIcon
          type='video'
          color='white'
          size={18}
        />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{ flex: 1 }}
              color={text.default}
              size={16}
              numberOfLines={1}
            >
              {name}
            </Text>
            <Text
              color={text.default}
              size={14}
            >
              {getDayMonthString(time?.seconds)}
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
                    image={seen.image}
                    name={`${seen.firstName} ${seen.lastName}`}
                    size={18}
                    textSize={5}
                  />
                ))
              }
            </View>
          </View>
        </View>
        {
          ended ? (
            <Button
              disabled={true}
              style={[styles.joinButton, { backgroundColor: '#E5E5E5' }]}
              onPress={onJoin}
            >
              <Text
                color={text.default}
                size={12}
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
