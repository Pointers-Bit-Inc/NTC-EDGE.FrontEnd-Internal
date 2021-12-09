import React, { useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import lodash from 'lodash';
import useFirebase from 'src/hooks/useFirebase';
import { checkSeen } from 'src/utils/formatting';
import { setMessages, updateMessages, removeMessages } from 'src/reducers/channel/actions';
import ChatList from '@components/organisms/chat/list';

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

  const onFetchMessages = useCallback(() => {
    setLoading(true);
    getMessages(channelId, (err:any, snapshot:any) => {
      setLoading(false);
      if(err) {
        return setError(!!err);
      }
      const data:any = [];
      snapshot.forEach((doc:any) => {
        const d = doc.data();
        d._id = doc.id;
        data.push(d);
      });
      if (data && data[0]) {
        const seen = checkSeen(data[0].seen, user);
        if (!lodash.size(seen)) {
          seenMessage(channelId, data[0]._id);
        }
      } else {
        seenMessage(channelId, null);
      }
      if (data) {
        dispatch(setMessages(data));
      }
    });
  }, [channelId]);

  useEffect(() => {
    onFetchMessages();
    const unsubscriber = messagesSubscriber(channelId, (querySnapshot:any) => {
      querySnapshot.docChanges().forEach((change:any) => {
        const data = change.doc.data();
        data._id = change.doc.id;
        seenMessage(channelId, data._id);
        if (change.type === 'modified') {
          dispatch(updateMessages(data));
        }
        if (change.type === 'removed') {
          dispatch(removeMessages(data._id));
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
