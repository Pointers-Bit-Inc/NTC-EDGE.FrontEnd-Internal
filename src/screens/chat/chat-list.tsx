import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import lodash from 'lodash';
import useFirebase from 'src/hooks/useFirebase';
import { checkSeen } from 'src/utils/formatting';
import { setMessages, addMessages, updateMessages, removeMessages } from 'src/reducers/channel/actions';
import ChatList from '@components/organisms/chat/list';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

const List = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const messages = useSelector((state:RootStateOrAny) => {
    const { messages } = state.channel;
    const sortedMessages = lodash.orderBy(messages, 'updatedAt', 'desc');
    return sortedMessages;
  });
  const { channelId, isGroup, otherParticipants } = useSelector(
    (state:RootStateOrAny) => state.channel.selectedChannel
  );
  const { getMessages, seenMessage, messagesSubscriber } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscriber = messagesSubscriber(channelId, (querySnapshot:FirebaseFirestoreTypes.QuerySnapshot) => {
      setLoading(false);
      querySnapshot.docChanges().forEach((change:any) => {
        const data = change.doc.data();
        data._id = change.doc.id;
        switch(change.type) {
          case 'added': {
            const hasSave = lodash.find(messages, (msg:any) => msg._id === data._id);
            const seen = checkSeen(data.seen, user);
            if (!seen) {
              seenMessage(channelId, data._id);
            }
            if (!hasSave) {
              dispatch(addMessages(data));
            }
            return;
          }
          case 'modified': {
            const seen = checkSeen(data.seen, user);
            if (!seen) {
              seenMessage(channelId, data._id);
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

  return (
    <ChatList
      user={user}
      messages={messages}
      isGroup={isGroup}
      loading={loading}
      error={error}
    />
  )
}

export default List
