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
import { MicIcon, CameraIcon, MicOffIcon } from '@components/atoms/icon';
// import {
//   VideoRenderMode,
//   VideoRemoteState,
// } from 'react-native-agora';

import {
  AgoraVideoPlayer,
} from "agora-rtc-react";

import ConnectingVideo from '@components/molecules/video/connecting'
import ProfileImage from '@components/atoms/image/profile';
import Text from '@components/atoms/text';
import { text } from '@styles/color';
import VideoButtons from '@components/molecules/video/buttons'
import VideoNotification from './notification';
import IParticipants from 'src/interfaces/IParticipants';
import { RFValue } from 'react-native-responsive-fontsize';
const { width, height } = Dimensions.get('window');

const AgoraLocalView = AgoraVideoPlayer;

const AgoraRemoteView = AgoraVideoPlayer;

const videoStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'grey',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layoutTwoVideo: {
    flex: 1,
    backgroundColor: 'black',
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
  isVoiceCall?: boolean;
  onEndCall?: any;
  onMute?: any;
  setNotification?: any;
  isGroup?: boolean;
  isMaximize?: boolean;
  pinnedParticipant?: any;
  setPinnedParticipant?: any;
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
  header = () => {},
  agora = {},
  callEnded = false,
  message = '',
  isVoiceCall = false,
  onEndCall = () => {},
  onMute = () => {},
  setNotification = () => {},
  isGroup = false,
  isMaximize = true,
  pinnedParticipant = null,
  setPinnedParticipant = () => {},
}, ref) => {
  const [selectedPeer, setSelectedPeer]:any = useState(null);
  const [peerList, setPeerList]:any = useState([]);
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
    tracks,
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
    if (!loading && agora.appId && ready && tracks) {
      initAgora();
    }
  }, [loading, agora.appId, ready, tracks]);
  
  useEffect(() => {
    if (isInit) {
      joinChannel();
    }
  }, [isInit]);

  useEffect(() => {
    if (callEnded) {
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
        toggleIsMute(userParticipantDetails.muted);
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
                style={videoStyle}
                videoTrack={tracks[1]}
                config={{
                  mirror: false,
                  fit: 'contain',
                }}
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
          !!peerVideoState[selectedPeer] ? (
            <AgoraRemoteView
              style={videoStyle}
              videoTrack={peerVideoState[selectedPeer]}
              config={{
                mirror: false,
                fit: 'contain',
              }}
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
          !!peerVideoState[selectedPeer] ? null : (
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
          isMaximize && !peerAudioState[selectedPeer] ? (
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
                    style={videoStyle}
                    videoTrack={tracks[1]}
                    config={{
                      mirror: false,
                      fit: 'contain',
                    }}
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
              !!peerVideoState[item] ? (
                <AgoraRemoteView
                  key={item}
                  style={videoStyle}
                  videoTrack={peerVideoState[item]} 
                  config={{
                    mirror: false,
                    fit: 'contain',
                  }}
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
                !!peerVideoState[item] ?
                styles.floatingName : styles.name
              }
              numberOfLines={1}
              size={12}
              color={'white'}
            >
              {findParticipant?.title || ''} {findParticipant.firstName}
            </Text>
            {
              !peerAudioState[item] ? (
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
    if (joinSucceed && tracks && !callEnded) {
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
    if (joinSucceed && tracks && !callEnded) {
      if (isGroup || (!isGroup && lodash.size(peerIds) > 1)) {
        return header();
      }
    }

    return () => {};
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
