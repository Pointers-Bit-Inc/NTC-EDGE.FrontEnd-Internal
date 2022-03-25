import React, { useState } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import { setMeeting } from 'src/reducers/meeting/actions';
import { button, text } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import { ArrowLeftIcon, ToggleIcon } from '@components/atoms/icon'
import { InputField } from '@components/molecules/form-fields'
import useSignalr from 'src/hooks/useSignalr';
import Button from '@components/atoms/button';
import lodash from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
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
    fontSize: RFValue(18),
    backgroundColor: '#EEEEEE',
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
  },
  icon: {
    fontSize: 16
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
    paddingVertical: 15,
    borderBottomColor: '#687287',
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  toggleDefault: {
    transform: [{ scaleX: -1 }],
    color: '#687287',
  },
  toggleActive: {
    color: button.primary,
  }
})

const CreateMeeting = ({ navigation, route }:any) => {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
     
    </SafeAreaView>
  )
}

export default CreateMeeting
