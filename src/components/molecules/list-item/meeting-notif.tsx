import React, { FC } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import Button from '@components/atoms/button'
import { text, outline, button } from '@/src/styles/color';
import { getDateTimeString } from '@/src/utils/formatting';
import { Bold, Regular500 } from '@styles/font';
import CloseIcon from '@assets/svg/close';
import { PhoneIcon } from '@components/atoms/icon';
import {fontValue as RFValue} from "@pages/activities/fontValue";

const styles = StyleSheet.create({
  container: {
    padding: RFValue(15),
    backgroundColor: '#E5EBFE',
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftColor: '#7897FF',
    borderLeftWidth: RFValue(3),
  },
  joinButton: {
    padding: RFValue(5),
    height: RFValue(30),
    paddingHorizontal: RFValue(15),
    borderColor: '#610BEF',
    borderWidth: RFValue(1),
    backgroundColor: '#610BEF',
    borderRadius: RFValue(30),
    marginHorizontal: RFValue(5),
  },
  closeButton: {
    paddingVertical: RFValue(4),
    height: RFValue(30),
    paddingHorizontal: RFValue(20),
    borderColor: '#CF0327',
    backgroundColor: '#CF0327',
    borderWidth: RFValue(1),
    borderRadius: RFValue(30),
    marginHorizontal: RFValue(5),
  },
})

interface Props {
  name?: string;
  host: any;
  time?: any;
  onJoin?: () => void;
  onClose?: any;
  closeText?: string;
  style?: any;
}

const MeetingNotif: FC<Props> = ({
  name = '',
  host = {},
  time,
  onJoin = () => {},
  onClose = () => {},
  closeText = 'Close',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={{ flex: 1 }}>
        <Text
          color={'black'}
          size={RFValue(14)}
          numberOfLines={1}
          style={{ fontFamily: Bold }}
        >
          {name}
        </Text>
        <Text
          color={text.default}
          size={RFValue(10)}
        >
          {`Created by ${host?.firstName} ${host?.lastName}`}
        </Text>
        <Text
          color={text.default}
          size={RFValue(10)}
        >
          {getDateTimeString(time, '')}
        </Text>
      </View>
      {/* <View style={{ position: 'absolute', top: 10, right: 10 }}>
        <TouchableOpacity onPress={onClose}>
          <CloseIcon
            color={'#565961'}
            height={RFValue(10)}
            width={RFValue(10)}
          />
        </TouchableOpacity>
      </View> */}
      <Button
        style={styles.joinButton}
        onPress={onJoin}
      >
        <Text
          color='white'
          size={RFValue(12)}
          style={{ fontFamily: Regular500 }}
        >
          Join
        </Text>
      </Button>
      <Button
        style={styles.closeButton}
        onPress={() => onClose(true)}
      >
        <PhoneIcon
          size={RFValue(20)}
          type='hangup'
          color='white'
        />
        {/* <Text
          color={'#CF0327'}
          size={12}
          style={{ fontFamily: Regular500 }}
        >
          {closeText}
        </Text> */}
      </Button>
    </View>
  )
}

export default MeetingNotif
