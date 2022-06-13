import React, {
  useEffect,
  useState,
  ReactNode,
  FC,
  useImperativeHandle,
  forwardRef,
  ForwardRefRenderFunction,
} from 'react'
import { View, FlatList, Dimensions, Platform, TouchableOpacity, TouchableWithoutFeedback, useWindowDimensions, ScrollView } from 'react-native'
import StyleSheet from 'react-native-media-query';
import lodash from 'lodash';
import { useInitializeAgora } from 'src/hooks/useAgora';
import { MicOffIcon, MessageIcon, ParticipantsIcon, CloseIcon, ArrowDownIcon, MenuIcon } from '@components/atoms/icon';
import { Hoverable } from 'react-native-web-hooks';
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
import { fontValue } from '@components/pages/activities/fontValue';
import Info from '@screens/chat/info';
import ChatView from '@components/pages/chat-modal/view';
import { RootStateOrAny, useSelector } from 'react-redux';
import { Bold } from '@styles/font';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import MeetingParticipants from '@screens/meet/participants';
const { width } = Dimensions.get('window');

const videoStyle = {
  width: '100%',
  height: '100%',
  backgroundColor: 'grey',
}

const { styles, ids } = StyleSheet.create({
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
    padding: 2,
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
    width: 300,
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
    top: 10,
    left: 10,
  },
  footer: {
    width: '100%',
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    paddingHorizontal: 10
  },
  scrollContainer: {
    flex: 1,
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
    borderColor: '#1F2022',
    borderWidth: 2,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#606A80',
    margin: 2,
  },
  sideContent: {
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 5,
    margin: 10,
    '@media (min-width: 800px)': {
      width: 400,
    },
    '@media (max-width: 800px)': {
      width: '100%',
      margin: 0,
      marginLeft: -20
    },
  },
  titleContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
    marginHorizontal: 10,
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
    shadowRadius: 3.84,
    elevation: 5,
  }
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
  const { height, width } = useWindowDimensions();
  const { tracks } = options;
  const { _id, name, hasRoomName, otherParticipants, lastMessage } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;
      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, p => p._id === user._id);
      return selectedChannel;
    }
  );
  const [selectedPeer, setSelectedPeer]:any = useState(null);
  const [peerList, setPeerList]:any = useState([]);
  const [sideContent, setSideContent] = useState('');
  const [layout, setLayout] = useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const [boxDimension, setBoxDimension] = useState({
    width: 0,
    height: 0,
  });
  const {
    initAgora,
    destroyAgoraEngine,
    joinChannel,
    leaveChannel,
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
    volumeIndicator,
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
    if (!loading && agora.appId && tracks) {
      initAgora();
    }
  }, [loading, agora.appId, tracks]);
  
  useEffect(() => {
    if (isInit) {
      joinChannel();

      return () => {
        leaveChannel();
      }
    }
  }, [isInit]);

  useEffect(() => {
    if (callEnded) {
      setSideContent('');
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

  useEffect(() => {
    const { width, height } = layout;
    const participantSize = lodash.size(peerIds);
    let numberOfColumns = 2, numberOfRow = 2;

    switch(true) {
      case participantSize === 1:
        numberOfColumns = 1;
        break;
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
      case width <= 400 && numberOfColumns > 1:
        numberOfColumns = 1;
        break;
      case width > 400 && width <= 992 && numberOfColumns > 2:
        numberOfColumns = 2;
        break;
      case width > 992 && width <= 1200 && numberOfColumns > 3:
        numberOfColumns = 3;
        break;
      case width > 1200 && width <= 1400 && numberOfColumns > 4:
        numberOfColumns = 4;
        break;
    }

    if (numberOfColumns === 1) {
      if (participantSize === 1) {
        numberOfRow = 1;
      } else {
        numberOfRow = 2;
      }
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
      numberOfRow = numberOfColumns;
    }
    
    const boxWidth = width / numberOfColumns -(6 * numberOfColumns);
    const boxHeight = ((height - (6 * numberOfRow)) / numberOfRow);

    setBoxDimension({
      width: boxWidth,
      height: boxHeight,
    });
  }, [layout, peerIds]);

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

  const onSetSideContent = (content = '') => {
    setSideContent(content);
  }

  const onLayout = ({ nativeEvent }:any) => setLayout(nativeEvent.layout);

  const renderVideoItem = (item:any, style:any = null, pinned = false) => {
    const findParticipant = lodash.find(meetingParticipants, p => p.uid === item);
    if (!findParticipant) return null
    if (item === myId && !pinned) {
      return (
        <TouchableWithoutFeedback key={item} onPress={() => onSetPinnedParticipant(findParticipant)}>
          <View style={[
            styles.videoBox,
            style || { width: boxDimension.width, height: boxDimension.height },
            volumeIndicator[item] && { borderColor: '#2863D6' }
          ]}>
            {
              isVideoEnable ? (
                <AgoraVideoPlayer
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
                    width={fontValue(16)}
                    height={fontValue(16)}
                  />
                </View>
              ) : null
            }
          </View>
        </TouchableWithoutFeedback>
      );
    }
    return (
      <TouchableWithoutFeedback key={item} onPress={() => onSetPinnedParticipant(findParticipant)}>
        <View style={[
          styles.videoBox,
          style || { width: boxDimension.width, height: boxDimension.height },
          !!volumeIndicator[item] && { borderColor: '#2863D6' }
        ]}>
          {
            (!!peerVideoState[item] && !pinned) ? (
              <AgoraVideoPlayer
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
              (!!peerVideoState[item] && !pinned) ?
              styles.floatingName : styles.name
            }
            numberOfLines={1}
            size={12}
            color={'white'}
          >
            {findParticipant?.title || ''} {findParticipant.firstName}
          </Text>
          {
            findParticipant.muted ? (
              <View style={styles.mic}>
                <MicOffIcon
                  color={text.error}
                  width={fontValue(16)}
                  height={fontValue(16)}
                />
              </View>
            ) : null
          }
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const renderVideoElement = () => {
    if (joinSucceed && tracks && !callEnded) {
      if (isGroup || (!isGroup && lodash.size(peerIds) > 1)) {
        if (pinnedParticipant) {
          return renderFullView();
        }
        return (
          <ScrollView style={styles.scrollContainer}>
            <View style={styles.videoGroupContainer}>
              {
                peerIds.map(p => renderVideoItem(p))
              }
            </View>
          </ScrollView>
        );
      }
    }
    return (
      <ConnectingVideo
        participants={participants}
        callEnded={callEnded}
      />
    );
  }

  const renderFullView = () => {
    return (
      <View style={{ flexDirection: width < 1000 ? 'column' : 'row', flex: 1 }}>
        <View style={styles.fullVideo}>
          {
            renderVideoItem(
              pinnedParticipant.uid,
              { width: '100%', height: '100%' }
            )
          }
        </View>
        <View style={[styles.videoList, width < 1000 && { width: layout.width }]}>
          <FlatList
            horizontal={width < 1000 ? true : false}
            data={peerIds}
            renderItem={({ item }) => renderVideoItem(
              item,
              { width: 280, height: 180, marginBottom: 10 },
              pinnedParticipant?.uid === item
            )}
          />
        </View>
      </View>
    )
  }

  const renderMenu = (list:any = [], onSelect:any = () => {}) => {
    return (
      <Menu style={{ marginLeft: -10 }}>
        <MenuTrigger>
          <MenuIcon type='more' color='white' size={fontValue(30)} />
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={styles.menuOptions}>
          <FlatList
            data={list}
            renderItem={({ item, index})=>
              <MenuOption
                onSelect={() => onSelect(item)}
              >
                <Text>{item}</Text>
              </MenuOption>
            }
          />
        </MenuOptions>
      </Menu>
    )
  }

  const renderSideContent = () => {
    if (sideContent === 'messages') {
      return (
        <>
          <View style={styles.titleContainer}>
            <View style={{ position: 'absolute', left: 0, zIndex: 999 }}>
              <TouchableOpacity onPress={() => onSetSideContent('')}>
                <CloseIcon
                  type='close'
                  size={fontValue(18)}
                />
              </TouchableOpacity>
            </View>
            <Text
              color={'black'}
              size={16}
              style={{ fontFamily: Bold }}
            >
              Messages
            </Text>
          </View>
          <ChatView
            channelId={_id}
            otherParticipants={otherParticipants}
            isGroup={isGroup}
            groupName={name}
            lastMessage={lastMessage}
            onNext={(message:string, data:any) => {}}
            participants={participants}
          />
        </>
      );
    } else if (sideContent === 'participants') {
      return (
        <MeetingParticipants
          onClose={() => onSetSideContent('')}
        />
      )
    }
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={{ flex: 1, height: height - 70, padding: 10 }}>
          <View
            style={{ width: '100%', height: '100%' }}
            onLayout={onLayout}
          >
            {renderVideoElement()}
          </View>
        </View>
        {
          !!sideContent && (
            <View style={styles.sideContent} dataSet={{ media: ids.sideContent }}>
              {renderSideContent()}
            </View>
          )
        }
      </View>
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
            <View style={{ position: 'absolute', right: 30, bottom: 15 }}>
              {
                width < 768 ? renderMenu(['Messages', 'Participants'], (item:string = '') => onSetSideContent(item?.toLowerCase())) : (
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity
                      onPress={() => onSetSideContent('messages')}
                    >
                      <View style={styles.icon}>
                        <MessageIcon width={26} height={26} />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => onSetSideContent('participants')}
                    >
                      <View style={styles.icon}>
                        <ParticipantsIcon width={26} height={26} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              }
            </View>
          </View>
        )
      }
    </View>
  );
}

export default forwardRef(VideoLayout)
