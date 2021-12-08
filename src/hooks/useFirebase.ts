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
} from 'firebase/firestore';
import lodash from 'lodash';
import { firebaseConfig } from "src/services/config";

const useFirebase = (user:any) => {
  const firestore:any = useRef(
    getApps().length === 0 ?
    null :
    getFirestore()
  );
  const firebaseApp:any = useRef();
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);

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

  const useExample = useCallback(async () => {
    await setDoc(doc(firestore.current, "characters", "mario"), {
      employment: "plumber",
      outfitColor: "red",
      specialAttack: "fireball"
    });
  }, []);

  const _getParticipants = (participants:any) => ([
    ...participants,
    user,
  ]);

  const _getInitialChannelName = (participants = [], isGroup = false) => {
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

  const fetchChannelWithParticipants = useCallback(async (participants, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "channels"),
      where(
        'participants',
        'array-contains-any',
        participants
      )
    );
    const docRef = await getDocs(q);
    const result:any = [];
    await docRef.forEach((doc) => {
      console.log('doc.data()', doc.data());
      result.push(doc.data());
      return doc.data();
    });
    return callback(result);
  }, []);

  const fetchChannelWithParticipantId = useCallback(async (participantId, callback = () => {}) => {
    const q = query(
      collection(firestore.current, "channels"),
      where(
        'participants',
        'array-contains',
        { _id: participantId }
      )
    );
    const docRef = await getDocs(q);
    const result:any = [];
    await docRef.forEach((doc) => {
      console.log('doc.data()', doc.data());
      result.push(doc.data());
      return doc.data();
    });
    return callback(result);
  }, []);

  const getChannelRealtime = () => {
    const q = query(
      collection(firestore.current, "channels"),
      where(
        'participantsId',
        'array-contains',
        user._id,
      ),
      orderBy('updatedAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data:any = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        d._id = doc.id;
        d.channelId = doc.id;
        data.push(d);
      });
      setChannels(data);
    });
  
    return unsubscribe;
  }

  const getMessagesRealtime = (channelId:string) => {
    const q = query(
      collection(firestore.current, "messages"),
      where(
        'channelId',
        '==',
        channelId,
      ),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data:any = [];
      querySnapshot.forEach((doc) => {
        const d = doc.data();
        d._id = doc.id;
        data.push(d);
      });
      if (data[0]) {
        const seen = lodash.find(data[0].seen, s => s._id === user._id);
        if (!lodash.size(seen)) {
          seenMessage(channelId, data[0]._id);
        }
      }
      setMessages(data);
    });
  
    return unsubscribe;
  }

  const createChannel = useCallback(async (participants, callback = () => {}) => {
    try {
      const participantsWithUser:any = _getParticipants(participants);
      const isGroup = lodash.size(participantsWithUser) > 2;
      const addRef = await addDoc(collection(firestore.current, "channels"), {
        channelName: _getInitialChannelName(participantsWithUser, isGroup),
        participantsId: _getParticipantsId(participantsWithUser),
        participants: participantsWithUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastMessage: {
          message: 'New chat created.',
          sender: user,
        },
        isGroup,
        seen: [user],
      });
      const docRef = await getDoc(doc(firestore.current, "channels", addRef.id));
      const data:any = docRef.data();
      data._id = addRef.id;
      data.channelId = addRef.id;
      return callback(null, data);
    } catch(e) {
      console.log('ERROR', e);
      return callback(e);
    }
  }, []);

  const sendMessage = useCallback(async (channelId, message) => {
    await addDoc(collection(firestore.current, "messages"), {
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      message,
      channelId,
      seen: [user],
      sender: user,
    });
    await updateDoc(doc(firestore.current, "channels", channelId), {
      updatedAt: serverTimestamp(),
      lastMessage: {
        message: message,
        sender: user,
      },
      seen: [user],
    });
  }, []);

  const seenMessage = useCallback(async (channelId, messageId) => {
    await updateDoc(doc(firestore.current, "messages", messageId), {
      seen: arrayUnion(user),
    });
    await updateDoc(doc(firestore.current, "channels", channelId), {
      seen: arrayUnion(user),
    });
  }, []);

  return {
    channels,
    messages,
    initializeFirebaseApp,
    deleteFirebaseApp,
    getChannelRealtime,
    getMessagesRealtime,
    createChannel,
    sendMessage,
  }
}

export default useFirebase;