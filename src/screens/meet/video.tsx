import React, { useEffect, useState } from 'react'
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform
} from 'react-native'
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import lodash from 'lodash';
import { ArrowLeftIcon, ChatIcon, PeopleIcon } from '@components/atoms/icon'
import {
  setMeeting,
  setMeetingParticipants,
} from 'src/reducers/meeting/actions';
import Text from '@components/atoms/text'
import VideoLayout from '@components/molecules/video/layout'
import { getChannelName, getTimerString } from 'src/utils/formatting'
import useFirebase from 'src/hooks/useFirebase';
import useApi from 'src/services/api';

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
  }
})

const Dial = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const api = useApi('');
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { meetingId, meeting, meetingParticipants } = useSelector((state:RootStateOrAny) => state.meeting);
  const { options, isHost = false, isVoiceCall } = route.params;
  const { channelId, isGroup, channelName, otherParticipants } = useSelector(
    (state:RootStateOrAny) => state.channel.selectedChannel
  );
  const {
    joinMeeting,
    meetingSubscriber,
    endMeeting
  } = useFirebase({
    _id: user._id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.image,
  });
  const [loading, setLoading] = useState(true);
  const [agora, setAgora] = useState({});
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let unmounted = false;
    console.log('CHANNELID', channelId);
    api.post('/meeting/token', {
      channelName: channelId,
      isHost,
    }).then((res) => {
      if (!unmounted) {
        setLoading(false);
        dispatch(setMeetingParticipants([]));
        joinMeeting(meetingId, res.data.uid, isHost);
        setAgora(res.data);
      }
    })
    .catch(() => {
      if (!unmounted) {
        setLoading(false);
        Alert.alert('Something went wrong.');
      }
    });
    return () => {
      unmounted = true;
    }
  }, []);

  useEffect(() => {
    if (meetingId) {
      const unsubscriber = meetingSubscriber(meetingId, (querySnapshot:FirebaseFirestoreTypes.QuerySnapshot) => {
        querySnapshot.docChanges().forEach((change:any) => {
          const data = change.doc.data();
          data._id = change.doc.id;
          dispatch(setMeeting(data));
        });
      })
      return () => {
        unsubscriber();
      }
    }
  }, [meetingId])

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
          {getChannelName({ otherParticipants, isGroup, channelName })}
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

  const onEndCall = () => {
    if (isHost) {
      endMeeting(meetingId)
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
        participants={otherParticipants}
        meetingParticipants={meetingParticipants}
        agora={agora}
        isVoiceCall={isVoiceCall}
        callEnded={meeting?.ended}
        onEndCall={onEndCall}
      />
    </View>
  )
}

export default Dial
