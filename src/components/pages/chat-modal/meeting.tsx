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
import { resetCurrentMeeting, setMeeting } from 'src/reducers/meeting/actions';
import { button, header } from '@styles/color';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import { ToggleIcon, CloseIcon } from '@components/atoms/icon'
import { InputField } from '@components/molecules/form-fields'
import useSignalr from 'src/hooks/useSignalr';
import Button from '@components/atoms/button';
import lodash from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';
import { Bold, Regular500 } from '@styles/font';

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
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const { createMeeting } = useSignalr();
  const [loading, setLoading] = useState(false);
  const [meetingName, setMeetingName] = useState('');
  const [videoOn, setVideoOn] = useState(isVideoEnable);
  const [micOn, setMicOn] = useState(!isMute);
  const onBack = onClose;
  const onStartMeeting = () => {
    setLoading(true);
    if (isChannelExist) {
      createMeeting({ roomId: channelId, isVoiceCall, participants, name: meetingName }, (error, data) => {
        setLoading(false);
        if (!error) {
          const { room } = data;
          data.otherParticipants = lodash.reject(data.participants, p => p._id === user._id);
          room.otherParticipants =  data.otherParticipants;
          dispatch(setSelectedChannel(data.room, isChannelExist));
          dispatch(resetCurrentMeeting());
          onSubmit({
            isHost: true,
            isVoiceCall,
            options: {
              isMute: !micOn,
              isVideoEnable: videoOn,
            }
          }, data);
        }
      });
    } else {
      createMeeting({ participants, name: meetingName }, (error, data) => {
        setLoading(false);
        if (!error) {
          const { room } = data;
          data.otherParticipants = lodash.reject(data.participants, p => p._id === user._id);
          room.otherParticipants =  data.otherParticipants;
          dispatch(setSelectedChannel(data.room));
          dispatch(resetCurrentMeeting());
          onSubmit({
            isHost: true,
            options: {
              isMute: !micOn,
              isVideoEnable: videoOn,
            }
          }, data);
        }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={barStyle} />
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5, marginBottom: RFValue(10) }]}>
          <View style={{ position: 'absolute', left: 0, zIndex: 999 }}>
            <TouchableOpacity onPress={onBack}>
              <CloseIcon
                type='close'
                size={RFValue(18)}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text
              color={header.default}
              size={16}
              style={{ fontFamily: Bold }}
            >
              New meeting
            </Text>
          </View>
        </View>
        <InputField
          containerStyle={{
            backgroundColor: '#EEEEEE',
            borderWidth: 0,
            height: null,
            paddingVertical: RFValue(15),
          }}
          inputStyle={[InputStyles.text, styles.input]}
          iconStyle={styles.icon}
          placeholder="Meeting name"
          outlineStyle={[InputStyles.outlineStyle, styles.outline]}
          placeholderTextColor="#979797"
          value={meetingName}
          onChangeText={setMeetingName}
          onSubmitEditing={(event:any) => setMeetingName(event.nativeEvent.text)}
        />
        <View style={{ paddingBottom: 60 }}>
          <View style={styles.section}>
            <Text
              color='#606A80'
              size={18}
            >
              Video {videoOn ? 'On' : 'Off'}
            </Text>
            <TouchableOpacity
              onPress={() => setVideoOn(!videoOn)}
            >
              <ToggleIcon
                style={
                  videoOn ?
                    styles.toggleActive :
                    styles.toggleDefault
                }
                size={RFValue(35)}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text
              color='#606A80'
              size={18}
            >
              Mic {micOn ? 'On' : 'Off'}
            </Text>
            <TouchableOpacity
              onPress={() => setMicOn(!micOn)}
            >
              <ToggleIcon
                style={
                  micOn ?
                    styles.toggleActive :
                    styles.toggleDefault
                }
                size={RFValue(35)}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Button
          style={styles.button}
          disabled={loading}
          onPress={onStartMeeting}
        >
          {
            loading ? (
              <ActivityIndicator color={'white'} size={24} />
            ) : (
              <Text
                size={18}
                color='white'
                style={{ fontFamily: Regular500 }}
              >
                Start Meeting
              </Text>
            )
          }
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default CreateMeeting
