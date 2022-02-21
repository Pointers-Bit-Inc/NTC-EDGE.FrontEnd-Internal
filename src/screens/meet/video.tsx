import React, { useEffect, useState } from 'react'
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  Animated
} from 'react-native'
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import lodash from 'lodash';
import { ArrowLeftIcon, ChatIcon, PeopleIcon } from '@components/atoms/icon'
import {
  setMeeting,
  setMeetingParticipants,
  setNotification,
} from 'src/reducers/meeting/actions';
import Text from '@components/atoms/text'
import VideoLayout from '@components/molecules/video/layout'
import { getChannelName, getTimerString } from 'src/utils/formatting'
import useSignalr from 'src/hooks/useSignalr';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#606A80',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
    top: 45,
    zIndex: 1,
    marginHorizontal: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
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
})

const Dial = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const meeting = useSelector((state:RootStateOrAny) => {
    const { meeting } = state.meeting;
    meeting.otherParticipants = lodash.reject(meeting.participants, p => p._id === user._id);
      return meeting;
  });
  const { options, isHost = false, isVoiceCall } = route.params;
  const { endMeeting, joinMeeting } = useSignalr();
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState({});
  const [timer, setTimer] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1))

  useEffect(() => {
    let unmounted = false;
    
    joinMeeting(meeting._id, (err, result) => {
      console.log('ERR RESULT', err, result);
      if (!unmounted) {
        if (result) {
          setLoading(false);
          setAgora(result);
        } else {
          setLoading(false);
          Alert.alert('Something went wrong.');
        }
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
    }
    return () => clearInterval(interval);
  }, [meeting.ended]);

  useEffect(() => {
    let timeRef:any = null
    if (meeting.ended) {
      timeRef = setTimeout(() => navigation.goBack(), 500);
    }
    return () => clearTimeout(timeRef);
  }, [meeting.ended]);

  useEffect(() => {
    if (meeting.notification) {
      Animated.timing(
        fadeAnim,
        {
          toValue: 0,
          duration: 5000,
          useNativeDriver: true,
        }
      ).start(() => setNotification(''));
    }
  }, [meeting.notification]);

  const header = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <ArrowLeftIcon
          color='white'
        />
      </TouchableOpacity>
      <View style={styles.channelName}>
        <Text
          color={'white'}
          size={16}
          numberOfLines={1}
        >
          {getChannelName({ otherParticipants: meeting?.otherParticipants, isGroup: meeting?.isGroup, hasRoomName: meeting.hasRoomName, name: meeting.name })}
        </Text>
        <Text
          color='white'
        >
          {getTimerString(timer)}
        </Text>
      </View>
      {/* <TouchableOpacity>
        <View style={styles.icon}>
          <ChatIcon
            size={24}
            color='white'
          />
        </View>
      </TouchableOpacity>
      <TouchableOpacity>
        <View style={styles.icon}>
          <PeopleIcon
            size={32}
            color='white'
          />
        </View>
      </TouchableOpacity> */}
    </View>
  )

  const onEndCall = (endCall) => {
    if (isHost || endCall) {
      endMeeting(meeting._id, (err, res) => {
        if (res) {
          navigation.goBack();
        }
      })
    } else {
      navigation.goBack();
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <VideoLayout
        loading={loading}
        header={header()}
        options={options}
        user={user}
        participants={meeting.otherParticipants}
        meetingParticipants={meeting.participants}
        agora={agora}
        isVoiceCall={isVoiceCall}
        callEnded={meeting?.ended}
        onEndCall={onEndCall}
      />
      {
        !!meeting?.notification && (
          <Animated.View style={[styles.notif, { opacity: fadeAnim }]}>
            <Text
              color='white'
              size={12}
            >
              {meeting?.notification}
            </Text>
          </Animated.View>
        )
      }
    </View>
  )
}

export default Dial
