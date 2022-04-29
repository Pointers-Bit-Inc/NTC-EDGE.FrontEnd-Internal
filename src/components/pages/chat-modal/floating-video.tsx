import { View, Dimensions, Pressable, Platform, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'

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
import { ArrowDownIcon, MessageIcon, ParticipantsIcon } from '@components/atoms/icon'
import {
  setMeeting,
  setNotification,
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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const dimensions = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};

const VideoWidth = dimensions.width * 0.4;
const VideoHeight = dimensions.width * 0.26;
const defaultPositionY = dimensions.height * 0.82 - VideoHeight;
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
  }
});

const FloatingVideo = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { selectedMessage } = useSelector((state:RootStateOrAny) => state.channel);
  const meeting = useSelector((state:RootStateOrAny) => {
    const { meeting } = state.meeting;
    meeting.otherParticipants = lodash.reject(meeting.participants, p => p._id === user._id);
      return meeting;
  });
  const {
    options = {
      isMute: false,
      isVideoEnable: true,
    },
    isHost = false,
    isVoiceCall = false
  } = props;
  const { endMeeting, joinMeeting, leaveMeeting } = useSignalr();
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState({});
  const [timer, setTimer] = useState(0);

  const snapPointsX = useSharedValue(defaultSnapX);
  const snapPointsY = useSharedValue(defaultSnapY);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const currentX = useSharedValue(0);
  const currentY = useSharedValue(0);
  const scale = useSharedValue(1);
  const [isFullscreen, setIsFullscreen] = useState(true);

  useEffect(() => {
    if (isFullscreen) {
      translateX.value = 0;
      translateY.value = 0;
    } else {
      translateX.value = currentX.value;
      translateY.value = currentY.value;
    }
  }, [isFullscreen]);

  useEffect(() => {
    let unmounted = false;

    requestCameraAndAudioPermission((err, result) => {
      if (err) {
        Alert.alert(
          "Unable to access camera",
          "Please allow camera access from device settings.",
        );
        dispatch(setMeeting(null));
      } else {
        joinMeeting(meeting._id, (err:any, result:any) => {
          if (!unmounted) {
            if (result) {
              setLoading(false);
              if (result) {
                dispatch(updateMeetingParticipants(result.meeting));
                setAgora(result?.agora);
              }
            } else {
              setLoading(false);
              Alert.alert('Something went wrong.');
            }
          }
        });
      }
    });
  
    return () => {
      unmounted = true;
    }
  }, []);

  useEffect(() => {
    let interval:any = null;
    if (!meeting.ended) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else {
      setIsFullscreen(true);
    }
    return () => clearInterval(interval);
  }, [meeting.ended]);

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
    if (isFullscreen) return;
    if (scale.value !== 1.1) {
      scale.value = withSpring(1.1);
    }
  };

  const onTouchEnd = () => {
    if (isFullscreen) return;
    if (scale.value !== 1) {
      scale.value = withSpring(1);
    }
  };

  const onFullScreen = () => setIsFullscreen(current => !current);

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

  const header = () => (
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
      <TouchableOpacity>
        <View style={styles.icon}>
          <ParticipantsIcon />
        </View>
      </TouchableOpacity>
    </View>
  )

  const onEndCall = (endCall = false) => {
    if (isHost || endCall) {
      endMeeting(meeting._id);
    } else {
      leaveMeeting(meeting._id, 'leave');
      dispatch(setMeeting(null));
    }
  }

  return (
    <PanGestureHandler enabled={!isFullscreen} onGestureEvent={onGestureEvent}>
      <AnimatedPressable
        style={[styles.container, !isFullscreen && styles.position, style]}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>
        <View
          style={[
            styles.remote,
            isFullscreen ? styles.maximize : styles.minimize
          ]}
        >
          {
            !isFullscreen && (
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
            loading={loading}
            header={isFullscreen ? header() : null}
            options={options}
            user={user}
            participants={meeting.otherParticipants}
            meetingParticipants={meeting.participants}
            agora={agora}
            isVoiceCall={isVoiceCall}
            callEnded={meeting?.ended}
            message={meeting?.notification}
            setNotification={() => setNotification('')}
            onEndCall={onEndCall}
            isGroup={meeting?.isGroup}
            isMaximize={isFullscreen}
          />
        </View>
      </AnimatedPressable>
    </PanGestureHandler>
  )
}

export default FloatingVideo