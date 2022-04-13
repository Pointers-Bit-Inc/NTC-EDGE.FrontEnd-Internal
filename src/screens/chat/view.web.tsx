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
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import { MeetingNotif } from '@components/molecules/list-item';
import useSignalR from 'src/hooks/useSignalr';
import ChatList from '@screens/chat/chat-list';
//import FileList from '@screens/chat/file-list';
import FileList from '@components/organisms/chat/files';
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckIcon,
  NewCallIcon,
  NewVideoIcon,
  NewMessageIcon,
  MediaIcon,
  AttachIcon,
  NewInfoIcon,
} from '@components/atoms/icon';
import Text from '@components/atoms/text';
import GroupImage from '@components/molecules/image/group';
import { InputField } from '@components/molecules/form-fields';
import { button, header, outline, text } from '@styles/color';
import { getChannelName, getTimeDifference } from 'src/utils/formatting';
import {
  addPendingMessage,
  removeSelectedMessage,
  resetPendingMessages,
  setSelectedChannel,
} from 'src/reducers/channel/actions';
import { removeActiveMeeting, setMeeting } from 'src/reducers/meeting/actions';
import { RFValue } from 'react-native-responsive-fontsize';
import CreateMeeting from '@components/pages/chat-modal/meeting';
import IMeetings from 'src/interfaces/IMeetings';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import useAttachmentPicker from 'src/hooks/useAttachment';
import { Regular, Regular500 } from '@styles/font';
import { AttachmentMenu } from '@components/molecules/menu';
const { width, height } = Dimensions.get('window');

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
    paddingLeft: 5,
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
    backgroundColor: 'white',
  },
  containerStyle: {
    height: undefined,
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  outline: {
    borderRadius: 10,
  },
  input: {
    fontSize: RFValue(16),
  },
  plus: {
    backgroundColor: button.info,
    borderRadius: RFValue(24),
    width: RFValue(24),
    height: RFValue(24),
    marginRight: 10,
    paddingLeft: Platform.OS === 'ios' ? 1 : 0,
    paddingTop: Platform.OS === 'ios' ? 1 : 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: button.info,
    borderRadius: 28,
    width: 28,
    height: 28,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingNotif: {},
  bar: {
    height: 15,
    width: 35,
    borderRadius: 4,
  },
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
    editMessage,
    endMeeting,
    leaveMeeting,
  } = useSignalR();
  const {
    selectedFile,
    pickDocument,
    pickImage,
  } = useAttachmentPicker();
  const modalRef = useRef<BottomModalRef>(null);
  const inputRef:any = useRef(null);
  const layout = useWindowDimensions();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { _id, name, hasRoomName, isGroup, otherParticipants, participants } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;
      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, p => p._id === user._id);
      return selectedChannel;
    }
  );
  const meetingList = useSelector((state: RootStateOrAny) => {
    const { normalizeActiveMeetings } = state.meeting
    let meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m])
    meetingList = lodash.filter(meetingList, m => m.roomId === _id);
    return lodash.orderBy(meetingList, 'updatedAt', 'desc');
})
  const selectedMessage = useSelector((state:RootStateOrAny) => {
    const { selectedMessage } = state.channel;
    return selectedMessage[_id];
  });
  const [inputText, setInputText] = useState('');
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [isVideoEnable, setIsVideoEnable] = useState(false);
  const [showAttachmentOption, setShowAttachmentOption] = useState(false);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'files', title: 'Files' },
  ]);
  const channelId = _id;

  const _sendMessage = (channelId:string, inputText:string) => {
    dispatch(addPendingMessage({
      channelId: channelId,
      message: inputText,
      messageType: 'text',
    }));
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
    if (!inputText) {
      return;
    }
    if (selectedMessage?._id) {
      _editMessage(selectedMessage?._id, inputText);
      inputRef.current?.blur();
      dispatch(removeSelectedMessage(channelId))
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
      indicatorContainerStyle={{ borderBottomColor: '#DDDDDD', borderBottomWidth: 1 }}
      labelStyle={{ color: '#94A3B8' }}
      indicatorStyle={{ backgroundColor: outline.info, height: 3 }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route, focused, color }) => (
        <Text
          color={focused ? text.info : color}
          size={14}
          style={{ fontFamily: focused ? Regular500 : Regular, width: width / 2, textAlign: 'center' }}
        >
          {route.title}
        </Text>
      )}
    />
  );

  const onJoin = (item:IMeetings) => {
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

  const onClose = (item:IMeetings, leave = false) => {
    if (leave) {
      dispatch(removeActiveMeeting(item._id));
      return leaveMeeting(item._id);
    } else if (item.host._id === user._id) {
      return endMeeting(item._id);
    } else {
      return dispatch(removeActiveMeeting(item._id));
    }
  }

  const onShowAttachmentOption = () => {
    inputRef.current?.blur();
    setShowAttachmentOption(true);
  }

  const onHideAttachmentOption = () => {
    setShowAttachmentOption(false);
  }

  const renderChannelName = () => {
    return getChannelName({
      otherParticipants,
      hasRoomName,
      name,
      isGroup
    });
  }

  useEffect(() => {
    console.log("sending files")
    if (lodash.size(selectedFile)) {
      dispatch(addPendingMessage({
        attachment: selectedFile,
        channelId,
        messageType: 'file'
      }))
    }
  }, [selectedFile]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    })
    return () => {
      dispatch(setSelectedChannel({}));
      dispatch(resetPendingMessages());
    }
  }, []);

  useEffect(() => {
    if (rendered) {
      setInputText(selectedMessage?.message || '');
      if (selectedMessage?._id) {
        setTimeout(() => inputRef.current?.focus(), 500);
      } else {
        inputRef.current?.blur();
      }
    }
  }, [selectedMessage, rendered, _id]);

  const onInitiateCall = (isVideoEnable = false) => {
    setIsVideoEnable(isVideoEnable);
    modalRef.current?.open();
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <View style={[styles.header, styles.horizontal]}>
        <TouchableOpacity onPress={onBack}>
          <View style={{ paddingRight: 5 }}>
            <ArrowLeftIcon
              type='chevron-left'
              color={'#111827'}
              size={RFValue(26)}
            />
          </View>
        </TouchableOpacity>
        <View>
          <GroupImage
            participants={otherParticipants}
            size={route?.params?.isGroup ? 45 : 30}
            textSize={route?.params?.isGroup ? 24 : 16}
            inline={true}
          />
        </View>
        <View style={styles.info}>
          <TouchableOpacity onPress={() => navigation.navigate('ChatInfo')}>
            <Text
              color={'black'}
              size={16}
              numberOfLines={1}
            >
              {renderChannelName()}
            </Text>
          </TouchableOpacity>
          {
            !route?.params?.isGroup && !!otherParticipants[0]?.lastOnline && (
              <Text
                color={'#606A80'}
                size={10}
                numberOfLines={1}
                style={{ marginTop: -5 }}
              >
                {otherParticipants[0]?.isOnline ? 'Active now' : getTimeDifference(otherParticipants[0]?.lastOnline)}
              </Text>
            )
          }
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('ChatInfo')}>
          <View style={{ paddingRight: 5, marginTop: 6 }}>
            <NewInfoIcon
              color={button.info}
              height={RFValue(18)}
              width={RFValue(18)}
            />
          </View>
        </TouchableOpacity>
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
                    style={{...Platform.select({
                        native: {
                          width: width
                        },
                        default: {
                          width: "100%"
                        }})}}
                  name={getChannelName({...item, otherParticipants: item?.participants})}
                  host={item.host}
                  time={item.createdAt}
                  onJoin={() => onJoin(item)}
                  onClose={() => onClose(item)}
                  closeText={'Cancel'}
                />
              )}
            />
          )
        }
      </View>
      <View style={{ flex: 1 }}>
        <TabView
          lazy
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
      {
        index === 0 ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
          >
            <View style={styles.keyboardAvoiding}>
              <View style={{ marginTop: RFValue(-18) }}>
                <TouchableOpacity onPress={showAttachmentOption ? onHideAttachmentOption : onShowAttachmentOption}>
                  <View style={[styles.plus, showAttachmentOption && { transform: [{ rotateZ: '0.785398rad' }] }]}>
                    <PlusIcon
                      color="white"
                      size={RFValue(12)}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, paddingHorizontal: 5 }}>
                <InputField
                  ref={inputRef}
                  placeholder={'Type a message'}
                  containerStyle={[styles.containerStyle, { borderColor: isFocused ? '#C1CADC' : 'white' }]}
                  placeholderTextColor={'#C4C4C4'}
                  inputStyle={[styles.input, { backgroundColor: 'white' }]}
                  outlineStyle={[styles.outline, { backgroundColor: 'white' }]}
                  value={inputText}
                  onChangeText={setInputText}
                  onSubmitEditing={() => inputText && onSendMessage()}
                  returnKeyType={'send'}
                  onFocus={() => { onHideAttachmentOption(); setIsFocused(true) }}
                  onBlur={() => setIsFocused(false)}
                  
                />
              </View>
              <View style={{ marginTop: RFValue(-18), flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={onSendMessage}
                >
                  {
                    selectedMessage?._id ? (
                      <View style={[styles.plus, { marginRight: 0, marginLeft: 10, backgroundColor: button.info }]}>
                        <CheckIcon
                          type='check1'
                          size={14}
                          color={'white'}
                        />
                      </View>
                    ) : (
                      <View style={{ marginLeft: 10 }}>
                        <NewMessageIcon
                          color={inputText ? button.info : '#D1D1D6'}
                          height={RFValue(30)}
                          width={RFValue(30)}
                        />
                      </View>
                    )
                  }
                </TouchableOpacity>
              </View>
            </View>
            {
              showAttachmentOption && <AttachmentMenu onPress={pickImage} onPickDocument={pickDocument} />
            }
          </KeyboardAvoidingView>
        ) : null
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
        <View style={{ paddingBottom: 20, height: height * (Platform.OS === 'ios' ? 0.94 : 0.98) }}>
          <CreateMeeting
            barStyle={'dark-content'}
            participants={participants}
            isVideoEnable={isVideoEnable}
            isVoiceCall={!isVideoEnable}
            isChannelExist={true}
            channelId={channelId}
            onClose={() => modalRef.current?.close()}
            onSubmit={(type, params) => {
              modalRef.current?.close();
              setTimeout(() => navigation.navigate(type, params), 300);
            }}
          />
        </View>
      </BottomModal>
    </View>
  )
}

export default ChatView
