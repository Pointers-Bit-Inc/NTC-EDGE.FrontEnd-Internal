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
import { checkSeen, getOtherParticipants } from '@/src/utils/formatting';
import lodash from 'lodash';
import { firebaseConfig } from "@/src/services/config";

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
          channelName += participant.firstName;
          return;
        }
        channelName += `${participant.firstName}, `;
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

  const channelMeetingSubscriber = useCallback((channelId:string, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "meetings"),
      where(
        'ended',
        '==',
        false,
      ),
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

  const userActiveMeetingSubscriber = useCallback((callback = () => {}) => {
    const q = query(
      collection(firestore.current, "meetings"),
      where(
        'participantsId',
        'array-contains',
        user._id,
      ),
      where(
        'ended',
        '==',
        false,
      ),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
  }, [user]);

  const userMeetingSubscriber = useCallback((callback = () => {}) => {
    const q = query(
      collection(firestore.current, "meetings"),
      where(
        'participantsId',
        'array-contains',
        user._id,
      ),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
  }, [user]);

  const meetingSubscriber = useCallback((meetingId:string, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "meetings"),
      where(
        'meetingId',
        '==',
        meetingId,
      ),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, callback);
    return unsubscribe;
  }, [user]);

  const memberMeetingSubscriber = useCallback((meetingId:string, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "joinMeetings"),
      where(
        'meetingId',
        '==',
        meetingId,
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
          message: `Created a new ${isGroup ? 'group ' : ' '}chat`,
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
      return callback(e);
    }
  }, [user]);

  const createMeeting = useCallback(async ({ participants, channelName }, callback = () => {}) => {
    try {
      const participantsWithUser:any = _getParticipants(participants);
      const isGroup = lodash.size(participantsWithUser) > 2;
      const initalChannelName = _getInitialChannelName(participantsWithUser);
      const participantsId = _getParticipantsId(participantsWithUser);
      
      const addRef = await addDoc(collection(firestore.current, "channels"), {
        channelName: channelName || initalChannelName,
        hasChannelName: !!channelName,
        participantsId: participantsId,
        participants: participantsWithUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: {
          message: `Created a new ${isGroup ? 'group ' : ' '}chat`,
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
      const channelData = data;
      data.hasSeen = checkSeen(data.seen, user);
      const meetingRef = doc(firestore.current, 'meetings');
      await setDoc(
        meetingRef, {
          channelId: data._id,
          channelName: channelName || initalChannelName,
          hasChannelName: !!channelName,
          meetingId: meetingRef.id,
          channel: channelData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          endedAt: null,
          ended: false,
          host: user,
          participants: participantsWithUser,
          participantsId: participantsId,
          meetingParticipants: [],
        }
      );
      return callback(null, data);
    } catch(e) {
      return callback(e);
    }
  }, [user]);

  const initiateMeeting = useCallback(async ({ channelId, isVoiceCall, meetingName }, callback = () => {}) => {
    const channelRef = doc(firestore.current, "channels", channelId)
    try {
      await updateDoc(channelRef, {
        updatedAt: serverTimestamp(),
        lastMessage: {
          message: `Created a new meeting.`,
          sender: user,
        },
        seen: [user],
      });
      const docRef = await getDoc(channelRef);
      const data:any = docRef.data();
      data._id = channelRef.id;
      data.channelId = channelRef.id;
      data.otherParticipants = getOtherParticipants(data.participants, user);
      const channelData = data;
      data.hasSeen = checkSeen(data.seen, user);
      const meetingRef = doc(firestore.current, 'meetings');
      await setDoc(
        meetingRef, {
          channelId: data._id,
          channelName: meetingName || data.channelName,
          hasChannelName: !!meetingName,
          meetingId: meetingRef.id,
          channel: channelData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          endedAt: null,
          ended: false,
          host: user,
          isVoiceCall,
          participants: data.participants,
          participantsId: data.participantsId,
          meetingParticipants: [],
        }
      );
      return callback(null, data);
    } catch(e) {
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
        message: `${user.firstName} deleted a message`,
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

  const joinMeeting = useCallback(async (meetingId, uid, isFocused = false) => {
    const data = {
      isFocused,
      uid,
      ...user,
    };
    await updateDoc(doc(firestore.current, "meetings", meetingId), {
      meetingParticipants: arrayUnion(data)
    });
  }, [user]);

  const endMeeting = useCallback(async (meetingId) => {
    await updateDoc(doc(firestore.currnet, 'meetings', meetingId), {
      updatedAt: serverTimestamp(),
      endedAt: serverTimestamp(),
      ended: true,
    })
  }, [user]);

  return {
    initializeFirebaseApp,
    deleteFirebaseApp,
    channelSubscriber,
    messagesSubscriber,
    channelMeetingSubscriber,
    userActiveMeetingSubscriber,
    userMeetingSubscriber,
    meetingSubscriber,
    memberMeetingSubscriber,
    createChannel,
    createMeeting,
    initiateMeeting,
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
    endMeeting,
  }
}

export default useFirebase;