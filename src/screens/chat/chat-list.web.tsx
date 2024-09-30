import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  InteractionManager,
  Image,
  Dimensions,
  Platform,
  Linking
} from 'react-native';
import Modal from 'react-native-modal';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import useSignalr from '@/src/hooks/useSignalr';
import { ListFooter } from '@components/molecules/list-item';
import { CloseIcon, NewEditIcon, NewFileIcon } from '@components/atoms/icon';
import {
  setMessages,
  addToMessages,
  setSelectedMessage,
  setPendingMessageError,
  removePendingMessage,
  addMessages,
  setSelectedChannel,
  addChannel
} from '@/src/reducers/channel/actions';
import BottomModal, {
  BottomModalRef
} from '@components/atoms/modal/bottom-modal';
import { getChannelName } from '@/src/utils/formatting';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import ChatList from '@components/organisms/chat/list';
import { outline, text, button } from '@styles/color';
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import { Regular, Regular500 } from '@styles/font';
import IMessages from '@/src/interfaces/IMessages';
import IParticipants from '@/src/interfaces/IParticipants';
import NoConversationIcon from '@assets/svg/noConversations';
import IAttachment from '@/src/interfaces/IAttachment';
import { NoContent } from '@screens/meet/index.web';
import GroupImage from '@components/molecules/image/group';
import CreateMeeting from '@components/pages/chat-modal/meeting';
import { setMeeting, setOptions } from '@/src/reducers/meeting/actions';
import { openUrl } from '@/src/utils/web-actions';
import { fontValue } from '@components/pages/activities/fontValue';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    borderBottomColor: outline.default,
    borderBottomWidth: 1
  },
  bar: {
    marginTop: 5,
    height: 4,
    width: 35,
    alignSelf: 'center',
    borderRadius: 4
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: button.info,
    marginHorizontal: 20,
    marginVertical: 10
  },
  cancelText: {
    fontSize: fontValue(16),
    color: text.info,
    fontFamily: Regular500
  },
  confirmText: {
    fontSize: fontValue(16),
    color: text.error,
    fontFamily: Regular500
  },
  title: {
    color: '#14142B',
    textAlign: 'center',
    fontSize: fontValue(16),
    fontFamily: Regular500
  },
  message: {
    color: '#4E4B66',
    textAlign: 'center',
    fontSize: fontValue(14),
    marginHorizontal: 15,
    marginBottom: 15,
    fontFamily: Regular
  },
  content: {
    maxWidth: 400,
    borderBottomColor: outline.default,
    borderBottomWidth: 1
  }
});

const List = () => {
  const dispatch = useDispatch();
  const modalRef = useRef<BottomModalRef>(null);
  const meetingModalRef = useRef<BottomModalRef>(null);
  const user = useSelector((state: RootStateOrAny) => state.user);
  const selectedChannel = useSelector(
    (state: RootStateOrAny) => state.channel.selectedChannel
  );
  const channelMessages = useSelector(
    (state: RootStateOrAny) => state.channel.channelMessages
  );
  const pendingMessages = useSelector(
    (state: RootStateOrAny) => state.channel.pendingMessages
  );
  const {
    _id,
    isGroup,
    lastMessage,
    otherParticipants = [],
    participants = [],
    hasRoomName,
    name,
    author = {}
  } = useMemo(() => {
    selectedChannel.otherParticipants = lodash.reject(
      selectedChannel.participants,
      (p: IParticipants) => p._id === user._id
    );
    return selectedChannel;
  }, [selectedChannel]);
  const messages = useMemo(() => {
    const normalizedMessages =
      channelMessages[selectedChannel._id]?.messages || {};
    const channelPendingMessages =
      pendingMessages[selectedChannel._id || 'temp'] || {};
    const messagesList = lodash.keys(normalizedMessages).map((m: string) => {
      return normalizedMessages[m];
    });
    const pendingMessageList = lodash
      .keys(channelPendingMessages)
      .map((m: string) => {
        return channelPendingMessages[m];
      });
    let delivered = false;
    let seen: any = [];
    const messageArray = lodash
      .orderBy(messagesList, 'createdAt', 'desc')
      .map((msg: IMessages) => {
        if (!delivered && msg.delivered) {
          delivered = true;
        }
        if (delivered) msg.delivered = true;

        seen = lodash.unionBy(seen, msg.seen, 'id');
        msg.seen = seen;

        return msg;
      });

    const pendingMessagesArray = lodash.orderBy(
      pendingMessageList,
      'createdAt',
      'desc'
    );

    return lodash.concat(pendingMessagesArray, messageArray);
  }, [selectedChannel, channelMessages, pendingMessages]);
  const channelId = _id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage]: any = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [isVideoEnable, setIsVideoEnable] = useState(false);
  const [preview, setPreview] = useState<any>({});

  const {
    sendMessage,
    sendFile,
    getMessages,
    unSendMessage,
    deleteMessage,
    seenMessage,
    createChannel
  } = useSignalr();

  const fetchMoreMessages = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    getMessages(channelId, pageIndex, false, (err, res) => {
      setLoading(false);
      if (res) {
        if (res.list) dispatch(addToMessages(channelId, res.list));
        setPageIndex((current) => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        console.log('ERR', err);
        setHasError(true);
      }
      setFetching(false);
    });
  };

  const _sendMessage = (
    data: any,
    messageId: string,
    config: any,
    createNew = false
  ) => {
    if (createNew) {
      createChannel(
        data,
        (err: any, res: any) => {
          if (res) {
            const { lastMessage } = res;
            res.otherParticipants = lodash.reject(
              res.participants,
              (p: IParticipants) => p._id === user._id
            );
            dispatch(removePendingMessage(channelId, messageId, lastMessage));
            dispatch(setSelectedChannel(res));
            dispatch(addChannel(res));
          }
          if (err) {
            console.log('ERROR', err, messageId);
            if (err?.message !== 'canceled') {
              dispatch(setPendingMessageError(channelId, messageId));
            }
          }
        },
        config
      );
    } else {
      sendMessage(
        data,
        (err: any, result: IMessages) => {
          if (err) {
            if (err?.message !== 'canceled') {
              dispatch(setPendingMessageError(channelId, messageId));
            }
          } else {
            dispatch(removePendingMessage(channelId, messageId, result));
          }
        },
        config
      );
    }
  };

  const _sendFile = (
    channelId: string,
    messageId: string,
    data: any,
    config: any
  ) => {
    sendFile(
      channelId,
      data,
      (err: any, result: any) => {
        if (err) {
          if (err?.message !== 'canceled') {
            dispatch(setPendingMessageError(channelId, messageId));
          }
        } else {
          dispatch(removePendingMessage(channelId, messageId, result));
        }
      },
      config
    );
  };

  useEffect(() => {
    try {
      InteractionManager.runAfterInteractions(() => {
        setRendered(true);
      });
    } catch (error) {
      console.error('Error in InteractionManager:', error); // Or use a logging service
    }
  }, []);
  const isMounted = useRef(true);
  useEffect(() => {
    if (rendered) {
      setLoading(true);
      setPageIndex(1);
      setHasMore(false);
      setHasError(false);



      getMessages(channelId, 1, false, (err, res) => {
          setLoading(false);
          if (res) {
            dispatch(setMessages(channelId, res.list));
            setPageIndex((current) => current + 1);
            setHasMore(res.hasMore);
          } else {
            console.log('Error fetching messages:', err);
            setHasError(true);
          }
      });

      return () => {
        isMounted.current = false;
      };
    }
  }, [rendered, channelId, dispatch, getMessages]);

  useEffect(() => {
    if (lastMessage && rendered) {
      const hasSeen = lodash.find(lastMessage?.seen, (s:IParticipants) => s._id === user._id);
      if (!hasSeen) {
        seenMessage(lastMessage._id);
      }
    }
  }, [lastMessage, rendered]);

  const showOption = (item:IMessages, type?:string) => {
    console.log('TYPE TYPE', type);
    if (type === 'edit') {
      dispatch(setSelectedMessage(channelId, item));
    } else if (type === 'delete') {
      setMessage(item);
      setShowDeleteOption(true);
      modalRef.current?.open();
    } else {
      setMessage(item);
      modalRef.current?.open();
    }
  }

  const options = () => {
    return (
      <>
        {!lodash.size(message?.attachment) && (
          <TouchableOpacity
            onPress={() => {
              dispatch(setSelectedMessage(channelId, message));
              modalRef.current?.close();
            }}
          >
            <View style={styles.button}>
              <NewEditIcon
                height={fontValue(22)}
                width={fontValue(22)}
                color={text.default}
              />
              <Text style={{ marginLeft: 15 }} color={text.default} size={18}>
                Edit
              </Text>
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => {
            if (message?.messageType === 'file') {
              dispatch(removePendingMessage(channelId, message._id, null));
            } else {
              setShowDeleteOption(true);
            }
          }}
        >
          <View style={[styles.button, { borderBottomWidth: 0 }]}>
            <NewDeleteIcon
              height={fontValue(22)}
              width={fontValue(22)}
              color={text.error}
            />
            <Text style={{ marginLeft: 15 }} color={text.error} size={18}>
              Delete
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const deletOptions = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            modalRef.current?.close();
            setTimeout(() => setShowAlert(true), 500);
          }}
        >
          <View style={[styles.button, { justifyContent: 'center' }]}>
            <Text style={{ marginLeft: 15 }} color={text.info} size={18}>
              Unsend for myself
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            modalRef.current?.close();
            setTimeout(() => unSendMessageEveryone(), 500);
          }}
        >
          <View
            style={[
              styles.button,
              { borderBottomWidth: 0, justifyContent: 'center' }
            ]}
          >
            <Text style={{ marginLeft: 15 }} color={text.error} size={18}>
              Unsend for everyone
            </Text>
          </View>
        </TouchableOpacity>
        <Button style={[styles.cancelButton]} onPress={modalRef.current?.close}>
          <Text color="white" size={18}>
            Cancel
          </Text>
        </Button>
      </>
    );
  };

  const ListFooterComponent = () => {
    if (hasMore) {
      return (
        <ListFooter
          hasError={hasError}
          fetching={fetching}
          loadingText="Loading more chat..."
          errorText="Unable to load chats"
          refreshText="Refresh"
          onRefresh={() => fetchMoreMessages(true)}
        />
      );
    }

    return chatHeaderInfo();
  };

  const unSendMessageEveryone = useCallback(() => {
    deleteMessage(message._id);
  }, [message, channelId]);

  const unSendMessageForYou = useCallback(() => {
    setShowAlert(false);
    setTimeout(() => unSendMessage(message._id), 500);
  }, [message]);

  const onCallAgain = (videoEnabled: boolean) => {
    if (Platform.OS === 'web') {
      openUrl(`/VideoCall?roomId=${channelId}&isVoiceCall=${!videoEnabled}`);
    } else {
      setIsVideoEnable(videoEnabled);
      meetingModalRef.current?.open();
    }
  };

  const checkIfImage = (uri: any) => {
    if (
      uri &&
      (uri.endsWith('.png') || uri.endsWith('.jpg') || uri.endsWith('.jpeg'))
    )
      return true;
    return false;
  };

  const renderChannelName = () => {
    return getChannelName({
      otherParticipants,
      hasRoomName,
      name,
      isGroup
    });
  };

  const getPosition = (data: IParticipants) => {
    let result = '';

    if (data.designation) result += data.designation;
    if (data.designation && data.position) result += ' - ';
    if (data.position) result += data.position;

    return result;
  };

  const chatHeaderInfo = () => {
    return (
      <View style={{ alignItems: 'center', marginBottom: 30, padding: 30 }}>
        <View style={{ alignSelf: 'center', marginBottom: 5 }}>
          <GroupImage
            participants={otherParticipants}
            size={isGroup ? 60 : 45}
            textSize={isGroup ? 28 : 20}
            inline={true}
            showOthers={true}
            sizeOfParticipants={5}
          />
        </View>
        <Text
          style={{
            fontFamily: Regular500,
            textAlign: 'center',
            marginBottom: 2
          }}
          color={'black'}
          size={18}
        >
          {renderChannelName()}
        </Text>
        {lodash.size(otherParticipants) > 1 ? (
          <Text
            style={{ fontFamily: Regular500, textAlign: 'center' }}
            color={'black'}
            size={10}
            numberOfLines={1}
          >
            {author?.name} created this group
          </Text>
        ) : (
          getPosition(otherParticipants[0]) !== '' && (
            <Text
              style={{ fontFamily: Regular500, textAlign: 'center' }}
              color={'black'}
              size={10}
              numberOfLines={1}
            >
              {getPosition(otherParticipants[0])}
            </Text>
          )
        )}
        <Text
          style={{ fontFamily: Regular500, textAlign: 'center' }}
          color={'black'}
          size={10}
          numberOfLines={1}
        >
          Participants ({lodash.size(participants)})
        </Text>
      </View>
    );
  };

  return (
    <>
      {!messages.length ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <View>
            <NoContent />
          </View>

          <Text
            style={{
              color: '#A0A3BD',
              paddingVertical: 30,
              fontSize: 24,
              fontFamily: Regular,
              fontWeight: '400'
            }}
          >
            No conversations yet
          </Text>
        </View>
      ) : (
        <>
          <ChatList
            user={user}
            messages={messages}
            participants={otherParticipants}
            lastMessage={lastMessage}
            isGroup={isGroup}
            loading={loading}
            error={error}
            showOption={showOption}
            ListFooterComponent={ListFooterComponent}
            onEndReached={() => fetchMoreMessages()}
            onEndReachedThreshold={0.5}
            onSendMessage={_sendMessage}
            onSendFile={_sendFile}
            onPreview={(item: IAttachment) => setPreview(item)}
            onCallAgain={onCallAgain}
          />
          <Modal
            isVisible={!!preview?.attachment}
            statusBarTranslucent={true}
            onBackdropPress={() => setPreview({})}
            onSwipeComplete={() => setPreview({})}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 15
            }}
          >
            <View style={{ position: 'absolute', top: 0, right: 0 }}>
              <TouchableOpacity onPress={() => setPreview({})}>
                <Text color={'white'} size={16}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
            {!!preview?.attachment && checkIfImage(preview?.attachment?.uri) ? (
              <Image
                resizeMode={'contain'}
                source={{ uri: preview?.attachment?.uri }}
                style={{ width: width * 0.9, height: height * 0.8 }}
              />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <NewFileIcon color={'#fff'} width={60} height={60} />
                <Text
                  style={{ textAlign: 'center', marginTop: 15 }}
                  color={'white'}
                  size={18}
                  numberOfLines={3}
                >
                  {preview?.attachment?.name}
                </Text>
                <View style={{ justifyContent: 'center', marginTop: 30 }}>
                  <TouchableOpacity onPress={() => Linking.openURL(preview?.attachment?.uri)}>
                    <View style={{ paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#2863D6', borderRadius: 10 }}>
                      <Text
                        color={'white'}
                        size={16}
                      >
                        Download
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Modal>
          <BottomModal
            ref={modalRef}
            onModalHide={() => setShowDeleteOption(false)}
            header={<View style={styles.bar} />}
          >
            <View style={{ paddingBottom: 20 }}>
              {showDeleteOption ? deletOptions() : options()}
            </View>
          </BottomModal>
          <BottomModal
            ref={meetingModalRef}
            onModalHide={() => meetingModalRef.current?.close()}
            avoidKeyboard={false}
            header={<View style={styles.bar} />}
            containerStyle={{ maxHeight: null }}
            onBackdropPress={() => {}}
          >
            <View
              style={{
                paddingBottom: 20,
                height: height * (Platform.OS === 'ios' ? 0.94 : 0.98)
              }}
            >
              <CreateMeeting
                barStyle={'dark-content'}
                participants={participants}
                isVideoEnable={isVideoEnable}
                isVoiceCall={!isVideoEnable}
                isChannelExist={true}
                channelId={channelId}
                onClose={() => meetingModalRef.current?.close()}
                onSubmit={(params, data) => {
                  meetingModalRef.current?.close();
                  dispatch(
                    setOptions({
                      ...params.options,
                      isHost: params.isHost,
                      isVoiceCall: params.isVoiceCall
                    })
                  );
                  setTimeout(() => dispatch(setMeeting(data)), 500);
                }}
              />
            </View>
          </BottomModal>
          <AwesomeAlert
            show={showAlert}
            showProgress={false}
            contentContainerStyle={{ borderRadius: 15 }}
            title={'Unsend for You?'}
            titleStyle={styles.title}
            message={
              'This message will be unsend for you. Other chat members will still able to see it.'
            }
            messageStyle={styles.message}
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
            confirmText="Unsend"
            onCancelPressed={() => setShowAlert(false)}
            onConfirmPressed={unSendMessageForYou}
          />
        </>
      )}
    </>
  );
};

export default List;
