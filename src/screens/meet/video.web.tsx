import React, { useEffect, useState } from 'react'
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  useWindowDimensions,
  Dimensions,
  ScrollView,
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

const gridStyles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
  }
})

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
  const [loading, setLoading] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [inputText, setInputText] = useState('');
  const [grid, setGrid] = useState(true);
  const [boxDimension, setBoxDimension] = useState({
    width: 0,
    height: 0,
  });
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    const participantSize = lodash.size(participants);
    let numberOfColumns = 2, numberOfRow = 2;

    switch(true) {
      case participantSize <= 4:
        numberOfColumns = 2;
        break;
      case participantSize > 4 && participantSize <= 9:
        numberOfColumns = 3;
        break;
      case participantSize > 9 && participantSize <= 16:
        numberOfColumns = 4;
        break;
      case participantSize > 16 && participantSize <= 25:
        numberOfColumns = 5;
        break;
      case participantSize > 25 && participantSize <= 36:
        numberOfColumns = 6;
        break;
      default:
        numberOfColumns = 7;
        break;
    }

    switch(true) {
      case width <= 768 && numberOfColumns > 1:
        numberOfColumns = 1;
        break;
      case width > 768 && width <= 992 && numberOfColumns > 2:
        numberOfColumns = 2;
        break;
      case width > 992 && width <= 1200 && numberOfColumns > 3:
        numberOfColumns = 3;
        break;
      case width > 1200 && width <= 1400 && numberOfColumns > 4:
        numberOfColumns = 4;
        break;
    }

    if (participantSize < 50) {
      if (numberOfColumns === 1) {
        numberOfRow = 2;
      } else if (numberOfColumns === 2) {
        if (participantSize === 2) {
          numberOfRow = 1  
        } else {
          numberOfRow = 2;
        }
      } else if (numberOfColumns === 3) {
        if (participantSize <= 6) {
          numberOfRow = 2;
        } else {
          numberOfRow = 3;
        }
      } else {
        numberOfRow = numberOfColumns - 1;
      }
    } else {
      numberOfRow = 7;
    }
    console.log('numberOfRow numberOfRow', numberOfRow);
    
    const boxWidth = width / numberOfColumns -8;
    const boxHeight = (height - 100) / numberOfRow;

    setBoxDimension({
      width: boxWidth,
      height: boxHeight,
    });
  }, [width, height, participants]);

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

  if (grid) {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={gridStyles.scrollContainer}>
          <View style={gridStyles.container}>
            {
              participants.map(p => (
                <View
                  key={p}
                  style={[
                    gridStyles.box,
                    { width: boxDimension.width, height: boxDimension.height }
                  ]}
                >
                  <Text>Participant {p}</Text>
                </View>
              ))
            }
          </View>
        </ScrollView>
        <View style={{ height: 100, width: '100%', backgroundColor: 'black' }}>
          <TouchableOpacity onPress={() => setParticipants((prev) => {
              const size = lodash.size(prev) + 1;
              return ([
                ...prev,
                size
              ])
            })}>
            <Text color='white'>INCREMENT</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
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
              <TouchableOpacity disabled={loading}>
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
