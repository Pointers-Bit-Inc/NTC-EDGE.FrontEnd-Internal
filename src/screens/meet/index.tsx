import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native'
import lodash from 'lodash';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useRequestCameraAndAudioPermission } from 'src/hooks/useAgora';
import { addMeeting, removeMeeting, updateMeeting, setMeetingId } from 'src/reducers/meeting/actions';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import useFirebase from 'src/hooks/useFirebase';
import ProfileImage from '@components/atoms/image/profile'
import Meeting from '@components/molecules/list-item/meeting';
import Text from '@components/atoms/text'
import { getChannelName, getDayMonthString } from 'src/utils/formatting';
import { PeopleIcon, CalendarIcon, VideoIcon } from '@atoms/icon';
import { text, outline, primaryColor } from 'src/styles/color';
import Button from '@components/atoms/button';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 20,
    backgroundColor: primaryColor
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  scrollview: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 60,
  },
  image: {
    height: width * 0.5,
    width: width * 0.65,
    backgroundColor: '#DCE2E5',
    borderRadius: 10,
    marginVertical: 15,
  },
  text: {
    marginVertical: 5,
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    borderRadius: 10,
    paddingVertical: 15,
    borderColor: outline.default,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 10,
  },
  section: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
})

const Meet = ({ navigation }) => {
  const dispatch = useDispatch();
  useRequestCameraAndAudioPermission();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const meetingList = useSelector((state:RootStateOrAny) => {
    const { list } = state.meeting;
    const sortedMeeting = lodash.orderBy(list, 'updatedAt', 'desc');
    return sortedMeeting;
  });
  const { userMeetingSubscriber } = useFirebase({
    _id: user._id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.image,
  });
  const [loading, setLoading] = useState(false);

  const onJoin = (item) => {
    dispatch(setSelectedChannel(item.channel));
    dispatch(setMeetingId(item._id));
    navigation.navigate('Dial', {
      isHost: item.host._id === user._id,
      options: {
        isMute: false,
        isVideoEnable: true,
      }
    });
  }

  useEffect(() => {
    setLoading(true);
    const unsubscriber = userMeetingSubscriber((querySnapshot:FirebaseFirestoreTypes.QuerySnapshot) => {
      setLoading(false);
      querySnapshot.docChanges().forEach((change:any) => {
        const data = change.doc.data();
        data._id = change.doc.id;
        switch(change.type) {
          case 'added': {
            const hasSave = lodash.find(meetingList, (ch:any) => ch._id === data._id);
            if (!hasSave) {
              dispatch(addMeeting(data));
            }
            return;
          }
          case 'modified': {
            dispatch(updateMeeting(data));
            return;
          }
          case 'removed': {
            dispatch(removeMeeting(data._id));
            return;
          }
          default:
            return;
        }
      });
    })
    return () => {
      unsubscriber();
    }
  }, []);

  const emptyComponent = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
      }}>
      <Text
        color={text.default}
        size={14}
      >
        No meetings yet
      </Text>
    </View>
  )

  const renderItem = ({ item }) => {
    return (
      <Meeting
        name={getChannelName(item)}
        time={item.createdAt}
        participants={lodash.take(item?.channel?.otherParticipants, 5)}
        ended={item.ended}
        onJoin={() => onJoin(item)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <ProfileImage
          size={45}
          image={user.image}
          name={`${user.firstName} ${user.lastName}`}
        />
        <View style={styles.titleContainer}>
          <Text
            color={'white'}
            weight={'600'}
            size={22}
          >
            Meet
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Participants')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <VideoIcon
              style={styles.icon}
              color={'white'}
              type='add'
              size={24}
            />
            <Text
              color={'white'}
              weight='bold'
              size={16}
            >
              Create
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      {
        loading ? (
          <View style={{ alignItems: 'center', marginTop: 15 }}>
            <ActivityIndicator size={'small'} color={text.default} />
            <Text
              style={{ marginTop: 10 }}
              size={14}
              color={text.default}
            >
              Fetching meetings...
            </Text>
          </View>
        ) : (
          <FlatList
            data={meetingList}
            renderItem={renderItem}
            keyExtractor={(item:any) => item._id}
            ListEmptyComponent={emptyComponent}
          />
        )
      }
    </View>
  )
}

export default Meet
