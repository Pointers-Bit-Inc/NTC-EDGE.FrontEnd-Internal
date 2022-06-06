import React, {
  useEffect,
  useState,
  ReactNode,
  FC,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react'
import { View, StyleSheet, FlatList, Dimensions, Platform, TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import lodash from 'lodash';
import { useInitializeAgora } from 'src/hooks/useAgora';
import { MicIcon, CameraIcon, MicOffIcon, MessageIcon, ParticipantsIcon, ArrowDownIcon } from '@components/atoms/icon';
import {
  RtcLocalView,
  RtcRemoteView,
  VideoRenderMode,
  VideoRemoteState,
} from 'react-native-agora';
import ConnectingVideo from '@components/molecules/video/connecting'
import ProfileImage from '@components/atoms/image/profile';
import Text from '@components/atoms/text';
import { text } from '@styles/color';
import VideoButtons from '@components/molecules/video/buttons'
import VideoNotification from './notification';
import { getChannelName, getTimerString } from 'src/utils/formatting'
import IParticipants from 'src/interfaces/IParticipants';
import { RFValue } from 'react-native-responsive-fontsize';
import { Bold } from '@styles/font';
import useTimer from 'src/hooks/useTimer';
const { width, height } = Dimensions.get('window');

const AgoraLocalView =
  Platform.OS === 'android'
    ? RtcLocalView.TextureView
    : RtcLocalView.SurfaceView;

const AgoraRemoteView =
  Platform.OS === 'android'
    ? RtcRemoteView.TextureView
    : RtcRemoteView.SurfaceView;

  // const videoStateMessage = state => {
  //   switch (state) {
  //     case VideoRemoteState.Stopped:
  //       return 'Video is disabled';
  
  //     case VideoRemoteState.Frozen:
  //       return 'Connection Issue, Please Wait...';
  
  //     case VideoRemoteState.Failed:
  //       return 'Network Error';
  //   }
  // };
  
  // const videoStateIcon = state => {
  //   switch (state) {
  //     case VideoRemoteState.Stopped:
  //       return <Icon3 name={'videocam-off'} size={40} color={'white'} />;
  
  //     case VideoRemoteState.Frozen:
  //       return (
  //         <Icon4 name={'network-strength-1-alert'} size={40} color={'red'} />
  //       );
  
  //     case VideoRemoteState.Failed:
  //       return <Icon4 name={'network-strength-off'} size={40} color={'red'} />;
  //   }
  // };


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutTwoVideo: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    zIndex: 1,
    paddingVertical: 10,
    paddingTop: 30,
    paddingHorizontal: 15,
  },
  icon: {
    paddingHorizontal: 5
  },
  channelName: {
    flex: 1,
    marginHorizontal: 10,
  },
  horizontal: {
    flexDirection: 'row',
    flex: 1,
  },
  vertical: {
    flexDirection: 'column',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: 'grey',
  },
  fullVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallVideo: {
    backgroundColor: '#606A80',
    width: width * 0.30,
    height: width * 0.37,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  videoList: {
    position: 'absolute',
    bottom: 100,
    width,
  },
  name: {
    textAlign: 'center',
    marginTop: 5,
  },
  floatingName: {
    position: 'absolute',
    bottom: 5,
    left: 10,
  },
  mic: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  footer: {
    width: '100%',
    paddingTop: 10,
    position: 'absolute',
    bottom: 30,
  },
})

interface Props {
  loading?: boolean;
  participants?: [];
  meetingParticipants?: [];
  user: any;
  options: any;
  header?: any;
  agora?: any;
  callEnded?: boolean;
  message?: string;
  hasRoomName?: boolean;
  name?: string;
  isVoiceCall?: boolean;
  onEndCall?: any;
  onMute?: any;
  setNotification?: any;
  isGroup?: boolean;
  isMaximize?: boolean;
  pinnedParticipant?: any;
  setPinnedParticipant?: any;
  onMessages?: any;
  onAddParticipants?: any;
  onFullScreen?: any;
}

export type VideoLayoutRef =  {
  joinSucceed: boolean;
  isMute: boolean;
  isSpeakerEnable: boolean;
  isVideoEnable: boolean;
  toggleIsMute: () => void;
  toggleIsSpeakerEnable: () => void;
  toggleIsVideoEnable: () => void;
}

const VideoLayout: ForwardRefRenderFunction<VideoLayoutRef, Props> = ({
  loading = false,
  participants = [],
  meetingParticipants = [],
  user = {},
  options = {},
  agora = {},
  callEnded = false,
  message = '',
  hasRoomName = false,
  name = '',
  isVoiceCall = false,
  onEndCall = () => {},
  onMute = () => {},
  setNotification = () => {},
  isGroup = false,
  isMaximize = true,
  pinnedParticipant = null,
  setPinnedParticipant = () => {},
  onMessages = () => {},
  onAddParticipants = () => {},
  onFullScreen = () => {},
}, ref) => {
  const [selectedPeer, setSelectedPeer]:any = useState(null);
  const [peerList, setPeerList]:any = useState([]);
  const {
    timer,
    setStarted
  } = useTimer();
  const {
    initAgora,
    destroyAgoraEngine,
    joinChannel,
    isInit,
    myId,
    peerIds,
    peerVideoState,
    peerAudioState,
    channelName,
    joinSucceed,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    activeSpeaker,
    toggleIsMute,
    toggleRemoteAudio,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
    switchCamera,
  } = useInitializeAgora({
    ...agora,
    options: {
      ...options,
      isVideoEnable: isVoiceCall ? !isVoiceCall : options?.isVideoEnable,
    },
  })

  useImperativeHandle(ref, () => ({
    joinSucceed,
    isMute,
    isSpeakerEnable,
    isVideoEnable,
    toggleIsMute,
    toggleRemoteAudio,
    toggleIsSpeakerEnable,
    toggleIsVideoEnable,
  }));

  useEffect(() => {
    if (!loading && agora.appId) {
      initAgora();
    }
  }, [loading, agora.appId]);
  
  useEffect(() => {
    if (isInit) {
      joinChannel();
      setStarted(true);
    }
  }, [isInit]);

  useEffect(() => {
    if (callEnded) {
      setStarted(false);
      destroyAgoraEngine();
    }
  }, [callEnded]);

  useEffect(() => {
    if (meetingParticipants) {
      const isPinnedInTheMeeting = lodash.find(peerIds, (p:number) => p === pinnedParticipant?.uid);
      let filterPeer = lodash.reject(peerIds, (p:number) => p === myId);

      if (!!isPinnedInTheMeeting) {
        filterPeer = lodash.reject(peerIds, (p:number) => p === pinnedParticipant.uid);
      }

      if (lodash.size(peerIds) === 2 && !isPinnedInTheMeeting) {
        setPinnedParticipant(null);
        setSelectedPeer(filterPeer[0]);
        setPeerList([myId]);
      } else {
        const findFocus = lodash.find(meetingParticipants, (p:IParticipants) => {
          if (p.isFocused) {
            const findPeer = lodash.find(peerIds, (pd:number) => pd === p.uid)
            return !!findPeer;
          }
          return false
        });
        if (findFocus && !isPinnedInTheMeeting) {
          filterPeer = lodash.reject(peerIds, (p:number) => p === findFocus.uid);
          setPinnedParticipant(null);
          setSelectedPeer(findFocus.uid);
          setPeerList(filterPeer);
        } else {
          if (!isPinnedInTheMeeting) {
            setPinnedParticipant(null);
            setSelectedPeer(myId);
          }
          setPeerList(filterPeer);
        }
      }
      
      checkToggleMute();
    }
  }, [meetingParticipants, peerIds, pinnedParticipant])

  useEffect(() => {
    const filterPeer = lodash.reject(peerIds, p => p === selectedPeer);
    setPeerList(filterPeer);
  }, [selectedPeer])

  useEffect(() => {
    if (isGroup && !pinnedParticipant) {
      if (activeSpeaker) {
        setSelectedPeer(activeSpeaker);
      } else {
        setSelectedPeer(myId);
      }
    }
  }, [activeSpeaker, pinnedParticipant]);

  useEffect(() => {
    if (pinnedParticipant?.uid) {
      setSelectedPeer(pinnedParticipant.uid);
    }
  }, [pinnedParticipant]);

  const checkToggleMute = () => {
    const userParticipantDetails:IParticipants = lodash.find(meetingParticipants, (p:IParticipants) => p._id === user?._id);
    if (userParticipantDetails) {
      if (!!userParticipantDetails.muted !== isMute) {
        toggleIsMute();
      }
    }
  }

  const onSetPinnedParticipant = (participant:IParticipants) => {
    if (pinnedParticipant?.uid && pinnedParticipant._id === participant._id) {
      setPinnedParticipant(null);
    } else {
      setPinnedParticipant(participant);
    }
  }

  const onToggleMute = () => {
    onMute(!isMute);
  }

  const separator = () => (
    <View style={{ width: 15 }} />
  );
  
  const fullVideo = (isFocused) => {
    const findParticipant = lodash.find(meetingParticipants, p => p.uid === selectedPeer);
    if (isFocused) {
      return (
        <View style={styles.fullVideo}>
          {
            isVideoEnable ? (
              <AgoraLocalView
                style={styles.video}
                channelId={channelName}
                renderMode={VideoRenderMode.Fit}
              />
            ) : (
              <ProfileImage
                size={isMaximize ? 80 : 50}
                textSize={isMaximize ? 16 : 24}
                image={user?.profilePicture?.thumb}
                name={`${user.firstName} ${user.lastName}`}
              />
            )
          }
          {
            isVideoEnable ? null : (
              <Text
                style={styles.name}
                numberOfLines={1}
                size={isMaximize ? 16 : 12}
                color={'white'}
              >
                {findParticipant?.title || ''} {findParticipant?.firstName}
              </Text>
            )
          }
          {
            isMaximize && (
              <>
                {
                  isMute ? (
                    <View style={[styles.mic, { top: 85, left: 18 }]}>
                      <MicOffIcon
                        color={text.error}
                      />
                    </View>
                  ) : null
                }
                {
                  isVideoEnable && (
                    <View style={{ position:'absolute', top: 85, right: 20 }}>
                      <TouchableOpacity onPress={switchCamera}>
                        <CameraIcon
                          size={20}
                          type='switch'
                          color={'white'}
                        />
                      </TouchableOpacity>
                    </View>
                  )
                }
              </>
            )
          }
        </View>
      );
    }
    return (
      <View style={styles.fullVideo}>
        {
          peerVideoState[selectedPeer] === VideoRemoteState.Decoding ? (
            <AgoraRemoteView
              style={styles.video}
              channelId={channelName}
              uid={selectedPeer}
              renderMode={VideoRenderMode.Fit}
            />
          ) : (
            <ProfileImage
              image={findParticipant?.profilePicture?.thumb}
              name={`${findParticipant?.firstName} ${findParticipant?.lastName}`}
              size={isMaximize ? 80 : 50}
              textSize={isMaximize ? 16 : 24}
            />
          )
        }
        {
          peerVideoState[selectedPeer] === VideoRemoteState.Decoding ? null : (
            <Text
              style={styles.name}
              numberOfLines={1}
              size={isMaximize ? 16 : 12}
              color={'white'}
            >
              {findParticipant?.title || ''} {findParticipant?.firstName}
            </Text>
          )
        }
        {
          isMaximize && peerAudioState[selectedPeer] === 0 ? (
            <View style={[styles.mic, { top: 85, left: 18 }]}>
              <MicOffIcon
                color={text.error}
              />
            </View>
          ) : null
        }
      </View>
    )
  }

  const renderItem = ({ item }) => {
    const findParticipant = lodash.find(meetingParticipants, p => p.uid === item);
    if (findParticipant) {
      if (item === myId) {
        return (
          <TouchableWithoutFeedback onPress={() => onSetPinnedParticipant(findParticipant)}>
            <View style={styles.smallVideo}>
              {
                isVideoEnable ? (
                  <AgoraLocalView
                    style={styles.video}
                    channelId={channelName}
                    renderMode={VideoRenderMode.Fit}
                  />
                ) : (
                  <ProfileImage
                    image={findParticipant?.profilePicture?.thumb}
                    name={`${findParticipant.firstName} ${findParticipant.lastName}`}
                    size={50}
                    textSize={16}
                  />
                )
              }
              <Text
                style={
                  isVideoEnable ?
                  styles.floatingName : styles.name
                }
                numberOfLines={1}
                size={12}
                color={'white'}
              >
                {findParticipant?.title || ''} {findParticipant.firstName}
              </Text>
              {
                isMute ? (
                  <View style={styles.mic}>
                    <MicOffIcon
                      color={text.error}
                      width={RFValue(16)}
                      height={RFValue(16)}
                    />
                  </View>
                ) : null
              }
              {
                isVideoEnable && (
                  <View style={{ position:'absolute', top: 0, right: 5 }}>
                    <TouchableOpacity onPress={switchCamera}>
                      <CameraIcon
                        size={22}
                        type='switch'
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>
          </TouchableWithoutFeedback>
        );
      }
      return (
        <TouchableWithoutFeedback onPress={() => onSetPinnedParticipant(findParticipant)}>
          <View style={styles.smallVideo}>
            {
              peerVideoState[item] === VideoRemoteState.Decoding ? (
                <AgoraRemoteView
                  style={styles.video}
                  channelId={channelName}
                  uid={item}
                  renderMode={VideoRenderMode.Fit}
                />
              ) : (
                <ProfileImage
                  image={findParticipant?.profilePicture?.thumb}
                  name={`${findParticipant.firstName} ${findParticipant.lastName}`}
                  size={50}
                  textSize={16}
                />
              )
            }
            <Text
              style={
                peerVideoState[item] === VideoRemoteState.Decoding ?
                styles.floatingName : styles.name
              }
              numberOfLines={1}
              size={12}
              color={'white'}
            >
              {findParticipant?.title || ''} {findParticipant.firstName}
            </Text>
            {
              peerAudioState[item] === 0 ? (
                <View style={styles.mic}>
                  <MicOffIcon
                    color={text.error}
                    width={RFValue(16)}
                    height={RFValue(16)}
                  />
                </View>
              ) : null
            }
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return null;
  }

  const renderVideoElement = () => {
    if (joinSucceed && !callEnded) {
      if (isGroup || (!isGroup && lodash.size(peerIds) > 1)) {
        return (
          <>
            {fullVideo(!selectedPeer || selectedPeer === myId)}
            {
              isMaximize && (
                <View style={styles.videoList}>
                  {
                    !!message && (
                      <VideoNotification
                        message={message}
                        setNotification={setNotification}
                      />
                    )
                  }
                  <FlatList
                    data={peerList}
                    bounces={false}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    ItemSeparatorComponent={separator}
                    ListHeaderComponent={separator}
                    ListFooterComponent={separator}
                    keyExtractor={item => `${item}`}
                  />
                </View>
              )
            }
          </>
        )
      }
    }

    return (
      <ConnectingVideo
        participants={participants}
        callEnded={callEnded}
      />
    );
  }

  const renderHeader = () => {
    if (joinSucceed && !callEnded) {
      if (isGroup || (!isGroup && lodash.size(peerIds) > 1)) {
        if (!isMaximize) return;
        return (
          <View style={styles.header}>
            <TouchableOpacity onPress={() => {
              // leaveMeeting(meeting._id, 'leave');
              onFullScreen()
            }}>
              <ArrowDownIcon
                color={'white'}
                size={20}
              />
            </TouchableOpacity>
            <View style={styles.channelName}>
              <Text
                color={'white'}
                size={12}
                numberOfLines={1}
                style={{ fontFamily: Bold }}
              >
                {getChannelName({ otherParticipants: participants, isGroup: isGroup, hasRoomName: hasRoomName, name: name })}
              </Text>
              <Text
                color='white'
                size={12}
              >
                {getTimerString(timer)}
              </Text>
            </View>
            <TouchableOpacity onPress={onMessages}>
              <View style={styles.icon}>
                <MessageIcon />
              </View>
            </TouchableOpacity>
            <View style={{ width: 5 }} />
            <TouchableOpacity onPress={onAddParticipants}>
              <View style={styles.icon}>
                <ParticipantsIcon />
              </View>
            </TouchableOpacity>
          </View>
        );
      }
    }

    return null;
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderVideoElement()}
      {
        isMaximize && !callEnded && (
          <View style={styles.footer}>
            <VideoButtons
              onSpeakerEnable={toggleIsSpeakerEnable}
              onMute={onToggleMute}
              onVideoEnable={toggleIsVideoEnable}
              onMore={() => {}}
              onEndCall={() => onEndCall(joinSucceed && lodash.size(peerIds) <= 2)}
              isSpeakerEnabled={isSpeakerEnable}
              isMute={isMute}
              isVideoEnabled={isVideoEnable}
            />
          </View>
        )
      }
    </View>
  );
}

export default forwardRef(VideoLayout)
