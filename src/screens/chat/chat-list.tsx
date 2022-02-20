import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import useFirebase from 'src/hooks/useFirebase';
import useSignalr from 'src/hooks/useSignalr';
import { checkSeen } from 'src/utils/formatting';
import { ListFooter } from '@components/molecules/list-item';
import { DeleteIcon, NewEditIcon, WriteIcon } from '@components/atoms/icon';
import {
  setMessages,
  addToMessages,
  addMessages,
  updateMessages,
  removeMessages,
  setSelectedMessage
} from 'src/reducers/channel/actions';
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import ChatList from '@components/organisms/chat/list';
import { primaryColor, outline, text, button } from '@styles/color';
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  },
  bar: {
    marginTop: 5,
    height: 4,
    width: 35,
    alignSelf: 'center',
    borderRadius: 4,
  },
  cancelButton: {
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: button.info,
    marginHorizontal: 20,
    marginVertical: 10,
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
})

const List = () => {
  const dispatch = useDispatch();
  const modalRef = useRef<BottomModalRef>(null);
  const user = useSelector((state:RootStateOrAny) => state.user);
  const messages = useSelector((state:RootStateOrAny) => {
    const { normalizedMessages } = state.channel;
    const messagesList = lodash.keys(normalizedMessages).map(m => {
      return normalizedMessages[m];
    });
    return lodash.orderBy(messagesList, 'createdAt', 'desc');
  });
  const { _id, isGroup, lastMessage, otherParticipants } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;
      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, p => p._id === user._id);
      return selectedChannel;
    }
  );
  const channelId = _id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage]:any = useState({});
  const [pageIndex, setPageIndex] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);

  const {
    getMessages,
    unSendMessage,
    deleteMessage,
    seenMessage,
  } = useSignalr();

  const fetchMoreMessages = (isPressed = false) => {
    if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
    setFetching(true);
    setHasError(false);
    getMessages(channelId, pageIndex, (err, res) => {
      setLoading(false);
      if (res) {
        if (res.list) dispatch(addToMessages(res.list));
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        console.log('ERR', err);
        setHasError(true);
      }
      setFetching(false);
    })
  }

  useEffect(() => {
    setLoading(true);
    setPageIndex(1);
    setHasMore(false);
    setHasError(false);
    getMessages(channelId, 1, (err, res) => {
      setLoading(false);
      if (res) {
        dispatch(setMessages(res.list));
        setPageIndex(current => current + 1);
        setHasMore(res.hasMore);
      }
      if (err) {
        console.log('ERR', err);
        setHasError(true);
      }
    })
  }, [])

  useEffect(() => {
    if (lastMessage) {
      const hasSeen = lodash.find(lastMessage?.seen, s => s._id === user._id);
      if (!hasSeen) {
        seenMessage(lastMessage._id);
      }
    }
  }, [lastMessage]);

  const showOption = (item) => {
    setMessage(item);
    modalRef.current?.open();
  }

  const options = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            dispatch(setSelectedMessage(message));
            modalRef.current?.close();
          }}
        >
          <View style={styles.button}>
            <NewEditIcon
              height={RFValue(22)}
              width={RFValue(22)}
              color={text.default}
            />
            <Text
              style={{ marginLeft: 15 }}
              color={text.default}
              size={18}
            >
              Edit
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowDeleteOption(true)}
        >
          <View style={[styles.button, { borderBottomWidth: 0 }]}>
            <NewDeleteIcon
              height={RFValue(22)}
              width={RFValue(22)}
              color={text.error}
            />
            <Text
              style={{ marginLeft: 15 }}
              color={text.error}
              size={18}
            >
              Delete
            </Text>
          </View>
        </TouchableOpacity>
      </>
    )
  }

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
            <Text
              style={{ marginLeft: 15 }}
              color={text.info}
              size={18}
            >
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
          <View style={[styles.button, { borderBottomWidth: 0, justifyContent: 'center' }]}>
            <Text
              style={{ marginLeft: 15 }}
              color={text.error}
              size={18}
            >
              Unsend for everyone
            </Text>
          </View>
        </TouchableOpacity>
        <Button
          style={[styles.cancelButton]}
          onPress={modalRef.current?.close}
        >
          <Text color="white" size={18}>Cancel</Text>
        </Button>
      </>
    )
  }

  const ListFooterComponent = () => {
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

  const unSendMessageEveryone = useCallback(
    () => {
      deleteMessage(message._id)
    },
    [message, channelId]
  );

  const unSendMessageForYou = useCallback(
    () => {
      setShowAlert(false)
      setTimeout(() => unSendMessage(message._id), 500);
    },
    [message]
  );

  return (
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
      />
      <BottomModal
        ref={modalRef}
        onModalHide={() => setShowDeleteOption(false)}
        header={
          <View style={styles.bar} />
        }
      >
        <View style={{ paddingBottom: 20 }}>
          {showDeleteOption ? deletOptions() : options()}
        </View>
      </BottomModal>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        contentContainerStyle={{ borderRadius: 15 }}
        title={'Unsend for You?'}
        titleStyle={styles.title}
        message={'This message will be unsend for you. Other chat members will still able to see it.'}
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
  )
}

export default List
