import React, { useEffect, useState } from 'react'
import {
  Alert,
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from 'react-native'
import StyleSheet from 'react-native-media-query';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import lodash from 'lodash';
import { AddParticipantsIcon, ArrowDownIcon, ArrowLeftIcon, MicOffIcon, MicOnIcon, SpeakerIcon, SpeakerOffIcon, SpeakerOnIcon, VideoOffIcon, VideoOnIcon } from '@components/atoms/icon'
import { setSelectedChannel } from 'src/reducers/channel/actions';
import { resetCurrentMeeting, setMeeting, setOptions, updateMeetingParticipants } from 'src/reducers/meeting/actions';
import Text from '@components/atoms/text'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import useSignalr from 'src/hooks/useSignalr';
import { AgoraVideoPlayer, createMicrophoneAndCameraTracks } from 'agora-rtc-react';
import { button, text } from '@styles/color';
import { Bold, Regular, Regular500 } from '@styles/font';

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
import { fontValue } from '@components/pages/activities/fontValue';
import Loading from '@components/atoms/loading';
import AddParticipants from '@components/pages/chat-modal/participants';
import GroupImage from '@components/molecules/image/group';
import IParticipants from 'src/interfaces/IParticipants';
import FloatingVideo from '@components/pages/chat-modal/floating-video';
import useCamera from 'src/hooks/useCamera';
import useMicrophone from 'src/hooks/useMicrophone';
import ProfileImage from '@components/atoms/image/profile';
import usePlayback from 'src/hooks/usePlayback';

const { ids, styles } = StyleSheet.create({
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
  participantsBox: {
    backgroundColor: 'white',
    '@media (min-width: 800px)': {
      width: 400,
    },
    '@media (max-width: 800px)': {
      width: '100%',
    },
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
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  controls: {
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
  videoControls: {
    flexShrink: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  scrollContainer: {
    flex: 1,
    backgroundColor: '#565961'
  },
  videoGroupContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoBox: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: '#565961',
    borderWidth: 1,
    margin: 2,
  },
  name: {
    textAlign: 'center',
    marginTop: 5,
  },
  disabledVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#606A80',
  }
});

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks({
  encoderConfig: 'high_quality',
}, {
  optimizationMode: 'detail',
  encoderConfig: '720p_2',
});

const getUrlVars = () => {
  var vars:any = {}, hash:any;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
    hash = hashes[i].split('=');
    vars[hash[0]] = hash[1];
  }

  return vars;
}

const VideoCall = () => {
  const dispatch = useDispatch();
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
  const { channelId, meetingId, isVoiceCall } = getUrlVars();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { meeting } = useSelector((state:RootStateOrAny) => state.meeting);
  const {
    createMeeting,
    initSignalR,
    onConnection,
    onChatUpdate,
    onRoomUpdate,
    onMeetingUpdate,
    OnMeetingNotification,
    destroySignalR,
  } = useSignalr();
  const { width } = useWindowDimensions();
  const cameraList = useCamera();
  const microphoneList = useMicrophone();
  const playbackList = usePlayback();
  const { ready, tracks }:any = useMicrophoneAndCameraTracks();
  const [loading, setLoading] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [readyToStart, setReadyToStart] = useState(false);
  const [meetingName, setMeetingName] = useState('');
  const [currentMeeting, setCurrentMeeting] = useState({
    channelId: '',
    isChannelExist: false,
    participants: [],
  });
  const [selectedContacts, setSelectedContacts] = useState([]);

  const onStartMeeting = () => {
    setLoading(true);
    if (currentMeeting.isChannelExist) {
      createMeeting({ roomId: currentMeeting.channelId, isVoiceCall, participants: currentMeeting.participants, name: meetingName }, (error, data) => {
        setLoading(false);
        if (!error) {
          const { room } = data;
          data.otherParticipants = lodash.reject(data.participants, (p:IParticipants) => p._id === user._id);
          room.otherParticipants =  data.otherParticipants;
          dispatch(setSelectedChannel(data.room, currentMeeting.isChannelExist));
          dispatch(resetCurrentMeeting());
          dispatch(setOptions({
            isHost: true,
            isVoiceCall,
            isMute: !micEnabled,
            isVideoEnable: videoEnabled,
          }));
          dispatch(setMeeting(data))
        } else {
          setLoading(false);
          Alert.alert('Something went wrong.');
        }
      });
    } else {
      createMeeting({ participants: currentMeeting.participants, name: meetingName }, (error, data) => {
        setLoading(false);
        if (!error) {
          const { room } = data;
          data.otherParticipants = lodash.reject(data.participants, (p:IParticipants) => p._id === user._id);
          room.otherParticipants =  data.otherParticipants;
          dispatch(setSelectedChannel(data.room));
          dispatch(resetCurrentMeeting());
          dispatch(setOptions({
            isHost: true,
            isVoiceCall,
            isMute: !micEnabled,
            isVideoEnable: videoEnabled,
          }));
          dispatch(setMeeting(data))
        } else {
          setLoading(false);
          Alert.alert('Something went wrong.');
        }
      });
    }
  };

  const checkSelectedItems = (selectedItem:any) => {
    if (lodash.size(selectedItem) === 1 && selectedItem[0].isGroup) {
      setCurrentMeeting({
        channelId: selectedItem[0]._id,
        isChannelExist: true,
        participants: selectedItem[0].participants,
      })
    } else {
      const tempParticipants:any = [];
      lodash.map(selectedItem, (item:any) => {
        if (item.isGroup) {
          lodash.map(item.participants, (p:IParticipants) => {
            const isExists = lodash.find(tempParticipants, (temp:IParticipants) => temp._id === p._id);
            if (!isExists) {
              tempParticipants.push(p);
            }
          })
        } else {
          const isExists = lodash.find(tempParticipants, (temp:IParticipants) => temp._id === item._id);
          if (!isExists) {
            tempParticipants.push(item);
          }
        }
      });

      setCurrentMeeting({
        channelId: '',
        isChannelExist: false,
        participants: tempParticipants,
      })
    }
  }

  useEffect(() => {
    initSignalR();
    onConnection('OnChatUpdate',onChatUpdate);
    onConnection('OnRoomUpdate',onRoomUpdate);
    onConnection('OnMeetingUpdate',onMeetingUpdate);
    onConnection('OnMeetingNotification',OnMeetingNotification);
    return () => {
      destroySignalR();
    }
  }, []);

  useEffect(() => {
    setReadyToStart(!(loading || selectedContacts.length === 0 || !ready));
  }, [loading, selectedContacts, ready]);

  if (!fontsLoaded) {
    return null;
  }

  const renderMenu = (list:any = [], onSelect:any = () => {}) => {
    return (
      <Menu style={{ marginLeft: -10 }}>
        <MenuTrigger
          text={<ArrowDownIcon color={"white"}/>}
        />
        <MenuOptions>
          <FlatList
            data={list}
            renderItem={({ item, index})=>
              <MenuOption
                onSelect={() => onSelect(item)}
                text={item.label}
              />
            }
          />
        </MenuOptions>
      </Menu>
    )
  }

  const controls = () => {
    return (
      <View style={styles.optionsContainer}>
        <View style={styles.videoControls}>
          <TouchableOpacity onPress={() => setVideoEnabled(!videoEnabled)}>
            <View style={styles.controlsContainer}>
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
              {renderMenu(
                cameraList,
                (item:any) => tracks[1].setDevice(item.deviceId)
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setMicEnabled(!micEnabled)}>
            <View style={styles.controlsContainer}>
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
              {renderMenu(
                microphoneList,
                (item:any) => tracks[0].setDevice(item.deviceId)
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSpeakerEnabled(!speakerEnabled)}>
            <View style={styles.controlsContainer}>
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
              {renderMenu(
                playbackList,
                (item:any) => console.log('PLAYBACK', item)
              )}
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setShowParticipants(true)}>
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

  const connecting = () => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <Text
          size={20}
          color='white'
          style={{ fontFamily: Bold }}
        >
          Connecting
        </Text>
        <Loading
          size={10}
          space={4}
          numberOfDots={4}
          color={'#2A61CC'}
          speed={3000}
          style={{ marginLeft: 4 }}
        />
      </View>
    )
  }

  if (meeting) {
    return (
      <FloatingVideo
        tracks={tracks}
      />
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={styles.main}>
          {
            loading ? connecting() : (
              <InputField
                placeholder={'Meeting name'}
                containerStyle={[styles.containerStyle, { width: width * 0.35, minWidth: 320, marginVertical: 10 }]}
                placeholderTextColor={'white'}
                inputStyle={[styles.input]}
                outlineStyle={[styles.outline]}
                value={meetingName}
                onChangeText={setMeetingName}
                onSubmitEditing={(event:any) => setMeetingName(event.nativeEvent.text)}
                returnKeyType={'Done'}
              />
            )
          }
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
                  style={{ position: 'absolute', top: 10, left: 10, zIndex: 1 }}
                >
                  <MicOffIcon
                    width={16}
                    height={16}
                    color={text.error}
                  />
                </View>
              )
            }
            {
              ready && tracks && (
                <>
                  {
                    videoEnabled ? (
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
                    ) : (
                      <View style={styles.disabledVideo}>
                        <ProfileImage
                          image={user?.profilePicture?.thumb}
                          name={`${user.firstName} ${user.lastName}`}
                          size={50}
                          textSize={16}
                        />
                        <Text
                          style={styles.name}
                          numberOfLines={1}
                          size={12}
                          color={'white'}
                        >
                          {user?.title || ''} {user.firstName}
                        </Text>
                      </View>
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
              <TouchableOpacity onPress={() => window.close()}>
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
              <TouchableOpacity disabled={!readyToStart} onPress={onStartMeeting}>
                <View style={[styles.button, styles.startButton, !readyToStart && { backgroundColor: '#565961', borderColor: '#565961' }]}>
                  <Text
                    color={!readyToStart ? '#808196' : 'white'}
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
            <View style={styles.participantsBox} dataSet={{ media: ids.participantsBox }}>
              <AddParticipants
                meetingPartticipants={selectedContacts}
                onClose={() => setShowParticipants(false)}
                onSubmit={(selectedItem:any) => {
                  setSelectedContacts(selectedItem);
                  checkSelectedItems(selectedItem);
                }}
              />
            </View>
          )
        }
      </View>
    </View>
  );
}

export default VideoCall
