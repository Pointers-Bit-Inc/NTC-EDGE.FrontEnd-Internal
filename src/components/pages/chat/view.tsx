import React, { useRef, useState, useCallback, useEffect, FC } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  InteractionManager,
  Keyboard,
  Animated,
} from 'react-native'
import lodash from 'lodash';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import useSignalR from 'src/hooks/useSignalr';
import ChatList from '@screens/chat/chat-list';
import {
  PlusIcon,
  CheckIcon,
  NewMessageIcon,
} from '@components/atoms/icon';
import { InputField } from '@components/molecules/form-fields';
import { button, header } from '@styles/color';
import {
  addPendingMessage,
  removeSelectedMessage,
  resetPendingMessages,
} from 'src/reducers/channel/actions';
import { RFValue } from 'react-native-responsive-fontsize';
import useDocumentPicker from 'src/hooks/useDocumentPicker';

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
    backgroundColor: button.info,
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

interface Props {
  onNext: Function;
  participants: Array<any>;
}

const ChatView: FC<Props> = ({ onNext = () => {}, participants = [] }) => {
  const dispatch = useDispatch();
  const {
    editMessage,
  } = useSignalR();
  const {
    selectedFile,
    pickDocument,
  } = useDocumentPicker();
  const inputRef:any = useRef(null);
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { _id } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;
      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, p => p._id === user._id);
      return selectedChannel;
    }
  );
  const { selectedMessage } = useSelector((state:RootStateOrAny) => state.channel);
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [rendered, setRendered] = useState(false);
  const Height = useRef(new Animated.Value(0));
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
    if (!inputText || lodash.size(participants) === 0) {
      return;
    }
    if (!channelId) {
      inputRef.current?.blur();
      setInputText('');
      return onNext(inputText);
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

  useEffect(() => {
    if (lodash.size(selectedFile)) {
      dispatch(addPendingMessage({
        attachment: selectedFile,
        channelId,
        messageType: 'file'
      }))
    }
  }, [selectedFile]);

  useEffect(() => {
    const animateTo = (y, duration) => Animated.timing(Height.current, { toValue: y, duration, useNativeDriver: false }).start();
    const showSubscription = Keyboard.addListener("keyboardDidShow", evt => {
      const height = evt.endCoordinates.height + (Platform.OS === 'ios' ? 0 : 25);
      animateTo(height, evt.duration);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", evt => {animateTo(0, evt.duration)});
        
    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    })

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      dispatch(resetPendingMessages());
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
  }, [selectedMessage, rendered]);
    

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {
          rendered && <ChatList />
        }
      </View>
      <Animated.View style={[styles.keyboardAvoiding, { marginBottom: Height.current }]}>
        <View style={{ marginTop: RFValue(-18) }}>
          <TouchableOpacity onPress={pickDocument}>
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
            disabled={!inputText}
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
      </Animated.View>
    </View>
  )
}

export default ChatView
