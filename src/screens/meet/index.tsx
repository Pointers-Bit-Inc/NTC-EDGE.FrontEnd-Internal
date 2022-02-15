import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  FlatList,
  RefreshControl,
} from 'react-native'
import lodash from 'lodash';
import { useSelector, RootStateOrAny, useDispatch } from 'react-redux'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useRequestCameraAndAudioPermission } from 'src/hooks/useAgora';
import { addMeeting, removeMeeting, updateMeeting, setMeetingId, setMeeting, setMeetings, addToMeetings } from 'src/reducers/meeting/actions';
import { setSelectedChannel } from 'src/reducers/channel/actions';
import useSignalr from 'src/hooks/useSignalr';
import ProfileImage from '@components/atoms/image/profile'
import Meeting from '@components/molecules/list-item/meeting';
import Text from '@components/atoms/text'
import { getChannelName, getDayMonthString, getOtherParticipants } from 'src/utils/formatting';
import { PeopleIcon, CalendarIcon, VideoIcon } from '@atoms/icon';
import { text, outline, primaryColor } from 'src/styles/color';
import Button from '@components/atoms/button';
import { ListFooter } from '@components/molecules/list-item';

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
    paddingTop: 35,
    paddingBottom: 15,
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
  const {
    getMeetingList,
  } = useSignalr();
  const [loading, setLoading] = useState(false);
  const [sendRequest, setSendRequest] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onJoin = (item) => {
    dispatch(setSelectedChannel(item.room));
    dispatch(setMeetingId(item._id));
    dispatch(setMeeting({}));
    navigation.navigate('Dial', {
      isHost: item.host._id === user._id,
      isVoiceCall: item.isVoiceCall,
      options: {
        isMute: false,
        isVideoEnable: true,
      }
    });
  }

  const onRequestData = () => setSendRequest(request => request + 1);

  const fetchMoreMeeting = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    const url = `/room/list?pageIndex=${pageIndex}`;
    getMeetingList(url, (err:any, res:any) => {
      if (res) {
        dispatch(addToMeetings(res.list));
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        console.log('ERR', err);
        setHasError(true);
      }
      setFetching(false);
    });
  }

  useEffect(() => {
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    let unMount = false;
    const url = `/meeting/list?pageIndex=1`;
    getMeetingList(url, (err:any, res:any) => {
      if (!unMount) {
        if (res) {
          console.log('RESULT', res.list);
          dispatch(setMeetings(res.list));
          setPageIndex(current => current + 1);
          setHasMore(res.hasMore);
        }
        if (err) {
          console.log('ERR', err);
        }
        setLoading(false);
      }
    });
  
    return () => {
      unMount = true;
    }
  }, [sendRequest])

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

  const ListFooterComponent = () => {
    return (
      <ListFooter
        hasError={hasError}
        fetching={fetching}
        loadingText="Loading more chat..."
        errorText="Unable to load chats"
        refreshText="Refresh"
        onRefresh={() => fetchMoreMeeting(true)}
      />
    );
  }

  const renderItem = ({ item }) => {
    return (
      <Meeting
        name={getChannelName(item)}
        time={item.createdAt}
        participants={lodash.take(item?.room?.otherParticipants, 5)}
        ended={item.ended}
        onJoin={() => onJoin(item)}
      />
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <ProfileImage
            size={45}
            image={user?.image}
            name={`${user.firstName} ${user.lastName}`}
          />
        </TouchableOpacity>
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
            refreshControl={
              <RefreshControl
                tintColor={primaryColor} // ios
                progressBackgroundColor={primaryColor} // android
                colors={['white']} // android
                refreshing={loading}
                onRefresh={onRequestData}
              />
            }
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            keyExtractor={(item:any) => item._id}
            ListEmptyComponent={emptyComponent}
            ListFooterComponent={ListFooterComponent}
            onEndReached={() => fetchMoreMeeting()}
            onEndReachedThreshold={0.5}
          />
        )
      }
    </View>
  )
}

export default Meet
