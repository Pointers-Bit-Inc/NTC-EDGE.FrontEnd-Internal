import React, { useRef, useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StatusBar,
  Dimensions,
  FlatList,
  InteractionManager,
} from 'react-native'
import lodash from 'lodash';
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import { setMeetingId } from 'src/reducers/meeting/actions';
import { MeetingNotif } from '@components/molecules/list-item';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import useFirebase from 'src/hooks/useFirebase';
import useSignalR from 'src/hooks/useSignalr';
import ChatList from '@screens/chat/chat-list';
import FileList from '@components/organisms/chat/files';
import {
  ArrowLeftIcon,
  PhoneIcon,
  VideoIcon,
  MenuIcon,
  PlusIcon,
  CheckIcon,
  CameraIcon,
  MicIcon,
  SendIcon,
  NewCallIcon,
  NewVideoIcon,
  NewMessageIcon,
} from '@components/atoms/icon';
import Text from '@components/atoms/text';
import GroupImage from '@components/molecules/image/group';
import { InputField } from '@components/molecules/form-fields';
import { outline, text, button, primaryColor, header } from '@styles/color';
import { getChannelName } from 'src/utils/formatting';
import InputStyles from 'src/styles/input-style';
import {
  removeSelectedMessage,
  setSelectedChannel,
} from 'src/reducers/channel/actions';
import { removeActiveMeeting, setMeeting } from 'src/reducers/meeting/actions';
import { RFValue } from 'react-native-responsive-fontsize';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    paddingTop: 40,
    paddingBottom: 5,
    backgroundColor: header.secondary,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  bubbleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  keyboardAvoiding: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
  },
  outline: {
    borderRadius: 10,
  },
  input: {
    fontSize: RFValue(16),
  },
  plus: {
    backgroundColor: button.default,
    borderRadius: RFValue(24),
    width: RFValue(24),
    height: RFValue(24),
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: button.primary,
    borderRadius: 28,
    width: 28,
    height: 28,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingNotif: {
    width,
    position: 'absolute',
    top: 95,
    zIndex: 9,
  }
});

const ChatRoute = () => (<ChatList />);
const FileRoute = () => (<FileList />);
const renderScene = SceneMap({
  chat: ChatRoute,
  files: FileRoute,
});

const ChatView = ({ navigation, route }:any) => {
  const dispatch = useDispatch();
  const {
    sendMessage,
    editMessage,
    endMeeting,
  } = useSignalR();
  const inputRef:any = useRef(null);
  const layout = useWindowDimensions();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { _id, otherParticipants, participants } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;
      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, p => p._id === user._id);
      return selectedChannel;
    }
  );
  const meetingList = useSelector((state: RootStateOrAny) => {
    const { normalizeActiveMeetings } = state.meeting
    const meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m])
    return lodash.orderBy(meetingList, 'updatedAt', 'desc');
})
  const { selectedMessage } = useSelector((state:RootStateOrAny) => state.channel);
  const [inputText, setInputText] = useState('');
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'files', title: 'Files' },
  ]);
  const channelId = _id;

  const _sendMessage = (channelId:string, inputText:string) => {
    sendMessage({
      roomId: channelId,
      message: inputText,
    }, (err:any, result:any) => {
      if (err) {
        console.log('ERR', err);
      }
    })
  }

  const _editMessage = (messageId:string, message:string) => {
    editMessage({
      messageId,
      message,
    }, (err:any, result:any) => {
      if (err) {
        console.log('ERR', err);
      }
    })
  }

  const onSendMessage = useCallback(() => {
    if (selectedMessage._id) {
      _editMessage(selectedMessage._id, inputText);
      inputRef.current?.blur();
      dispatch(removeSelectedMessage())
    } else {
      _sendMessage(channelId, inputText);
      inputRef.current?.blur();
      setInputText('');
    }
  }, [channelId, inputText])

  const onBack = () => navigation.goBack();

  const renderTabBar = (props:any) => (
    <TabBar
      {...props}
      labelStyle={{ color: text.default }}
      indicatorStyle={{ backgroundColor: outline.primary }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route, focused, color }) => (
        <Text
          color={focused ? text.primary : color}
          size={16}
          weight={focused ? '600' : 'normal'}
        >
          {route.title}
        </Text>
      )}
    />
  );

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

  const onClose = (item) => {
    if (item.host._id === user._id) {
      endMeeting(item._id);
    } else {
      dispatch(removeActiveMeeting(item._id));
    }
  }

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    })
  }, []);

  useEffect(() => {
    if (rendered) {
      setInputText(selectedMessage?.message || '');
      if (selectedMessage._id) {
        setTimeout(() => inputRef.current?.focus(), 500);
      } else {
        inputRef.current?.blur();
      }
    }
  }, [selectedMessage, rendered]);

  const onInitiateCall = (isVideoEnable = false) =>
    navigation.navigate(
      'InitiateVideoCall',
      {
        participants,
        isVideoEnable,
        isVoiceCall: !isVideoEnable,
        isChannelExist: true,
        channelId,
      }
    );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.header, styles.horizontal]}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeftIcon
            type='arrow-left'
            color={'#111827'}
            size={RFValue(14)}
          />
        </TouchableOpacity>
        <View style={{ paddingLeft: 5 }}>
          <GroupImage
            participants={otherParticipants}
            size={40}
            textSize={16}
            inline={true}
          />
        </View>
        <View style={styles.info}>
          <Text
            color={'black'}
            size={16}
            numberOfLines={1}
          >
            {getChannelName(route.params)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onInitiateCall(false)}>
          <View style={{ paddingRight: 5 }}>
            <NewCallIcon
              color={button.info}
              height={RFValue(24)}
              width={RFValue(24)}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onInitiateCall(true)}>
          <View style={{ paddingLeft: 5, paddingTop: 5 }}>
            <NewVideoIcon
              color={button.info}
              height={RFValue(28)}
              width={RFValue(28)}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.floatingNotif}>
        {
          !!lodash.size(meetingList) && (
            <FlatList
              data={meetingList}
              bounces={false}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={width}
              decelerationRate={0}
              keyExtractor={(item:any) => item._id}
              renderItem={({ item }) => (
                <MeetingNotif
                  style={{ width }}
                  name={getChannelName(item)}
                  time={item.createdAt}
                  onJoin={() => onJoin(item)}
                  onClose={() => onClose(item)}
                  closeText={
                    item.host._id === user._id ? 'End' : 'Close'
                  }
                />
              )}
            />
          )
        }
      </View>
      <View style={{ flex: 1 }}>
        {/* <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        /> */}
        <ChatList />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.keyboardAvoiding}>
          <View style={{ marginTop: RFValue(-18) }}>
            <TouchableOpacity  disabled={true}>
              <View style={styles.plus}>
                <PlusIcon
                  color="white"
                  size={RFValue(12)}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <InputField
              ref={inputRef}
              placeholder={'Type a message'}
              containerStyle={{ height: null, paddingVertical: 10, borderWidth: 1, borderColor: '#C1CADC', backgroundColor: 'white' }}
              placeholderTextColor={'#C4C4C4'}
              inputStyle={[InputStyles.text, styles.input, { backgroundColor: 'white' }]}
              outlineStyle={[InputStyles.outlineStyle, styles.outline, { backgroundColor: 'white' }]}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => inputText && onSendMessage()}
              returnKeyType={'send'}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          <View style={{ marginTop: RFValue(-18), flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={onSendMessage}
            >
              <View style={{ marginLeft: 10 }}>
                <NewMessageIcon
                  color={inputText ? button.info : button.default}
                  height={RFValue(30)}
                  width={RFValue(30)}
                />
              </View>
            </TouchableOpacity>
            {/* {
              !!selectedMessage._id ? (
                <TouchableOpacity
                  onPress={() => {
                    _editMessage(selectedMessage._id, inputText);
                    dispatch(removeSelectedMessage())
                  }}
                >
                  <View style={styles.circle}>
                    <CheckIcon
                      type='check1'
                      color="white"
                      size={RFValue(16)}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                isFocused ? (
                  <TouchableOpacity
                    onPress={onSendMessage}
                  >
                    <View style={{ marginLeft: 10 }}>
                      <NewMessageIcon
                        color={inputText ? button.info : button.default}
                        height={RFValue(30)}
                        width={RFValue(30)}
                      />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity disabled={true}>
                      <View style={{ paddingLeft: 10 }}>
                        <CameraIcon
                          size={RFValue(22)}
                          color={button.default}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity disabled={true}>
                      <View style={{ paddingLeft: 15 }}>
                        <MicIcon
                          size={RFValue(20)}
                          color={button.default}
                        />
                      </View>
                    </TouchableOpacity>
                  </>
                )
              )
            } */}
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ChatView
