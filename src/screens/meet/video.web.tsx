import React, { useEffect, useState } from 'react'
import {
  Alert,
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Image,
} from 'react-native'
import StyleSheet from 'react-native-media-query';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import lodash from 'lodash';
import { AddParticipantsIcon, ArrowDownIcon, ArrowLeftIcon, MenuIcon, MicOffIcon, MicOnIcon, SpeakerIcon, SpeakerOffIcon, SpeakerOnIcon, VideoOffIcon, VideoOnIcon } from '@components/atoms/icon'
import { setSelectedChannel } from 'src/reducers/channel/actions';
import { getChannelName } from 'src/utils/formatting';
import { resetCurrentMeeting, setMeeting, setOptions, updateMeetingParticipants } from 'src/reducers/meeting/actions';
import Text from '@components/atoms/text'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import useSignalr from 'src/hooks/useSignalr';
import { AgoraVideoPlayer, createMicrophoneAndCameraTracks } from 'agora-rtc-react';
import { button, outline, text } from '@styles/color';
import { Bold, Regular, Regular500 } from '@styles/font';

const logo = require('@assets/ntc-edge.png');

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
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
import IMeetings from 'src/interfaces/IMeetings';
import { openUrl } from 'src/utils/web-actions';
import AwesomeAlert from 'react-native-awesome-alerts';
import { getBaseOs } from 'react-native-device-info';

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
    paddingHorizontal: 15,
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
  },
  menuOptions: {
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius:15,
    elevation: 45,
  },
  cancelText: {
    fontSize: fontValue(16),
    color: '#DC2626',
    fontFamily: Regular500,
  },
  confirmText: {
    fontSize: fontValue(16),
    color: text.info,
    fontFamily: Regular500,
  },
  titleMessage: {
    color: '#14142B',
    textAlign: 'center',
    fontSize: fontValue(18),
    fontFamily: Regular500,
  },
  message: {
    color: '#4E4B66',
    textAlign: 'center',
    fontSize:fontValue(14),
    marginHorizontal: 15,
    marginBottom: 15,
    fontFamily: Regular,
  },
  content: {
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  },
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
    vars[hash[0]] = hash[1] === 'false' ? false : hash[1] === 'true' ? true : hash[1];
  }

  return vars;
}

const VideoCall = () => {
  const dispatch = useDispatch();
  const [appIsReady, setAppIsReady] = useState(false);
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
  });
  const { roomId, meetingId, isVoiceCall } = getUrlVars();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { meeting } = useSelector((state:RootStateOrAny) => state.meeting);
  const {
    getChannel,
    createMeeting,
    getMeeting,
    initSignalR,
    onConnection,
    onStatusUpdate,
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
  const { ready, tracks, error }:any = useMicrophoneAndCameraTracks();
  const [loading, setLoading] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(!isVoiceCall);
  const [micEnabled, setMicEnabled] = useState(true);
  const [speakerEnabled, setSpeakerEnabled] = useState(true);
  const [readyToStart, setReadyToStart] = useState(false);
  const [meetingEnded, setMeetingEnded] = useState(false);
  const [actionType, setActionType] = useState('create');
  const [meetingName, setMeetingName] = useState('');
  const [tempMeeting, setTempMeeting] = useState<any>({});
  const [currentMeeting, setCurrentMeeting] = useState({
    roomId: '',
    isChannelExist: false,
    participants: [],
  });
  const [selectedContacts, setSelectedContacts] = useState<any>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    confirm: '',
  });
  const [baseOS, setBaseOS] = useState();
  const onStartMeeting = () => {
    setLoading(true);
    if (currentMeeting.isChannelExist) {
      createMeeting({ roomId: currentMeeting.roomId, isVoiceCall, participants: currentMeeting.participants, name: meetingName }, (error, data) => {
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
      const filteredParticipants = lodash.reject(currentMeeting.participants, (p:IParticipants) => p._id === user._id);
      createMeeting({ participants: filteredParticipants, name: meetingName }, (error, data) => {
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

  const onJoinMeeting = () => {
    if (!!lodash.size(tempMeeting)) {
      setLoading(true);
      getMeeting(meetingId, (err, data) => {
        setLoading(false);
        if (err) {
          Alert.alert('Something went wrong');
        } else {
          if (data) {
            const { room } = data;
            data.otherParticipants = lodash.reject(data.participants, (p:IParticipants) => p._id === user._id);
            room.otherParticipants =  data.otherParticipants;
            dispatch(setSelectedChannel(data.room));
            dispatch(resetCurrentMeeting());
            dispatch(setOptions({
              isHost: data?.host?._id === user._id,
              isVoiceCall: data?.isVoiceCall,
              isMute: !micEnabled,
              isVideoEnable: videoEnabled,
            }));
            dispatch(setMeeting(data))
          } else {
            Alert.alert('Something went wrong');
          }
        }
      })
      
    }
  }

  const checkSelectedItems = (selectedItem:any) => {
    if (lodash.size(selectedItem) === 1 && selectedItem[0].isGroup) {
      setCurrentMeeting({
        roomId: selectedItem[0]._id,
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
        roomId: '',
        isChannelExist: false,
        participants: tempParticipants,
      })
    }
  }

  useEffect(() => {
    initSignalR();
    onConnection('OnStatusUpdate', onStatusUpdate);
    onConnection('OnChatUpdate',onChatUpdate);
    onConnection('OnRoomUpdate',onRoomUpdate);
    onConnection('OnMeetingUpdate',onMeetingUpdate);
    onConnection('OnMeetingNotification',OnMeetingNotification);

    getBaseOs().then((baseOs) => {
      setBaseOS(baseOs);
    });
    
    return () => {
      destroySignalR();
    }
  }, []);

  useEffect(() => {
    if (meetingId) {
      setActionType('join');
      setLoading(true);
      getMeeting(meetingId, (err, data) => {
        setLoading(false);
        if (err) {
          Alert.alert('Something went wrong');
        } else {
          if (data) {
            const { room } = data;
            data.otherParticipants = lodash.reject(data.participants, (p:IParticipants) => p._id === user._id);
            room.otherParticipants =  data.otherParticipants;
            setTempMeeting(data);
          } else {
            Alert.alert('Something went wrong');
          }
        }
      })
    }
  }, [meetingId]);

  useEffect(() => {
    if (roomId) {
      setLoading(true);
      getChannel(roomId, (err, data) => {
        setLoading(false);
        if (err) {
          Alert.alert('Something went wrong');
        } else {
          if (data) {
            if (data.isGroup) {
              setSelectedContacts([data]);
              checkSelectedItems([data]);
            } else {
              const filteredParticipants = lodash.reject(data.participants, (p:IParticipants) => p._id === user._id);
              setSelectedContacts(filteredParticipants);
              checkSelectedItems(filteredParticipants);
            }
          } else {
            Alert.alert('Something went wrong');
          }
        }
      })
    }
  }, [roomId]);

  useEffect(() => {
    if (!meeting && meetingEnded && actionType === 'join') {
      openUrl('/VideoCall', '_self');
    } else {
      if (meeting?.ended) {
        setMeetingEnded(true);
      }
    }
  }, [meeting, meetingEnded]);

  useEffect(() => {
    if (actionType === 'create') {
      setReadyToStart(!(loading || selectedContacts.length === 0 || !ready));
    } else {
      setReadyToStart(!(loading || !ready || !lodash.size(tempMeeting)));
    }
  }, [loading, selectedContacts, ready, tempMeeting]);

  useEffect(() => {
    if(fontsLoaded) {
      setAppIsReady(true);
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (error?.code === 'PERMISSION_DENIED' || error?.code === 'NOT_READABLE') {
      let instruction = 'Browser Settings>Privacy and security>Site Settings.'
      if (error?.code !== 'PERMISSION_DENIED') {
        if (baseOS === 'Mac OS') {
          instruction = 'System Preferences>Security & Privacy>Privacy.'
        } else {
          instruction = 'System Settings>Privacy & security.'
        }
      }

      setAlertData({
        title: 'Unable to access camera & microphone',
        message: `Please allow camera & microphone access from ${instruction}`,
        confirm: 'OK',
      });
      setTimeout(() => setShowAlert(true), 500);
    }
  }, [error]);

  if (!appIsReady) {
    return (
      <View style={{
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#031A6E'
      }}>
        <Image
          resizeMode='contain'
          source={logo}
          style={{
            height: 250,
            width: 250,
          }}
        />
      </View>
    )
  }

  const renderMenu = (list:any = [], onSelect:any = () => {}) => {
    return (
      <Menu style={{ marginLeft: -10 }}>
        <MenuTrigger>
          <ArrowDownIcon size={18} color={"white"}/>
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={styles.menuOptions}>
          <FlatList
            data={list}
            renderItem={({ item, index})=>
              <MenuOption
                onSelect={() => onSelect(item)}
              >
                <Text>{item.label}</Text>
              </MenuOption>
            }
          />
        </MenuOptions>
      </Menu>
    )
  }

  const renderParticipants = () => {
    if (actionType === 'create') {
      if (currentMeeting?.participants?.length > 0) {
        return (
          <View style={{ alignSelf: 'center', marginBottom: 30 }}>
            <GroupImage
              participants={currentMeeting?.participants}
              size={60}
              textSize={28}
              inline={true}
              showOthers={true}
              othersColor={'white'}
              sizeOfParticipants={8}
            />
          </View>
        );
      }
      return null;
    } else {
      if (!!lodash.size(tempMeeting)) {
        return (
          <View style={{ alignSelf: 'center', marginBottom: 30 }}>
            <GroupImage
              participants={tempMeeting?.participants}
              size={tempMeeting.isGroup ? 60 : 45}
              textSize={tempMeeting?.isGroup ? 28 : 20}
              inline={true}
              showOthers={true}
              othersColor={'white'}
              sizeOfParticipants={8}
            />
          </View>
        );
      }
      return null;
    }
  }

  const controls = () => {
    return (
      <View style={[styles.optionsContainer, width < 1000 && { paddingHorizontal: 10 }]}>
        <View style={[styles.videoControls, (meetingId || roomId) && { justifyContent: 'center', flex: 1 }]}>
          <TouchableOpacity onPress={() => setVideoEnabled(!videoEnabled)}>
            <View style={[styles.controlsContainer, width < 1000 && { paddingHorizontal: 10 }]}>
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
            <View style={[styles.controlsContainer, width < 1000 && { paddingHorizontal: 10 }]}>
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
            <View style={[styles.controlsContainer, width < 1000 && { paddingHorizontal: 10 }]}>
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
        {
          !(meetingId || roomId) && (
            <TouchableOpacity onPress={() => setShowParticipants(true)}>
              <View
                style={styles.controls}
              >
                {
                  width < 1400 ? (
                    <MenuIcon type='more' color='white' size={fontValue(30)} />
                  ) : (
                    <>
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
                    </>
                  )
                }
              </View>
            </TouchableOpacity>
          ) 
        }
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
              <>
                <InputField
                  placeholder={'Meeting name'}
                  containerStyle={[styles.containerStyle, { width: width * 0.35, minWidth: 320, marginVertical: 10 }]}
                  placeholderTextColor={'white'}
                  inputStyle={[styles.input]}
                  outlineStyle={[styles.outline]}
                  value={actionType === 'create' ? meetingName : getChannelName({...tempMeeting, otherParticipants: tempMeeting?.participants})}
                  onChangeText={setMeetingName}
                  onSubmitEditing={(event:any) => setMeetingName(event.nativeEvent.text)}
                  disabled={actionType !== 'create'}
                  returnKeyType={'Done'}
                />
                {renderParticipants()}
              </>
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
              <TouchableOpacity
                disabled={!readyToStart}
                onPress={actionType === 'create' ? onStartMeeting : onJoinMeeting}
              >
                <View style={[styles.button, styles.startButton, !readyToStart && { backgroundColor: '#565961', borderColor: '#565961' }]}>
                  <Text
                    color={!readyToStart ? '#808196' : 'white'}
                    size={18}
                    style={{ fontFamily: Regular500 }}
                  >
                    {actionType === 'create' ? 'Start meeting' : 'Join meeting'}
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
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        contentContainerStyle={{ borderRadius: 15 }}
        title={alertData.title}
        titleStyle={styles.titleMessage}
        message={alertData.message}
        messageStyle={styles.message}
        contentStyle={styles.content}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={true}
        cancelButtonColor={'white'}
        confirmButtonColor={'white'}
        cancelButtonTextStyle={styles.cancelText}
        confirmButtonTextStyle={styles.confirmText}
        actionContainerStyle={{ justifyContent: 'space-around' }}
        confirmText={alertData.confirm}
        onConfirmPressed={() => setShowAlert(false)}
      />
    </View>
  );
}

export default VideoCall
