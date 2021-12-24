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
import { setSelectedChannel, addChannel, updateChannel, removeChannel, setMeetings } from 'src/reducers/channel/actions';
import { SearchField } from '@components/molecules/form-fields';
import { ChatItem } from '@components/molecules/list-item';
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
import { useRequestCameraAndAudioPermission } from 'src/hooks/useAgora';
import Text from '@atoms/text';
import ProfileImage from '@components/atoms/image/profile';
import InputStyles from 'src/styles/input-style';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingBottom: 5,
    backgroundColor: 'white',
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
  },
  icon: {
    paddingHorizontal: 5,
    color: text.default,
    fontSize: 18,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: primaryColor,
    paddingTop: 45,
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
    marginTop: 10,
    height: 4,
    width: 35,
    backgroundColor: outline.default,
    alignSelf: 'center',
    borderRadius: 4,
  },
  cancelText: {
    fontSize: 16,
    color: text.primary,
  },
  confirmText: {
    fontSize: 16,
    color: text.error,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
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
  const selectedChatRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const channelList = useSelector((state:RootStateOrAny) => {
    const { channelList } = state.channel;
    const sortedChannel = lodash.orderBy(channelList, 'updatedAt', 'desc');
    return sortedChannel;
  });
  const {
    channelSubscriber,
    initializeFirebaseApp,
    deleteFirebaseApp,
    deleteChannel,
    leaveChannel,
  } = useFirebase({
    _id: user._id,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    image: user.image,
  });
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [selectedItem, setSelectedItem]:any = useState({});
  const [loading, setLoading] = useState(false);
  const [sendRequest, setSendRequest] = useState(0);

  const onRequestData = () => setSendRequest(request => request + 1);

  useEffect(() => {
    if(Platform.OS === 'web') {
      initializeFirebaseApp();
      return () => {
        deleteFirebaseApp();
      };
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    let unMount = false;
    const unsubscriber = channelSubscriber(searchValue, (querySnapshot:FirebaseFirestoreTypes.QuerySnapshot) => {
      if (!unMount) {
        setLoading(false);
        querySnapshot.docChanges().forEach((change:any) => {
          const data = change.doc.data();
          data._id = change.doc.id;
          data.channelId = change.doc.id;
          switch(change.type) {
            case 'added': {
              const hasSave = lodash.find(channelList, (ch:any) => ch._id === data._id);
              data.otherParticipants = getOtherParticipants(data.participants, user);
              data.hasSeen = checkSeen(data.seen, user);
              if (!hasSave) {
                dispatch(addChannel(data));
              }
              return;
            }
            case 'modified': {
              data.otherParticipants = getOtherParticipants(data.participants, user);
              data.hasSeen = checkSeen(data.seen, user);
              dispatch(updateChannel(data));
              return;
            }
            case 'removed': {
              data.otherParticipants = getOtherParticipants(data.participants, user);
              data.hasSeen = checkSeen(data.seen, user);
              dispatch(removeChannel(data._id));
              return;
            }
            default:
              return;
          }
        });
      }
    });
    return () => {
      unMount = true;
      unsubscriber();
    }
  }, [searchValue, sendRequest])

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
            backgroundColor: button.error,
            flex: 1,
            transform: [{ translateX: trans }],
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <DeleteIcon
              style={{ marginBottom: 5 }}
              color={'white'}
              size={18}
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
              Chat
            </Text>
          </View>
          <View style={{ width: 25 }} />
          <TouchableOpacity onPress={() => navigation.navigate('NewChat')}>
            <WriteIcon
              size={22}
              color={'white'}
            />
          </TouchableOpacity>
        </View>
        <SearchField
          containerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
          inputStyle={[InputStyles.text, styles.input]}
          iconStyle={styles.icon}
          placeholder="Search"
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
                renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
              >
                <ChatItem
                  image={getChannelImage(item)}
                  imageSize={50}
                  textSize={18}
                  name={getChannelName(item)}
                  user={user}
                  participants={item.otherParticipants}
                  message={item.lastMessage}
                  isGroup={item.isGroup}
                  seen={item.hasSeen}
                  time={getTimeString(item?.updatedAt?.seconds)}
                  onPress={() => {
                    dispatch(setSelectedChannel(item));
                    dispatch(setMeetings([]));
                    navigation.navigate('ViewChat', item)
                  }}
                />
              </Swipeable>
            )}
            keyExtractor={(item:any) => item._id}
            ListEmptyComponent={emptyComponent}
          />
        )
      }
      <BottomModal
        ref={modalRef}
        header={
          <View style={styles.bar} />
        }
      >
        <View>
          <TouchableOpacity
            onPress={() => {
              deleteChannel(selectedChatRef.current);
              modalRef.current?.close();
            }}
          >
            <View style={styles.delete}>
              <DeleteIcon
                color={text.default}
                size={18}
              />
              <Text
                style={{ marginLeft: 5 }}
                color={text.default}
                size={16}
              >
                Delete
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomModal>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        contentContainerStyle={{ borderRadius: 15 }}
        titleStyle={styles.title}
        message={'Are you sure you want to delete this conversation?'}
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
        confirmText="Delete"
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={() => {
          setShowAlert(false);
          setTimeout(() => 
            leaveChannel(selectedItem._id, selectedItem.participants),
            500
          );
        }} 
      />
    </View>
  )
}

export default ChatList
