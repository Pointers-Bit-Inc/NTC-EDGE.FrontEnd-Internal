import React, { useState, useEffect, useCallback, useRef } from 'react'
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import useFirebase from 'src/hooks/useFirebase';
import { checkSeen } from 'src/utils/formatting';
import { DeleteIcon, WriteIcon } from '@components/atoms/icon';
import { setMessages, addMessages, updateMessages, removeMessages } from 'src/reducers/channel/actions';
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import ChatList from '@components/organisms/chat/list';
import { primaryColor, outline, text, button } from '@styles/color';

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
    borderRadius: 5,
    paddingVertical: 10,
    backgroundColor: button.primary,
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
    const { messages } = state.channel;
    const sortedMessages = lodash.orderBy(messages, 'updatedAt', 'desc');
    return sortedMessages;
  });
  const { channelId, isGroup, lastMessage, otherParticipants } = useSelector(
    (state:RootStateOrAny) => state.channel.selectedChannel
  );
  const {
    seenChannel,
    seenMessage,
    messagesSubscriber,
    unSendEveryone,
    unSendForYou
  } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage]:any = useState({});

  useEffect(() => {
    setLoading(true);
    const unsubscriber = messagesSubscriber(channelId, (querySnapshot:FirebaseFirestoreTypes.QuerySnapshot) => {
      setLoading(false);
      if (
        lastMessage &&
        lastMessage.message &&
        (!lastMessage.message.messageId)
      ) {
        const seen = checkSeen(lastMessage.seen, user);
        if (!seen) {
          seenChannel(channelId);
        }
      }
      querySnapshot.docChanges().forEach((change:any) => {
        const data = change.doc.data();
        data._id = change.doc.id;
        if (
          lastMessage &&
          lastMessage.message &&
          (lastMessage.message.messageId === data._id)
        ) {
          const seen = checkSeen(lastMessage.seen, user);
          if (!seen) {
            seenChannel(channelId);
          }
        }
        switch(change.type) {
          case 'added': {
            const hasSave = lodash.find(messages, (msg:any) => msg._id === data._id);
            const seen = checkSeen(data.seen, user);
            if (!seen) {
              seenMessage(data._id);
            }
            if (!hasSave) {
              dispatch(addMessages(data));
            }
            return;
          }
          case 'modified': {
            const seen = checkSeen(data.seen, user);
            if (!seen) {
              seenMessage(data._id);
            }
            dispatch(updateMessages(data));
            return;
          }
          case 'removed': {
            dispatch(removeMessages(data._id));
            return;
          }
          default:
            return;
        }
      })
    });
    return () => unsubscriber();
  }, [])

  const showOption = (item) => {
    setMessage(item);
    modalRef.current?.open();
  }

  const options = () => {
    return (
      <>
        <TouchableOpacity
          onPress={() => {
            modalRef.current?.close();
          }}
        >
          <View style={styles.button}>
            <WriteIcon
              color={text.default}
              size={22}
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
            <DeleteIcon
              color={text.error}
              size={22}
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
              color={text.primary}
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

  const unSendMessageEveryone = useCallback(
    () => unSendEveryone(message._id, channelId),
    [message, channelId]
  );

  const unSendMessageForYou = useCallback(
    () => {
      setShowAlert(false)
      setTimeout(() => unSendForYou(message._id), 500);
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
