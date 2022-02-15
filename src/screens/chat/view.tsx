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
} from '@components/atoms/icon';
import Text from '@components/atoms/text';
import GroupImage from '@components/molecules/image/group';
import { InputField } from '@components/molecules/form-fields';
import { outline, text, button, primaryColor } from '@styles/color';
import { getChannelName } from 'src/utils/formatting';
import InputStyles from 'src/styles/input-style';
import {
  removeSelectedMessage,
  addMeeting,
  removeMeeting,
  updateMeeting,
} from 'src/reducers/channel/actions';
const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    paddingTop: 35,
    backgroundColor: primaryColor
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  outline: {
    borderRadius: 10,
  },
  input: {
    fontSize: 16,
  },
  plus: {
    backgroundColor: button.primary,
    borderRadius: 26,
    width: 26,
    height: 26,
    marginRight: 15,
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
  } = useSignalR();
  const inputRef:any = useRef(null);
  const layout = useWindowDimensions();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { _id, otherParticipants, participants } = useSelector(
    (state:RootStateOrAny) => state.channel.selectedChannel
  );
  const { selectedMessage, meetingList } = useSelector((state:RootStateOrAny) => state.channel);
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
    dispatch(setMeetingId(item._id));
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
      // endMeeting(item._id);
    } else {
      dispatch(removeMeeting(item._id));
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
      <StatusBar barStyle={'light-content'} />
      <View style={[styles.header, styles.horizontal]}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeftIcon
            type='arrow-left'
            color={'white'}
            size={18}
          />
        </TouchableOpacity>
        <View style={{ paddingLeft: 15 }}>
          <GroupImage
            participants={otherParticipants}
            size={45}
            textSize={16}
          />
        </View>
        <View style={styles.info}>
          <Text
            color={'white'}
            weight={'500'}
            size={18}
            numberOfLines={1}
          >
            {getChannelName(route.params)}
          </Text>
        </View>
        <TouchableOpacity onPress={() => onInitiateCall(false)}>
          <View style={{ paddingRight: 5 }}>
            <PhoneIcon
              size={20}
              color={'white'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onInitiateCall(true)}>
          <View style={{ paddingHorizontal: 8 }}>
            <VideoIcon
              size={20}
              color={'white'}
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
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.keyboardAvoiding}>
          <TouchableOpacity>
            <View style={styles.plus}>
              <PlusIcon
                color="white"
                size={16}
              />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <InputField
              ref={inputRef}
              placeholder={'Type a message'}
              inputStyle={[InputStyles.text, styles.input]}
              outlineStyle={[InputStyles.outlineStyle, styles.outline]}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={onSendMessage}
              returnKeyType={'send'}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          {
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
                    size={16}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              isFocused ? (
                <TouchableOpacity
                  onPress={onSendMessage}
                >
                  <View style={{ marginLeft: 15 }}>
                    <SendIcon
                      color={text.primary}
                      size={28}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity>
                    <View style={{ paddingLeft: 15 }}>
                      <CameraIcon
                        size={22}
                        color={text.default}
                      />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <View style={{ paddingLeft: 15 }}>
                      <MicIcon
                        size={20}
                        color={text.default}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              )
            )
          }
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ChatView
