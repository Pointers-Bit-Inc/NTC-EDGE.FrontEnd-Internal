import { View, Dimensions, Pressable, Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import lodash from 'lodash';
import { ArrowDownIcon, MessageIcon, ParticipantsIcon } from '@components/atoms/icon'
import {
  resetCurrentMeeting,
  setNotification,
  setOptions,
  setPinnedParticipant,
  updateMeeting,
  updateMeetingParticipants,
} from 'src/reducers/meeting/actions';
import { setSelectedChannel, setMeetings, removeSelectedMessage } from 'src/reducers/channel/actions';
import Text from '@components/atoms/text'
import VideoLayout from '@components/molecules/video/layout'
import { getChannelName, getTimerString } from 'src/utils/formatting'
import useSignalr from 'src/hooks/useSignalr';
import { Bold } from '@styles/font';
import { useNavigation } from '@react-navigation/native';
import IParticipants from 'src/interfaces/IParticipants';
import { RFValue } from 'react-native-responsive-fontsize';
import useTimer from 'src/hooks/useTimer';
import axios from 'axios';

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height + (Platform.OS === 'ios' ? 0 : 30),
};

const VideoWidth = dimensions.width * 0.15;
const VideoHeight = dimensions.width * 0.1;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#484B51',
    flex: 1,
  },
  position: {
    top: Platform.OS === 'android' ? 30 : 35,
    right: 15,
  },
  remote: {
    backgroundColor: '#606A80',
    overflow: 'hidden',
  },
  border: {
    borderWidth: 1,
    borderColor: '#BFBEFC',
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
    elevation: 5,
  },
  maximize: {
    height: dimensions.height,
    width: dimensions.width,
  },
  minimize: {
    height: VideoHeight,
    width: VideoWidth,
    borderRadius: 5,
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
  channelName: {
    flex: 1,
    marginHorizontal: 10,
  },
  layout: {
    flex: 1,
    backgroundColor: 'grey',
  },
  icon: {
    paddingHorizontal: 5
  },
  notif: {
    position: 'absolute',
    bottom: 90,
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 3,
    paddingHorizontal: 15,
  },
  indicator: {
    width: RFValue(6),
    height: RFValue(6),
    borderRadius: RFValue(6),
    backgroundColor: '#FF3939',
    position: 'absolute',
    right: RFValue(5),
    top: RFValue(1),
  }
});

const FloatingVideo = ({ tracks }:any) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const videoRef = useRef<any>(null);
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { selectedMessage, normalizedChannelList } = useSelector((state:RootStateOrAny) => state.channel);
  const { meeting, options, meetingId, isFullScreen, pinnedParticipant, roomId } = useSelector((state:RootStateOrAny) => {
    const { meeting, options = {}, isFullScreen, pinnedParticipant } = state.meeting;
    meeting.otherParticipants = lodash.reject(meeting.participants, (p:IParticipants) => p._id === user._id);
    return {
      meeting,
      options,
      meetingId: meeting?._id,
      isFullScreen,
      pinnedParticipant,
      roomId: meeting?.roomId,
    };
  });
  const userStatus:string|undefined = useMemo(() => {
    const participant:IParticipants = lodash.find(meeting.participants, (p:IParticipants) => p._id === user._id);
    const userStatus = participant?.status;
    let status:string = "";
    if (userStatus === 'pending' || userStatus === 'waiting') {
      status = userStatus;
    } else if (userStatus !== 'waiting' && participant.waitingInLobby) {
      status = 'pending';
    } else if (participant.waitingInLobby && !status) {
      status = 'waiting';
    }
    return status;
  }, [meeting.participants]);

  const {
    isMute = false,
    isVideoEnable = true,
    isHost = false,
    isVoiceCall = false
  } = options;
  const {
    endMeeting,
    joinMeeting,
    meetingLobby,
    leaveMeeting,
    muteParticipant,
  } = useSignalr();
  const {
    timer,
    setStarted
  } = useTimer();
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState({});
  const [isMaximized, setIsMaximized] = useState(true);
  const [ready, setReady] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  useEffect(() => {
    if (!meeting.ended) {
      setStarted(false);
    } else {
      setIsMaximized(true);
    }
  }, [meeting]);

  useEffect(() => {
    if (meetingId) setReady(true);

    return () => {
      dispatch(setOptions({
        isHost: false,
        isVoiceCall: false,
        isMute: false,
        isVideoEnable: true,
      }));
      location.reload();
    }
  }, [meetingId]);

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (ready) {
      if (userStatus === 'pending' || userStatus === 'waiting') {
        if (userStatus === 'pending') {
          meetingLobby({ meetingId: meeting._id }, (err:any, result:any) => {
            if (result) {
              setLoading(false);
              dispatch(updateMeeting(result));
            } else {
              if (axios.isCancel(err)) {
                console.log('CANCELLED');
              } else {
                setLoading(false);
                Alert.alert(err.message || 'Something went wrong.');
              }
            }
          }, { cancelToken: source.token });
        }
      } else if (!userStatus) {
        joinMeeting({ meetingId: meeting._id, muted: isMute }, (err:any, result:any) => {
          setLoading(false);
          if (result) {
            dispatch(updateMeetingParticipants(result.meeting));
            setAgora(result?.agora);
            setStarted(true);
          } else {
            if (axios.isCancel(err)) {
              console.log('CANCELLED');
            } else {
              Alert.alert(err.message || 'Something went wrong.');
            }
          }
        }, { cancelToken: source.token });
      }
    }
  
    return () => {
      source.cancel();
    }
  }, [ready, userStatus]);

  useEffect(() => {
    if (normalizedChannelList && normalizedChannelList[roomId]) {
      const { lastMessage = {} } = normalizedChannelList[roomId];
      const { seen = [] } = lastMessage;
      const hasSeen = !!lodash.find(seen, s => s._id === user._id);
      setHasNewMessage(hasSeen);
    }
  }, [normalizedChannelList, roomId]);

  const onFullScreen = () => setIsMaximized(current => !current);

  const onMessages = () => {
    if (meeting?._id) {
      dispatch(setSelectedChannel(meeting.room));
      dispatch(setMeetings([]));
      const messageSelected = selectedMessage[meeting.room._id] || {}
      if (messageSelected && messageSelected.channelId !== meeting.room._id) {
        dispatch(removeSelectedMessage(messageSelected.channelId));
      }
      onFullScreen();
      navigation.navigate('ViewChat', meeting.room);
    }
  }

  const onAddParticipants = () => {
    if (meeting?._id) {
      dispatch(setSelectedChannel(meeting.room));
      dispatch(setMeetings([]));
      const messageSelected = selectedMessage[meeting.room._id] || {}
      if (messageSelected && messageSelected.channelId !== meeting.room._id) {
        dispatch(removeSelectedMessage(messageSelected.channelId));
      }
      navigation.navigate('MeetingParticipants');
      onFullScreen();
    }
  }

  const header = () => {
    if (!isMaximized) return;

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
            {getChannelName({ otherParticipants: meeting?.otherParticipants, isGroup: meeting?.isGroup, hasRoomName: meeting.hasRoomName, name: meeting.name })}
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

  const onEndCall = (endCall = false) => {
    if (isHost || endCall) {
      endMeeting(meeting._id);
    } else {
      leaveMeeting(meeting._id, 'leave');
      dispatch(resetCurrentMeeting());
    }
  }

  const onMute = (muted:boolean, selectedParticipant:any) => {
    if (selectedParticipant) {
      muteParticipant(meetingId, {
        participantId: selectedParticipant._id,
        muted: !selectedParticipant.muted,
      });
    } else {
      muteParticipant(meetingId, { muted });
    }
  }

  const onSetPinnedParticipant = (participant:IParticipants) => {
    dispatch(setPinnedParticipant(participant));
  }

  return (
    <View style={styles.container} >
      <VideoLayout
        ref={videoRef}
        loading={loading}
        header={header}
        options={{ isMute, isVideoEnable, tracks }}
        user={user}
        participants={meeting.otherParticipants}
        meetingParticipants={meeting.participants}
        agora={agora}
        isVoiceCall={isVoiceCall}
        callEnded={meeting?.ended}
        message={meeting?.notification}
        setNotification={() => dispatch(setNotification(null))}
        onEndCall={onEndCall}
        onMute={onMute}
        isGroup={meeting?.isGroup}
        isMaximize={isMaximized}
        isHost={isHost}
        pinnedParticipant={pinnedParticipant}
        setPinnedParticipant={onSetPinnedParticipant}
      />
    </View>
  )
}

export default FloatingVideo