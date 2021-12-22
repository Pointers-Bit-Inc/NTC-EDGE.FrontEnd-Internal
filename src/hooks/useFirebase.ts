import { useCallback, useEffect, useRef, useState } from 'react';
import {
  initializeApp,
  deleteApp,
  getApps,
  getApp
} from 'firebase/app';
import {
  onSnapshot,
  getFirestore,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  doc,
  collection,
  query,
  where,
  serverTimestamp,
  orderBy,
  arrayUnion,
  writeBatch,
  limit
} from 'firebase/firestore';
import { checkSeen, getOtherParticipants } from 'src/utils/formatting';
import lodash from 'lodash';
import { firebaseConfig } from "src/services/config";

const useFirebase = (user:any) => {
  const firestore:any = useRef(
    getApps().length === 0 ?
    null :
    getFirestore()
  );
  const firebaseApp:any = useRef();

  useEffect(() => {
    const app = getApps().length === 0 ?
      null :
      getApp();
    if (app) {
      firestore.current = getFirestore();
    }
  }, []);

  const initializeFirebaseApp = () => {
    firebaseApp.current = initializeApp(firebaseConfig);
    firestore.current = getFirestore();
  };

  const deleteFirebaseApp = () => {
    deleteApp(firebaseApp.current);
  }

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
    const q = query(
      collection(firestore.current, "channels"),
      where(
        'deleted',
        '==',
        false
      ),
      where(
        'participantsId',
        'array-contains',
        user._id,
      ),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
  }, [user]);

  const messagesSubscriber = useCallback((channelId:string, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "meetings"),
      where(
        'channelId',
        '==',
        channelId,
      ),
      orderBy('createdAt', 'desc'),
    );
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
  }, [user]);

  const meetingSubscriber = useCallback((channelId:string, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "messages"),
      where(
        'channelId',
        '==',
        channelId,
      ),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
  }, [user]);

  const createChannel = useCallback(async (participants, callback = () => {}) => {
    try {
      const participantsWithUser:any = _getParticipants(participants);
      const isGroup = lodash.size(participantsWithUser) > 2;
      const addRef = await addDoc(collection(firestore.current, "channels"), {
        channelName: _getInitialChannelName(participantsWithUser),
        participantsId: _getParticipantsId(participantsWithUser),
        participants: participantsWithUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: {
          message: `created a new ${isGroup ? 'group ' : ' '}chat`,
          sender: user,
        },
        isGroup,
        seen: [user],
        author: user,
        deleted: false,
      });
      const docRef = await getDoc(doc(firestore.current, "channels", addRef.id));
      const data:any = docRef.data();
      data._id = addRef.id;
      data.channelId = addRef.id;
      data.otherParticipants = getOtherParticipants(data.participants, user);
      data.hasSeen = checkSeen(data.seen, user);
      return callback(null, data);
    } catch(e) {
      console.log('ERROR', e);
      return callback(e);
    }
  }, [user]);

  const createMeeting = useCallback(async ({ participants, channelName }, callback = () => {}) => {
    try {
      const participantsWithUser:any = _getParticipants(participants);
      const isGroup = lodash.size(participantsWithUser) > 2;
      const addRef = await addDoc(collection(firestore.current, "channels"), {
        channelName: channelName || _getInitialChannelName(participantsWithUser),
        participantsId: _getParticipantsId(participantsWithUser),
        participants: participantsWithUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: {
          message: `created a new ${isGroup ? 'group ' : ' '}chat`,
          sender: user,
        },
        isGroup,
        seen: [user],
        author: user,
        deleted: false,
      });
      const docRef = await getDoc(doc(firestore.current, "channels", addRef.id));
      const data:any = docRef.data();
      data._id = addRef.id;
      data.channelId = addRef.id;
      data.otherParticipants = getOtherParticipants(data.participants, user);
      data.hasSeen = checkSeen(data.seen, user);
      await addDoc(
        collection(firestore.current, "meetings"), {
          channelId: data._id,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          endedAt: null,
          ended: false,
          joinedMembers: [],
        }
      );
      return callback(null, data);
    } catch(e) {
      console.log('ERROR', e);
      return callback(e);
    }
  }, [user]);

  const deleteChannel = useCallback(async (channelId) => {
    await updateDoc(doc(firestore.current, "channels", channelId), {
      deleted: true,
    });
  }, [user]);

  const getChannel = useCallback(async (callback) => {
    const q = query(
      collection(firestore.current, "channels"),
      where(
        'participantsId',
        'array-contains',
        user._id,
      ),
      orderBy('updatedAt', 'desc')
    );
    await getDocs(q)
    .then((data) => callback(null, data))
    .catch((e) => callback(e));
  }, [user]);

  const getMessages = useCallback(async (channelId:string, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "messages"),
      where(
        'channelId',
        '==',
        channelId,
      ),
      orderBy('createdAt', 'desc')
    );
    await getDocs(q)
    .then((data) => callback(null, data))
    .catch((e) => callback(e));
  }, []);

  const sendMessage = useCallback(async (channelId, message) => {
    await addDoc(collection(firestore.current, "messages"), {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      message,
      channelId,
      seen: [user],
      sender: user,
      deleted: false,
      unSend: false,
    });
    await updateDoc(doc(firestore.current, "channels", channelId), {
      updatedAt: serverTimestamp(),
      lastMessage: {
        message: message,
        sender: user,
      },
      seen: [user],
    });
  }, [user]);

  const seenMessage = useCallback(async (messageId) => {
    await updateDoc(doc(firestore.current, "messages", messageId), {
      seen: arrayUnion(user),
    });
  }, [user]);

  const seenChannel = useCallback(async (channelId) => {
    await updateDoc(doc(firestore.current, "channels", channelId), {
      seen: arrayUnion(user),
    });
  }, [user]);

  const unSendEveryone = useCallback(async (messageId, channelId) => {
    const batch = writeBatch(firestore.current);
    const messageRef = doc(firestore.current, "messages", messageId);
    const channelRef = doc(firestore.current, "channels", channelId);
    batch.update(messageRef, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      deleted: true,
      message: '',
    });
    batch.update(channelRef, {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      lastMessage: {
        message: `${user.firstname} deleted a message`,
        sender: user,
      },
      seen: [user],
    });
    batch.commit();
  }, [user]);

  const unSendForYou = useCallback(async (messageId) => {
    await updateDoc(doc(firestore.current, "messages", messageId), {
      unSend: true,
    });
  }, [user]);

  const leaveChannel = useCallback(async (channelId, participants) => {
    const filterParticipants = lodash.reject(participants, p => p._id === user._id);
    await updateDoc(doc(firestore.current, "channels", channelId), {
        updatedAt: firestore.FieldValue.serverTimestamp(),
        // participantsId: _getParticipantsId(filterParticipants),
        // participants: filterParticipants,
        deleted: true,
      });
  }, [user]);
  
  const editMessage = useCallback(async (messageId, message) => {
    await updateDoc(doc(firestore.current, "messages", messageId), {
      updatedAt: firestore.FieldValue.serverTimestamp(),
      edited: true,
      message,
    });
  }, [user]);

  const joinMeeting = useCallback(async (meetingId, uid) => {
    await updateDoc(doc(firestore.current, "meetingId", meetingId), {
      joinedMembers: firestore.FieldValue.arrayUnion({ ...user, uid })
    });
  }, [user]);

  return {
    initializeFirebaseApp,
    deleteFirebaseApp,
    channelSubscriber,
    messagesSubscriber,
    createChannel,
    createMeeting,
    deleteChannel,
    getChannel,
    getMessages,
    sendMessage,
    seenMessage,
    seenChannel,
    unSendEveryone,
    unSendForYou,
    leaveChannel,
    editMessage,
    joinMeeting,
    meetingSubscriber
  }
}

export default useFirebase;