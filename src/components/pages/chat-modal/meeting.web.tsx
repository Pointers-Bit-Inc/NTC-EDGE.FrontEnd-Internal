import React, { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { button, header } from '@styles/color';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 15,
    paddingBottom: 0,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    fontSize: RFValue(16),
    backgroundColor: '#EEEEEE',
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  icon: {
    fontSize: RFValue(16)
  },
  button: {
    borderRadius: 10,
    paddingVertical: 15,
    backgroundColor: button.primary
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: RFValue(15),
    borderBottomColor: '#A0A3BD',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  toggleDefault: {
    transform: [{ scaleX: -1 }],
    color: '#A0A3BD',
  },
  toggleActive: {
    color: '#2863D6',
  }
})

const CreateMeeting = ({
  barStyle = 'light-content',
  onClose = () => {},
  onSubmit = () => {},
  participants = [],
  isChannelExist = false,
  isVideoEnable = true,
  isVoiceCall = false,
  isMute = false,
  channelId,
}:any) => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={barStyle} />

    </SafeAreaView>
  )
}

export default CreateMeeting
