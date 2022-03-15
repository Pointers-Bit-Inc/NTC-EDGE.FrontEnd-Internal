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
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckIcon,
  NewCallIcon,
  NewVideoIcon,
  NewMessageIcon,
} from '@components/atoms/icon';
import Text from '@components/atoms/text';
import GroupImage from '@components/molecules/image/group';
import { InputField } from '@components/molecules/form-fields';
import { button, header } from '@styles/color';
import { getChannelName } from 'src/utils/formatting';
import {
  removeSelectedMessage,
  setSelectedChannel,
} from 'src/reducers/channel/actions';
import { removeActiveMeeting, setMeeting } from 'src/reducers/meeting/actions';
import { RFValue } from 'react-native-responsive-fontsize';
import CreateMeeting from '@components/pages/chat/meeting';
import IMeetings from 'src/interfaces/IMeetings';
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
    backgroundColor: '#D1D1D6',
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
  floatingNotif: {},
  bar: {
    height: 15,
    width: 35,
    borderRadius: 4,
  },
});

const ChatView = ({ navigation, route }:any) => {
  const dispatch = useDispatch();
  const {
    sendMessage,
    editMessage,
    endMeeting,
    leaveMeeting,
  } = useSignalR();
  const modalRef = useRef<BottomModalRef>(null);
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
    let meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m])
    meetingList = lodash.filter(meetingList, m => m.roomId === _id);
    return lodash.orderBy(meetingList, 'updatedAt', 'desc');
})
  const { selectedMessage } = useSelector((state:RootStateOrAny) => state.channel);
  const [inputText, setInputText] = useState('');
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [isVideoEnable, setIsVideoEnable] = useState(false);
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
    if (!inputText) {
      return;
    }
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

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    })
    return () => {
      dispatch(setSelectedChannel({}));
    }
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
  }, [selectedMessage, rendered, _id]);

  const onInitiateCall = (isVideoEnable = false) => {
    setIsVideoEnable(isVideoEnable);
    modalRef.current?.open();
    // navigation.navigate(
    //   'InitiateVideoCall',
    //   {
    //     participants,
    //     isVideoEnable,
    //     isVoiceCall: !isVideoEnable,
    //     isChannelExist: true,
    //     channelId,
    //   }
    // );
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
        <View style={{ paddingLeft: 5 }}>
          <GroupImage
            participants={otherParticipants}
            size={route?.params?.isGroup ? 55 : 40}
            textSize={route?.params?.isGroup ? 24 : 16}
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
        {
          rendered && <ChatList />
        }
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
              onFocus={() => setIsFocused(true)}
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
      </KeyboardAvoidingView>
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
