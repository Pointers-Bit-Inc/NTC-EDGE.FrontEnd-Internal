import React, { useRef, useState, useCallback, useEffect, FC } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  InteractionManager,
  Keyboard,
  Animated,
  ScrollView,
  Image
} from 'react-native';
import lodash from 'lodash';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import useSignalR from '@/src/hooks/useSignalr';
import Picker from 'emoji-picker-react';
import ChatList from '@pages/chat-modal/chat-list';
import {
  PlusIcon,
  CheckIcon,
  NewMessageIcon,
  CloseIcon,
  NewFileIcon
} from '@components/atoms/icon';
import {
  getFileSize,
} from '../../../utils/formatting';
import { InputField } from '@components/molecules/form-fields';
import { button, header } from '@styles/color';
import {
  addPendingMessage,
  removeSelectedMessage,
  resetPendingMessages
} from '@/src/reducers/channel/actions';
import useAttachmentPicker from '@/src/hooks/useAttachment';
import { AttachmentMenu } from '@components/molecules/menu';
import IMessages from '@/src/interfaces/IMessages';
import IParticipants from '@/src/interfaces/IParticipants';
import AttachIcon from '@assets/svg/AttachIcon';
import EmojiIcon from '@assets/svg/EmojiIcon';
import GifIcon from '@assets/svg/GifIcon';
import SendIcon from '@assets/svg/SendIcon';
import Text from '@atoms/text';
import { fontValue } from '../activities/fontValue';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8'
  },
  header: {
    padding: 15,
    paddingTop: 40,
    paddingBottom: 5,
    backgroundColor: header.secondary
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  info: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center'
  },
  bubbleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 4
  },
  keyboardAvoiding: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
    backgroundColor: '#f8f8f8'
  },
  containerStyle: {
    height: undefined,
    paddingVertical: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10
  },
  outline: {
    borderRadius: 10
  },
  input: {
    fontSize: fontValue(16)
  },
  plus: {
    borderRadius: fontValue(28),
    width: fontValue(28),
    height: fontValue(28),
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#212121'
  },
  circle: {
    backgroundColor: button.info,
    borderRadius: 28,
    width: 28,
    height: 28,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  floatingNotif: {},
  bar: {
    height: 15,
    width: 35,
    borderRadius: 4
  },
  fileItemContainer: {
    padding: 5,
    maxWidth: 200,
    height: 40,
    flexDirection: 'row',
    backgroundColor: '#E3E5EF',
    borderRadius: 3,
    alignItems: 'center',
    marginRight: 10,
  },
  removeFileItem: {
    position: 'absolute',
    zIndex: 99,
    right: -10,
    top: -5,
  }
});

interface Props {
  channelId: string;
  isGroup: boolean;
  groupName: string;
  lastMessage: IMessages;
  otherParticipants: Array<IParticipants>;
  onNext: Function;
  participants: Array<any>;
}

const ChatView: FC<Props> = ({
  channelId = '',
  isGroup = false,
  lastMessage = {},
  otherParticipants = [],
  onNext = () => {},
  participants = [],
  groupName = ''
}) => {
  const dispatch = useDispatch();
  const { editMessage } = useSignalR();
  const { selectedFile, pickImage, pickDocument } = useAttachmentPicker();
  const inputRef: any = useRef(null);
  const user = useSelector((state: RootStateOrAny) => state.user);
  const selectedMessage = useSelector((state: RootStateOrAny) => {
    const { selectedMessage } = state.channel;
    return selectedMessage[channelId];
  });
  const [inputText, setInputText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [showAttachmentOption, setShowAttachmentOption] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [fileToBeSend, setFileToBeSend] = useState([]);
  const Height = useRef(new Animated.Value(0));

  const onEmojiClick = (event: any, emojiObject: any) => {
    setInputText((i) => `${i}${emojiObject.emoji}`);
  };

  const removeFile = (i:number) => {
    setFileToBeSend((files:any) => {
      const updated:any = [];
      for(let f:number = 0; f < files.length; f++) {
        if (f !== i) {
          updated.push(files[f]);
        }
      }
      return updated;
    })
  }

  const onRemoveSelectedMessage = () =>
    dispatch(removeSelectedMessage(channelId));

  const _sendMessage = (
    channelId: string,
    inputText: string,
    groupName = '',
    participants: any = []
  ) => {
    dispatch(
      addPendingMessage({
        channelId: channelId,
        message: inputText,
        groupName,
        participants,
        messageType: 'text'
      })
    );
  };

  const _sendFile = (
    channelId: string,
    attachment: any,
    groupName = '',
    participants: any = []
  ) => {
    dispatch(
      addPendingMessage({
        attachment,
        channelId,
        groupName,
        participants,
        messageType: 'file'
      })
    );
  };

  const _editMessage = (messageId: string, message: string) => {
    editMessage(
      {
        messageId,
        message
      },
      (err: any, result: any) => {
        if (err) {
          console.log('ERR', err);
        }
      }
    );
  };

  const onSendMessage = useCallback(() => {
    if (lodash.size(fileToBeSend) > 0 && lodash.size(participants) > 0) {
      fileToBeSend.forEach(f => {
        _sendFile(channelId, f, groupName || '', participants);
      });
      setFileToBeSend([]);
    }

    if (!inputText || lodash.size(participants) === 0) {
      return;
    }
    if (selectedMessage?._id) {
      _editMessage(selectedMessage._id, inputText);
      inputRef.current?.blur();
      dispatch(removeSelectedMessage(channelId));
    } else {
      _sendMessage(channelId, inputText, groupName, participants);
      inputRef.current?.blur();
      setInputText('');
    }
  }, [channelId, inputText, fileToBeSend]);

  const onShowAttachmentOption = () => {
    inputRef.current?.blur();
    setShowAttachmentOption(true);
  };

  const onHideAttachmentOption = () => {
    setShowAttachmentOption(false);
  };
  useEffect(() => {
    if (lodash.size(selectedFile)) {
      setFileToBeSend((files:any) => [...files, selectedFile]);
      // _sendFile(channelId, selectedFile, name || '', participants);
    }
  }, [selectedFile]);

  useEffect(() => {
    const animateTo = (y, duration) =>
      Animated.timing(Height.current, {
        toValue: y,
        duration,
        useNativeDriver: false
      }).start();
    const showSubscription = Keyboard.addListener('keyboardDidShow', (evt) => {
      const height =
        evt.endCoordinates.height + (Platform.OS === 'ios' ? 0 : 25);
      animateTo(height, evt.duration);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', (evt) => {
      animateTo(0, evt.duration);
    });

    InteractionManager.runAfterInteractions(() => {
      setRendered(true);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      dispatch(resetPendingMessages());
    };
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
  }, [selectedMessage, rendered]);

  const removeFileItem = (i:number) => {
    return (
      <View style={styles.removeFileItem}>
        <TouchableOpacity onPress={() => removeFile(i)}>
          <View
            style={[
              styles.plus,
              {
                width: 18,
                height: 18,
                borderRadius: 18,
                backgroundColor: 'white',
                overflow: 'hidden',
                borderWidth: 1,
              }
            ]}
          >
            <CloseIcon
              type='close'
              size={fontValue(10)}
              color={'#212121'}
            />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const fileItem = (item:any, index:number) => {
    if (item?.mimeType === 'application/octet-stream') {
      return (
        <View key={index} style={[styles.fileItemContainer, { width: 40, padding: 0 }]}>
          {removeFileItem(index)}
          <Image
            resizeMode={'cover'}
            style={{ height: '100%', width: '100%', borderRadius: 3 }}
            borderRadius={3}
            source={{ uri: item?.uri }}
          />
        </View>
      );
    }

    return (
      <View key={index} style={styles.fileItemContainer}>
        {removeFileItem(index)}
        <NewFileIcon
          color={'#606A80'}
        />
        <View style={{ paddingHorizontal: 5, maxWidth: 100 }}>
          <Text
            numberOfLines={1}
            size={12}
            color={'#606A80'}
          >
            {item.name}
          </Text>
          <Text
            numberOfLines={1}
            size={10}
            color={'#606A80'}
            style={{ top: -2 }}
          >
            {getFileSize(item.size)}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        {rendered && (
          <ChatList
            channelId={channelId}
            isGroup={isGroup}
            lastMessage={lastMessage}
            otherParticipants={otherParticipants}
            onNext={onNext}
          />
        )}
      </View>
      {showEmoji && (
        <View
          style={{ position: 'absolute', zIndex: 99, bottom: 75, left: 75 }}
        >
          <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            groupNames={{ smileys_people: 'PEOPLE' }}
            native
          />
        </View>
      )}
      <View
        style={[
          {
            borderTopWidth: 2,
            paddingHorizontal: 32,
            paddingTop: 10,
            borderTopColor: '#efefef',
            backgroundColor: '#f8f8f8'
          }
        ]}
      >
        {
          <ScrollView
            style={{ marginBottom: 10, paddingTop: 10, marginTop: -10 }}
            horizontal
          >
            {fileToBeSend?.map(fileItem)}
          </ScrollView>
        }
        <InputField
          ref={inputRef}
          placeholder={'Type a message'}
          placeholderTextColor={'#C4C4C4'}
          containerStyle={{ borderColor: '#D1D1D6', backgroundColor: 'white' }}
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={() => inputText && onSendMessage()}
          returnKeyType={'send'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingBottom: 40
          }}
        >
          <View
            style={{
              gap: 25,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <TouchableOpacity onPress={pickDocument}>
              <AttachIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowEmoji(!showEmoji)}>
              <EmojiIcon />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <GifIcon />
            </TouchableOpacity>
          </View>
          <TouchableOpacity disabled={!(inputText || lodash.size(fileToBeSend) > 0)} onPress={onSendMessage}>
            {selectedMessage?._id ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TouchableOpacity onPress={onRemoveSelectedMessage}>
                  <View style={[styles.plus]}>
                    <CloseIcon
                      type="close"
                      size={fontValue(18)}
                      color={'#212121'}
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity disabled={!(inputText || lodash.size(fileToBeSend) > 0)} onPress={onSendMessage}>
                  <View
                    style={[
                      styles.plus,
                      {
                        marginRight: 0,
                        marginLeft: 10
                      },
                      !(inputText || lodash.size(fileToBeSend) > 0) && {
                        borderColor: '#212121'
                      }
                    ]}
                  >
                    <CheckIcon
                      type="check1"
                      size={fontValue(18)}
                      color={!(inputText || lodash.size(fileToBeSend) > 0) ? '#C4C4C4' : '#606A80'}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{ marginLeft: 10 }}>
                <SendIcon />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ChatView;
