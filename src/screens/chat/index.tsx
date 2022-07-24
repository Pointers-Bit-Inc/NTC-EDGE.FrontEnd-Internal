import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import {
  StyleSheet ,
  View ,
  TouchableOpacity ,
  Dimensions ,
  Platform ,
  StatusBar , ActivityIndicator , FlatList , RefreshControl , Animated ,
} from 'react-native'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import { setSelectedChannel, setChannelList, addToChannelList, addChannel, removeChannel, setMeetings, removeSelectedMessage } from 'src/reducers/channel/actions';
import { SearchField } from '@components/molecules/form-fields';
import { primaryColor, outline, text, button } from '@styles/color';
import { ChatItem, ListFooter, MeetingNotif } from '@components/molecules/list-item';
import {
  getChannelName,
  getChannelImage,
  getTimeString,
} from 'src/utils/formatting';
import useSignalr from 'src/hooks/useSignalr';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import HomeMenuIcon from "@assets/svg/homemenu";
import { NewChatIcon } from '@atoms/icon';
import {Bold, Regular} from "@styles/font";
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import NewChat from '@components/pages/chat-modal/new';
import {fontValue} from "@pages/activities/fontValue";
import MeetIcon from "@assets/svg/meetIcon";
import hairlineWidth = StyleSheet.hairlineWidth;
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RFValue } from 'react-native-responsive-fontsize';
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import {
  removeActiveMeeting ,
  resetCurrentMeeting,
  setMeeting, 
  setOptions,
} from 'src/reducers/meeting/actions';
import IMeetings from 'src/interfaces/IMeetings';
import IParticipants from 'src/interfaces/IParticipants';
import Loading from '@components/atoms/loading';

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
    paddingTop: Platform.OS === 'android' ? 41.5 : 41,
    paddingBottom: Platform.OS === 'android' ? 16.5 : 17,
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
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    position: 'absolute',
    zIndex: 999,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const ChatList = ({ navigation }:any) => {
  const modalRef = useRef<BottomModalRef>(null);
  const dispatch = useDispatch();
  const swipeableRef:any = useRef({});
  const user = useSelector((state:RootStateOrAny) => state.user);
  const normalizedChannelList = useSelector((state:RootStateOrAny) => state.channel.normalizedChannelList);
  const normalizeActiveMeetings = useSelector((state: RootStateOrAny) => state.meeting.normalizeActiveMeetings);
  const meeting = useSelector((state: RootStateOrAny) => state.meeting.meeting);
  const selectedMessage = useSelector((state:RootStateOrAny) => state.channel.selectedMessage);
  const channelList = useMemo(() => {
    const channelList = lodash.keys(normalizedChannelList).map((ch:any) => {
      const channel = normalizedChannelList[ch];
      channel.otherParticipants = lodash.reject(channel.participants, (p:IParticipants) => p._id === user._id);
      if (channel.lastMessage) {
        channel.lastMessage.hasSeen = !!lodash.find(channel?.lastMessage?.seen || [], (s:IParticipants) => s._id === user._id);
      }
      return channel;
    });
    return lodash.orderBy(channelList, 'lastMessage.updatedAt', 'desc');
  }, [normalizedChannelList]);

  const meetingList = useMemo(() => {
    if (meeting?._id) {
      return [];
    }
    let meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m])
    meetingList = lodash.reject(meetingList, (m:IMeetings) => lodash.find(m.participants, (p:IParticipants) => p._id === user._id && (p.status === 'busy' || p.muted)));
    return lodash.orderBy(meetingList, 'updatedAt', 'desc');
  }, [normalizeActiveMeetings, meeting]);

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
  const [updating, setUpdating] = useState(false);
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
    const payload = searchValue ? { pageIndex, keyword: searchValue } : { pageIndex };

    getChatList(payload, (err:any, res:any) => {
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
    const payload = searchValue ? { pageIndex: 1, keyword: searchValue } : { pageIndex: 1 };

    getChatList(payload, (err:any, res:any) => {
      if (!unMount) {
        if (res) {
          dispatch(setChannelList(res.list));
          setPageIndex(current => current + 1);
          setHasMore(res.hasMore);
        }
        if (err) {
          setHasError(true);
          console.log('ERR', err);
        }
        setLoading(false);
      }
    });
  
    return () => {
      unMount = true;
    }
  }, [sendRequest, searchValue])

  const onJoin = (item:IMeetings) => {
      dispatch(setSelectedChannel(item.room));
      dispatch(resetCurrentMeeting());
      setTimeout(() => {
        dispatch(setOptions({
          isHost: item.host._id === user._id,
          isVoiceCall: item.isVoiceCall,
          isMute: false,
          isVideoEnable: true,
        }));
        dispatch(setMeeting(item));
      }, 100);
  }

const onClose = (item:IMeetings, leave = false) => {
    if (leave && item.isGroup) {
      dispatch(removeActiveMeeting(item._id));
      return leaveMeeting(item._id, 'busy');
    } else if (item.host._id === user._id || !item.isGroup) {
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
        No chat found
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
          <TouchableOpacity style={{ paddingTop: 0.5 }} onPress={() => navigation.navigate('Settings')/*openDrawer()*/}>
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
                    onClose={(leave:boolean) => onClose(item, leave)}
                    closeText={'Cancel'}
                  />
                )}
              />
            )
          }
        </View>
        <SearchField
          containerStyle={{ paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 10 }}
          inputStyle={[styles.input]}
          iconStyle={styles.icon}
          placeholder="Search"
          placeholderTextColor="#6E7191"
          outlineStyle={[styles.outline]}
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
                    const messageSelected = selectedMessage[item._id] || {}
                    if (messageSelected && messageSelected.channelId !== item._id) {
                      dispatch(removeSelectedMessage(messageSelected.channelId));
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
              setTimeout(() => navigation.navigate('ViewChat', res), 500);
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
          setUpdating(true);
          setTimeout(() => 
            leaveChannel(selectedItem._id, (err, res) => {
              setUpdating(false);
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
      {
        updating && (
          <View style={styles.loading}>
            <Loading color='#fff' size={10} />
          </View>
        )
      }
    </View>
  )
}

export default ChatList
