import React, { useEffect, useState } from 'react'
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native'
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import lodash from 'lodash';
import { AddParticipantsIcon, ArrowLeftIcon, MicOffIcon, MicOnIcon, SpeakerIcon, SpeakerOffIcon, SpeakerOnIcon, VideoOffIcon, VideoOnIcon } from '@components/atoms/icon'
import {
  setNotification,
  updateMeetingParticipants,
} from 'src/reducers/meeting/actions';
import Text from '@components/atoms/text'
import VideoLayout from '@components/molecules/video/layout'
import { getChannelName, getTimerString } from 'src/utils/formatting'
import useSignalr from 'src/hooks/useSignalr';
import { requestCameraAndAudioPermission } from 'src/hooks/usePermission';
import { AgoraVideoPlayer, createMicrophoneAndCameraTracks } from 'agora-rtc-react';
import { button, text } from '@styles/color';
import { Regular, Regular500 } from '@styles/font';

import {
  useFonts,
  Poppins_100Thin,
  Poppins_100Thin_Italic,
  Poppins_200ExtraLight,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_300Light_Italic,
  Poppins_400Regular,
  Poppins_400Regular_Italic,
  Poppins_500Medium,
  Poppins_500Medium_Italic,
  Poppins_600SemiBold,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold,
  Poppins_700Bold_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from '@expo-google-fonts/poppins';
import { InputField } from '@components/molecules/form-fields';
import { RFValue } from 'react-native-responsive-fontsize';
import { fontValue } from '@components/pages/activities/fontValue';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#484B51',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  videoContainer: {
    backgroundColor: 'black',
    borderRadius: 10,
    borderColor: '#1F2022',
    borderWidth: 2,
    overflow: 'hidden',
  },
  optionsContainer: {
    width: '100%',
    padding: 10,
    paddingHorizontal: 30,
    backgroundColor: 'rgba(96,106,128,0.5)',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  controls: {
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  videoControls: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    marginTop: 30
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10
  },
  cancelButton: {
    borderColor: '#606A80',
    borderWidth: 1,
  },
  startButton: {
    backgroundColor: '#2863D6',
    borderColor: '#2863D6',
    borderWidth: 1,
  },
  containerStyle: {
    height: undefined,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: '#565961',
    backgroundColor: '#565961',
  },
  outline: {
    borderRadius: 10,
    backgroundColor: '#565961',
  },
  input: {
    fontSize: fontValue(20),
    fontFamily: Regular500,
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#565961'
  },
});

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks({
  encoderConfig: 'high_quality',
}, {
  optimizationMode: 'detail',
  encoderConfig: '720p_2',
});

const VideoCall = ({ navigation, route }) => {
  let [fontsLoaded] = useFonts({
    Poppins_100Thin,
    Poppins_100Thin_Italic,
    Poppins_200ExtraLight,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
  });
  const { height, width } = useWindowDimensions();
  const { ready, tracks }:any = useMicrophoneAndCameraTracks();
  const [loading, setLoading] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [inputText, setInputText] = useState('');

  if (!fontsLoaded) {
    return null;
  }

  const controls = () => {
    return (
      <View style={styles.optionsContainer}>
        <View style={styles.videoControls}>
          <TouchableOpacity onPress={() => setVideoEnabled(!videoEnabled)}>
            <View
              style={styles.controls}
            >
              {
                videoEnabled ? (
                  <VideoOnIcon />
                ) : (
                  <VideoOffIcon
                    width={25}
                    height={25}
                  />
                )
              }
              <Text
                style={{ fontFamily: Regular }}
                size={12}
                color={'white'}
              >
                Video {videoEnabled ? 'on' : 'off'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMicEnabled(!micEnabled)}>
            <View
              style={styles.controls}
            >
              {
                micEnabled ? (
                  <MicOnIcon
                    width={25}
                    height={25}
                    color={'white'}
                  />
                ) : (
                  <MicOffIcon
                    width={25}
                    height={25}
                    color={'white'}
                  />
                )
              }
              <Text
                style={{ fontFamily: Regular }}
                size={12}
                color={'white'}
              >
                Mic {micEnabled ? 'on' : 'off'}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSpeakerEnabled(!speakerEnabled)}>
            <View
              style={styles.controls}
            >
              {
                speakerEnabled ? (
                  <SpeakerOnIcon />
                ) : (
                  <SpeakerOffIcon />
                )
              }
              <Text
                style={{ fontFamily: Regular }}
                size={12}
                color={'white'}
              >
                Speaker {speakerEnabled ? 'on' : 'off'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setShowParticipants(!showParticipants)}>
          <View
            style={styles.controls}
          >
            <AddParticipantsIcon
              height={25}
              width={25}
            />
            <Text
              style={{ fontFamily: Regular }}
              size={12}
              color={'white'}
            >
              Add participants
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={styles.main}>
          <View style={{ paddingVertical: 10 }}>
            <InputField
              placeholder={'Meeting name'}
              containerStyle={[styles.containerStyle, { width: width * 0.35, minWidth: 320, }]}
              placeholderTextColor={'white'}
              inputStyle={[styles.input]}
              outlineStyle={[styles.outline]}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => {}}
              returnKeyType={'send'}
            />
          </View>
          <View style={
            [
              styles.videoContainer,
              {
                width: width * 0.35,
                height: width * 0.2,
                minWidth: 320,
                minHeight: 240,
              }
            ]}>
            {
              !micEnabled && (
                <View
                  style={{ position: 'absolute', top: 5, left: 5, zIndex: 1 }}
                >
                  <MicOffIcon
                    color={text.error}
                  />
                </View>
              )
            }
            {
              ready && tracks && (
                <>
                  {
                    videoEnabled && (
                      <AgoraVideoPlayer
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        videoTrack={tracks[1]}
                        config={{
                          mirror: false,
                          fit: 'contain',
                        }}
                      />
                    )
                  }
                  {controls()}
                </>
              )
            }
          </View>
          <View style={
            [
              styles.buttonContainer,
              {
                width: width * 0.2,
                minWidth: 320,
              }
            ]}>
            <View style={{ flex: 1 }}>
              <TouchableOpacity>
                <View style={[styles.button, styles.cancelButton]}>
                  <Text
                    color='white'
                    size={18}
                    style={{ fontFamily: Regular500 }}
                  >
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.1 }} />
            <View style={{ flex: 1 }}>
              <TouchableOpacity>
                <View style={[styles.button, styles.startButton, loading && { backgroundColor: '#565961', borderColor: '#565961' }]}>
                  <Text
                    color={loading ? '#808196' : 'white'}
                    size={18}
                    style={{ fontFamily: Regular500 }}
                  >
                    Start meeting
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {
          showParticipants && (
            <View style={{ flex: 0.25, backgroundColor: 'white' }}>
            </View>
          )
        }
      </View>
    </View>
  );
}

export default VideoCall
