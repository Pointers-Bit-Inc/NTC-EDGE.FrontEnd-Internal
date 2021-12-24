import React, { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/atoms/text'
import Button from '@components/atoms/button'
import { text, outline, button } from 'src/styles/color';
import { getDateTimeString } from 'src/utils/formatting';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#D1D1FA',
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinButton: {
    padding: 8,
    paddingHorizontal: 15,
    borderColor: outline.primary,
    borderWidth: 1,
    backgroundColor: button.primary,
    borderRadius: 8,
    marginHorizontal: 5,
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
  onJoin?: () => void,
  onClose?: () => void,
  style?: any,
}

const MeetingNotif: FC<Props> = ({
  name = '',
  time,
  onJoin = () => {},
  onClose = () => {},
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={{ flex: 1 }}>
        <Text
          color={'black'}
          size={14}
          weight='bold'
          numberOfLines={1}
        >
          {name}
        </Text>
        <Text
          color={text.default}
          size={10}
        >
          Scheduled on
        </Text>
        <Text
          color={text.default}
          size={10}
        >
          {getDateTimeString(time?.seconds)}
        </Text>
      </View>
      <Button
        style={styles.joinButton}
        onPress={onJoin}
      >
        <Text
          color='white'
          size={12}
        >
          Join
        </Text>
      </Button>
      <Button
        style={styles.closeButton}
        onPress={onClose}
      >
        <Text
          color={text.error}
          size={12}
        >
          Close
        </Text>
      </Button>
    </View>
  )
}

export default MeetingNotif
