import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
  StatusBar,
  Animated,
  RefreshControl,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import { setSelectedChannel, setChannelList, addToChannelList, addChannel, updateChannel, removeChannel, setMeetings, removeSelectedMessage, setSearchValue as setSearchValueFN } from 'src/reducers/channel/actions';
import { SearchField } from '@components/molecules/form-fields';
import { ChatItem, ListFooter, MeetingNotif } from '@components/molecules/list-item';
import { VideoIcon, WriteIcon, DeleteIcon } from '@components/atoms/icon';
import { primaryColor, outline, text, button } from '@styles/color';
import {
  getChannelName,
  getChannelImage,
  getTimeString,
  getOtherParticipants,
  checkSeen,
} from 'src/utils/formatting';
import useFirebase from 'src/hooks/useFirebase';
import useSignalr from 'src/hooks/useSignalr';
import { useRequestCameraAndAudioPermission } from 'src/hooks/useAgora';
import Text from '@atoms/text';
import ProfileImage from '@components/atoms/image/profile';
import InputStyles from 'src/styles/input-style';
import HomeMenuIcon from "@assets/svg/homemenu";
import { NewChatIcon } from '@atoms/icon';
import {Bold, Regular, Regular500} from "@styles/font";
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import rtt from 'reactotron-react-native';
import NewChat from '@pages/chat/new';
import { RFValue } from 'react-native-responsive-fontsize';
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import {
  removeActiveMeeting ,
  setMeeting ,
} from 'src/reducers/meeting/actions';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: 'white',
  },
  input: {
    fontSize: RFValue(14),
    fontFamily: Regular,
    color: 'black',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#EFF0F6',
    borderRadius: 10,
  },
  icon: {
    paddingHorizontal: 5,
    color: text.default,
    fontSize: RFValue(18),
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: primaryColor,
    paddingTop: 40,
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    width: width - 70,
    alignSelf: 'flex-end',
    backgroundColor: outline.default,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floating: {
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  button: {
    height: 65,
    width: 65,
    borderRadius: 65,
    backgroundColor: primaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  delete: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  bar: {
    height: 15,
    width: 35,
    borderRadius: 4,
  },
  cancelText: {
    fontSize: RFValue(18),
    color: '#DC2626',
  },
  confirmText: {
    fontSize: RFValue(18),
    color: text.info,
  },
  title: {
    textAlign: 'center',
    fontSize: RFValue(16),
    fontFamily: Regular,
    color: '#1F2022'
  },
  message: {
    textAlign: 'center',
    fontSize: 14,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  content: {
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  }
});

const ChatList = ({ navigation }:any) => {
  useRequestCameraAndAudioPermission();
  const modalRef = useRef<BottomModalRef>(null);
  const dispatch = useDispatch();
  const swipeableRef:any = useRef({});
  const user = useSelector((state:RootStateOrAny) => state.user);
  const channelList = useSelector((state:RootStateOrAny) => {
    const { normalizedChannelList } = state.channel
    const channelList = lodash.keys(normalizedChannelList).map(ch => {
      const channel = normalizedChannelList[ch];
      channel.otherParticipants = lodash.reject(channel.participants, p => p._id === user._id);
      channel.lastMessage.hasSeen = !!lodash.find(channel.lastMessage.seen, s => s._id === user._id);
      return channel;
    });
    return lodash.orderBy(channelList, 'lastMessage.createdAt', 'desc');
  });
  const meetingList = useSelector((state: RootStateOrAny) => {
    const { normalizeActiveMeetings } = state.meeting
    const meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m])
    return lodash.orderBy(meetingList, 'updatedAt', 'desc');
})
  const { selectedMessage } = useSelector((state:RootStateOrAny) => state.channel);
  const {
    getChatList,
    leaveChannel,
    endMeeting,
    leaveMeeting,
  } = useSignalr();
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedItem, setSelectedItem]:any = useState({});
  const [loading, setLoading] = useState(false);
  const [sendRequest, setSendRequest] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onRequestData = () => setSendRequest(request => request + 1);
  const fetchMoreChat = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    const url = searchValue ?
      `/room/search?pageIndex=${pageIndex}&search=${searchValue}` :
      `/room/list?pageIndex=${pageIndex}`;
    getChatList(url, (err:any, res:any) => {
      if (res) {
        if (res.list) dispatch(addToChannelList(res.list));
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

  const ListFooterComponent = () => {
    return (
      <ListFooter
        hasError={hasError}
        fetching={fetching}
        loadingText="Loading more chat..."
        errorText="Unable to load chats"
        refreshText="Refresh"
        onRefresh={() => fetchMoreChat(true)}
      />
    );
  }

  useEffect(() => {
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    let unMount = false;
    const url = searchValue ?
      `/room/search?pageIndex=1&search=${searchValue}` :
      `/room/list?pageIndex=1`;
    getChatList(url, (err:any, res:any) => {
      if (!unMount) {
        if (res) {
          dispatch(setChannelList(res.list));
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
  }, [sendRequest, searchValue])

  const onJoin = (item) => {
      dispatch(setSelectedChannel(item.room));
      dispatch(setMeeting(item));
      navigation.navigate('Dial', {
          isHost: item.host._id === user._id,
          isVoiceCall: item.isVoiceCall,
          options: {
              isMute: false,
              isVideoEnable: true,
          }
      });
  }

const onClose = (item, leave = false) => {
    if (leave) {
      dispatch(removeActiveMeeting(item._id));
      return leaveMeeting(item._id);
    } else if (item.host._id === user._id) {
      return endMeeting(item._id);
    } else {
      return dispatch(removeActiveMeeting(item._id));
    }
}

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
        No matches found
      </Text>
    </View>
  )

  const renderRightActions = (progress, dragX, item) => {
    const trans = dragX.interpolate({
      inputRange: [-50, 100],
      outputRange: [10, 100],
    });
    return (
      <TouchableOpacity onPress={() => {
        setSelectedItem(item);
        setShowAlert(true)
      }}>
        <Animated.View
          style={{
            paddingHorizontal: 15,
            marginLeft: 10,
            backgroundColor: '#CF0327',
            flex: 1,
            transform: [{ translateX: trans }],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <NewDeleteIcon
              color={'white'}
            />
            <Text
              color='white'
              size={12}
            >
              Delete
            </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')/*openDrawer()*/}>
            <HomeMenuIcon/>
            {/* <ProfileImage
              size={45}
              image={user?.image}
              name={`${user.firstName} ${user.lastName}`}
            /> */}
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text
              color={'white'}
              size={20}
              style={{ fontFamily: Bold, marginBottom: Platform.OS === 'ios' ? 0 : -5 }}
            >
              Chat
            </Text>
          </View>
          <View style={{ width: 25 }} />
          <TouchableOpacity onPress={() => modalRef.current?.open()}>
            <NewChatIcon
              width={RFValue(26)}
              height={RFValue(26)}
            />
          </TouchableOpacity>
        </View>
        <View>
          {
            !!lodash.size(meetingList) && (
              <FlatList
                data={meetingList}
                bounces={false}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={width}
                decelerationRate={0}
                keyExtractor={(item: any) => item._id}
                renderItem={({item}) => (
                  <MeetingNotif
                    style={{width}}
                    name={getChannelName({...item, otherParticipants: item?.participants})}
                    time={item.createdAt}
                    host={item.host}
                    onJoin={() => onJoin(item)}
                    onClose={(leave) => onClose(item, leave)}
                    closeText={'Cancel'}
                  />
                )}
              />
            )
          }
        </View>
        <SearchField
          containerStyle={{ paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 10 }}
          inputStyle={[InputStyles.text, styles.input]}
          iconStyle={styles.icon}
          placeholder="Search"
          placeholderTextColor="#6E7191"
          outlineStyle={[InputStyles.outlineStyle, styles.outline]}
          value={searchText}
          onChangeText={setSearchText}
          onChangeTextDebounce={setSearchValue}
          onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
        />
      </View>
      <View style={styles.shadow} />
      {
        loading ? (
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size={'small'} color={text.default} />
            <Text
              style={{ marginTop: 10 }}
              size={14}
              color={text.default}
            >
              Fetching chat...
            </Text>
          </View>
        ) : (
          <FlatList
            data={channelList}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={primaryColor} // ios
                progressBackgroundColor={primaryColor} // android
                colors={['white']} // android
                refreshing={loading}
                onRefresh={onRequestData}
              />
            }
            renderItem={({ item }:any) => (
              <Swipeable
                ref={ref => swipeableRef.current[item._id] = ref}
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
              >
                <ChatItem
                  image={getChannelImage(item)}
                  imageSize={50}
                  textSize={18}
                  name={getChannelName(item)}
                  user={user}
                  participants={item.otherParticipants}
                  message={item?.lastMessage}
                  isGroup={item.isGroup}
                  seen={item?.lastMessage?.hasSeen}
                  time={getTimeString(item?.lastMessage?.createdAt)}
                  onPress={() => {
                    dispatch(setSelectedChannel(item));
                    dispatch(setMeetings([]));
                    if (selectedMessage && selectedMessage.channelId !== item._id) {
                      dispatch(removeSelectedMessage());
                    }
                    navigation.navigate('ViewChat', item)
                  }}
                />
              </Swipeable>
            )}
            keyExtractor={(item:any) => item._id}
            ListEmptyComponent={emptyComponent}
            ListFooterComponent={ListFooterComponent}
            onEndReached={() => fetchMoreChat()}
            onEndReachedThreshold={0.5}
          />
        )
      }
      <BottomModal
        ref={modalRef}
        onModalHide={() => modalRef.current?.close()}
        avoidKeyboard={false}
        header={
          <View style={styles.bar} />
        }
        containerStyle={{ maxHeight: null }}
        backdropOpacity={0}
        onBackdropPress={() => {}}
      >
        <View style={{ height: height * (Platform.OS === 'ios' ? 0.94 : 0.98) }}>
          <NewChat
            onClose={() => modalRef.current?.close()}
            onSubmit={(res:any) => {
              res.otherParticipants = lodash.reject(res.participants, p => p._id === user._id);
              dispatch(setSelectedChannel(res));
              dispatch(addChannel(res));
              modalRef.current?.close();
              setTimeout(() => navigation.navigate('ViewChat', res), 300);
            }}
          />
        </View>
      </BottomModal>
      <AwesomeAlert
        overlayStyle={{ flex: 1 }}
        show={showAlert}
        showProgress={false}
        contentContainerStyle={{ borderRadius: 15, maxWidth: width * 0.7 }}
        titleStyle={styles.title}
        message={'Are you sure you want to permanently delete this conversation?'}
        messageStyle={styles.title}
        contentStyle={styles.content}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelButtonColor={'white'}
        confirmButtonColor={'white'}
        cancelButtonTextStyle={styles.cancelText}
        confirmButtonTextStyle={styles.confirmText}
        actionContainerStyle={{ justifyContent: 'space-around' }}
        cancelText="Cancel"
        confirmText="Yes"
        onCancelPressed={() => {
          swipeableRef.current[selectedItem?._id]?.close();
          setShowAlert(false);
        }}
        onConfirmPressed={() => {
          setShowAlert(false);
          setTimeout(() => 
            leaveChannel(selectedItem._id, (err, res) => {
              if (res) {
                dispatch(removeChannel(res));
              }
              if (err) {
                console.log('ERR', err);
              }
            }),
            500
          );
        }} 
      />
    </View>
  )
}

export default ChatList
