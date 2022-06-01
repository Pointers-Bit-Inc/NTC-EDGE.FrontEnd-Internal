import { View, Dimensions, Pressable, Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { snapPoint } from 'react-native-redash';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import lodash from 'lodash';
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import { ArrowDownIcon, MessageIcon, ParticipantsIcon } from '@components/atoms/icon'
import {
  resetCurrentMeeting,
  setFullScreen,
  setMeeting,
  setNotification,
  setOptions,
  setPinnedParticipant,
  setToggle,
  updateMeetingParticipants,
} from 'src/reducers/meeting/actions';
import { setSelectedChannel, setMeetings, removeSelectedMessage } from 'src/reducers/channel/actions';
import Text from '@components/atoms/text'
import VideoLayout from '@components/molecules/video/layout'
import { getChannelName, getTimerString } from 'src/utils/formatting'
import useSignalr from 'src/hooks/useSignalr';
import { requestCameraAndAudioPermission } from 'src/hooks/usePermission';
import { Feather } from '@expo/vector-icons';
import { Bold } from '@styles/font';
import { useNavigation } from '@react-navigation/native';
import IParticipants from 'src/interfaces/IParticipants';
import { RFValue } from 'react-native-responsive-fontsize';
import useTimer from 'src/hooks/useTimer';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height + (Platform.OS === 'ios' ? 0 : 30),
};

const VideoWidth = dimensions.width * 0.5;
const VideoHeight = dimensions.width * 0.32;
const defaultPositionY = dimensions.height * 0.83 - VideoHeight;
const defaultPositionX = -(dimensions.width - VideoWidth - 25);
const defaultSnapX = [0, defaultPositionX];
const defaultSnapY = [0, defaultPositionY];

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99,
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
  const { meeting, options, meetingId, isFullScreen, pinnedParticipant, toggleMute, roomId } = useSelector((state:RootStateOrAny) => {
    const { meeting, options = {}, isFullScreen, pinnedParticipant, toggleMute } = state.meeting;
    meeting.otherParticipants = lodash.reject(meeting.participants, p => p._id === user._id);
    return {
      meeting,
      options,
      meetingId: meeting?._id,
      isFullScreen,
      pinnedParticipant,
      toggleMute,
      roomId: meeting?.roomId,
    };
  });
  const {
    isMute = false,
    isVideoEnable = true,
    isHost = false,
    isVoiceCall = false
  } = options;
  const {
    endMeeting,
    joinMeeting,
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
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const snapPointsX = useSharedValue(defaultSnapX);
  const snapPointsY = useSharedValue(defaultSnapY);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const currentX = useSharedValue(0);
  const currentY = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isMaximized) {
      translateX.value = 0;
      translateY.value = 0;
    } else {
      translateX.value = currentX.value;
      translateY.value = currentY.value;
    }
  }, [isMaximized])

  useEffect(() => {
    setIsMaximized(isFullScreen);
  }, [isFullScreen]);

  useEffect(() => {
    let unmounted = false;

    if (meetingId) {
      activateKeepAwake();
      requestCameraAndAudioPermission((err, result) => {
        if (err) {
          Alert.alert(
            "Unable to access camera",
            "Please allow camera access from device settings.",
          );
          dispatch(resetCurrentMeeting());
        } else {
          joinMeeting({ meetingId: meeting._id, muted: isMute }, (err:any, result:any) => {
            if (!unmounted) {
              if (result) {
                setLoading(false);
                if (result) {
                  dispatch(updateMeetingParticipants(result.meeting));
                  setAgora(result?.agora);
                  setStarted(true);
                }
              } else {
                setLoading(false);
                Alert.alert('Something went wrong.');
              }
            }
          });
        }
      });
    }
  
    return () => {
      unmounted = true;
      deactivateKeepAwake(); 
      dispatch(setOptions({
        isHost: false,
        isVoiceCall: false,
        isMute: false,
        isVideoEnable: true,
      }));
    }
  }, [meetingId]);

  useEffect(() => {
    let interval:any = null;
    if (!meeting.ended) {
      setStarted(false);
    } else {
      setIsMaximized(true);
      dispatch(setToggle(null));
    }
    return () => clearInterval(interval);
  }, [meeting.ended]);

  useEffect(() => {
    if (toggleMute) {
      dispatch(setToggle(null));
    }
  }, [toggleMute]);

  useEffect(() => {
    if (normalizedChannelList && normalizedChannelList[roomId]) {
      const { lastMessage = {} } = normalizedChannelList[roomId];
      const { seen = [] } = lastMessage;
      const hasSeen = !!lodash.find(seen, s => s._id === user._id);
      setHasNewMessage(hasSeen);
    }
  }, [normalizedChannelList, roomId]);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, context:any) => {
      context.translateX = translateX.value;
      context.translateY = translateY.value;
      if (scale.value !== 1.1) {
        scale.value = withSpring(1.1);
      }
    },
    onActive: ({ translationX, translationY }, context) => {
      translateX.value = translationX + context.translateX;
      translateY.value = translationY + context.translateY;
    },
    onEnd: ({ translationY, translationX, velocityX, velocityY }) => {
      const snapPointX = snapPoint(translationX, velocityX, snapPointsX.value);
      const snapPointY = snapPoint(translationY, velocityY, snapPointsY.value);
      translateX.value = withSpring(snapPointX);
      translateY.value = withSpring(snapPointY);
      currentX.value = withSpring(snapPointX);
      currentY.value = withSpring(snapPointY);
      if (scale.value !== 1) {
        scale.value = withSpring(1);
      }
    },
  });

  const style = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const onTouchStart = () => {
    if (isMaximized) return;
    if (scale.value !== 1.1) {
      scale.value = withSpring(1.1);
    }
  };

  const onTouchEnd = () => {
    if (isMaximized) return;
    if (scale.value !== 1) {
      scale.value = withSpring(1);
    }
  };

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

  const onMute = (muted:boolean) => {
    muteParticipant(meetingId, { muted });
  }

  const onSetPinnedParticipant = (participant:IParticipants) => {
    dispatch(setPinnedParticipant(participant));
  }

  return (
    <PanGestureHandler enabled={!isMaximized} onGestureEvent={onGestureEvent}>
      <AnimatedPressable
        style={[styles.container, styles.shadow, !isMaximized && styles.position, style]}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        <View
          style={[
            styles.remote,
            isMaximized ? styles.maximize : styles.minimize,
            !isMaximized && styles.border,
          ]}
        >
          {
            !isMaximized && (
              <View style={{ position: 'absolute', top: 5, right: 5, zIndex: 999 }}>
                <TouchableOpacity onPress={onFullScreen}>
                <Feather
                  name="maximize-2"
                  size={12}
                  color={'white'}
                />
                </TouchableOpacity>
              </View>
            )
          }
          <VideoLayout
            ref={videoRef}
            loading={loading}
            header={header}
            options={{ isMute, isVideoEnable }}
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
            pinnedParticipant={pinnedParticipant}
            setPinnedParticipant={onSetPinnedParticipant}
          />
        </View>
      </AnimatedPressable>
    </PanGestureHandler>
  )
}

export default FloatingVideo