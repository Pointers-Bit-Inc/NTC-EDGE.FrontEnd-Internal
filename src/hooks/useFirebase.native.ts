import { useCallback } from 'react';
import firestore from '@react-native-firebase/firestore';
import { checkSeen, getOtherParticipants } from 'src/utils/formatting';
import lodash from 'lodash';

const useFirebase = (user:any) => {
  const _getParticipants = (participants:any) => ([
    ...participants,
    user,
  ]);

  const _getInitialChannelName = (participants = []) => {
    let channelName = ''
    participants.map(
      (participant:any, index) => {
        if (index === lodash.size(participants) - 1) {
          channelName += participant.name;
          return;
        }
        channelName += `${participant.name}, `;
        return;
      });
    return channelName;
  };

  const _getParticipantsId = (participants = []) => {
    let ids = participants.map(
      (participant:any) => {
        return participant._id;
      });
    return ids;
  }

  const channelSubscriber = useCallback((searchText:string, callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('channels')
      .where(
        'participantsId',
        'array-contains',
        user._id,
      )
      .orderBy('updatedAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, [user]);

  const messagesSubscriber = useCallback((channelId:string, callback = () => {}) => {
    const unsubscribe = firestore()
      .collection('messages')
      .where(
        'channelId',
        '==',
        channelId,
      )
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
    return unsubscribe;
  }, []);

  const createChannel = useCallback(async (participants, callback = () => {}) => {
    const participantsWithUser:any = _getParticipants(participants);
    const isGroup = lodash.size(participantsWithUser) > 2;
    await firestore()
      .collection('channels')
      .add({
        channelName: _getInitialChannelName(participantsWithUser),
        participantsId: _getParticipantsId(participantsWithUser),
        participants: participantsWithUser,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastMessage: {
          message: `created a new ${isGroup ? 'group ' : ' '}chat`,
          sender: user,
        },
        isGroup,
        seen: [user],
      })
      .then(data => {
        data
          .get()
          .then((res) => {
            const result:any = res.data();
            result._id = res.id;
            result.channelId = res.id;
            result.otherParticipants = getOtherParticipants(result.participants, user);
            result.hasSeen = checkSeen(result.seen, user);
            return callback(null, result);
          })
          .catch(err => callback(err));
      })
      .catch(err => callback(err));
  }, [user]);

  const getChannel = useCallback(async (callback) => {
    await firestore()
      .collection('channels')
      .where(
        'participantsId',
        'array-contains',
        user._id,
      )
      .orderBy('updatedAt', 'desc')
      .get()
      .then((data) => callback(null, data))
      .catch((e) => callback(e));
  }, [user]);

  const getMessages = useCallback(async (channelId:string, callback = () => {}) => {
    await firestore()
      .collection('messages')
      .where(
        'channelId',
        '==',
        channelId,
      )
      .orderBy('createdAt', 'desc')
      .get()
      .then(data => callback(null, data))
      .catch(err => callback(err));
  }, []);

  const sendMessage = useCallback(async (channelId, message) => {
    await firestore()
      .collection('messages')
      .add({
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
        message,
        channelId,
        seen: [user],
        sender: user,
      });
    await firestore()
      .collection('channels')
      .doc(channelId)
      .update({
        updatedAt: firestore.FieldValue.serverTimestamp(),
        lastMessage: {
          message: message,
          sender: user,
        },
        seen: [user],
      });
  }, [user]);

  const seenMessage = useCallback(async (channelId, messageId) => {
    const batch = firestore().batch();
    if (messageId) {
      const messageRef = firestore().collection('messages').doc(messageId);
      batch.update(messageRef, {
        seen: firestore.FieldValue.arrayUnion(user),
      });
    }
    const channelRef = firestore().collection('channels').doc(channelId);
    batch.update(channelRef, {
      seen: firestore.FieldValue.arrayUnion(user),
    });
    await batch.commit();
  }, [user]);

  return {
    channelSubscriber,
    messagesSubscriber,
    createChannel,
    getChannel,
    getMessages,
    sendMessage,
    seenMessage,
  }
}

export default useFirebase;