import React, { FC, useCallback, useEffect, useRef } from 'react'
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator, Platform } from 'react-native'
import lodash from 'lodash';
import Text from '@components/atoms/text';
import { chatSameDate } from '@/src/utils/formatting'; 
import { ChatBubble, GroupBubble, PendingBubble } from '@components/molecules/list-item';
import { text } from '@/src/styles/color';
import IParticipants from '@/src/interfaces/IParticipants';
import { fontValue } from '@components/pages/activities/fontValue';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  bubbleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: fontValue(15),
    paddingTop: 3,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    transform: [
      {
        scaleY: -1
      }
    ]
  }
})

interface Props {
  messages?: any;
  user?: any;
  isGroup: boolean;
  loading: boolean;
  error: boolean;
  participants?: any;
  lastMessage?: any;
  showOption?: any;
  onSendMessage?: any;
  onSendFile?: any;
  onPreview?: any;
  onCallAgain?: any;
  [x: string]: any;
}

const ChatList: FC<Props> = ({
  messages,
  user,
  isGroup,
  loading,
  error,
  participants = [],
  lastMessage,
  showOption = () => {},
  onSendMessage = () => {},
  onSendFile = () => {},
  onPreview = () => {},
  onCallAgain = () => {},
  ...otherProps
}) => {
  const ref:any = useRef(null);

  useEffect(() => {
    let scrollNode = ref.current && ref.current.getScrollableNode();
    if (!scrollNode) return;
    const listener = scrollNode.addEventListener("wheel", (e:any) => {
      scrollNode.scrollTop -= e.deltaY;
      e.preventDefault();
    });
    if(ref.current?.setNativeProps){
      ref.current?.setNativeProps({ style: { transform: "translate3d(0,0,0) scaleY(-1)" } });
    }

    return () => scrollNode?.removeEventListener("wheel", listener);
  });

  const emptyComponent = () => (
    <View style={styles.empty}>
      <Text
        color={error ? text.error : text.default}
        size={14}
      >
        {error? 'Unable to fetch messages' : 'No messages yet'}
      </Text>
    </View>
  );

  const listHeaderComponent = () => <View style={{ height: 15 }} />;

  const renderItem = ({ item, index }:any) => {
    if (!lodash.size(item.sender)) {
      return (
        <View style={[styles.bubbleContainer, { alignItems: 'flex-end' }]}>
          <PendingBubble
            channelId={item.channelId}
            messageId={item._id}
            message={item.message}
            messageType={item.messageType}
            groupName={item.groupName}
            participants={item.participants}
            attachment={item.attachment}
            error={item.error}
            onSendMessage={onSendMessage}
            onSendFile={onSendFile}
            onLongPress={() => showOption(item)}
            onPreview={() => onPreview(item)}
          />
        </View>
      )
    }
    if (!item.isGroup && !item.message && item.system) {
      return;
    }
    const isSender = item.sender._id === user._id;
    const isSameDate = chatSameDate(messages[index + 1]?.createdAt, item.createdAt);
    const latestSeen = messages && messages[index - 1] ? messages[index - 1].seen : [];
    const latestSeenSize = lodash.size(latestSeen) - 1;
    let seenByOthers = lodash.reject(
      item.seen,
      (seen:any) =>
        seen._id === item.sender._id ||
        seen._id === user._id
    );
    if (latestSeenSize > 0) {
      if (latestSeenSize < lodash.size(participants)) {
        seenByOthers = lodash.reject(seenByOthers, (p:IParticipants) =>
          lodash.find(latestSeen, (l:IParticipants) => l._id === p._id)
        );
      }
    }
    let seenByOthersCount = lodash.size(seenByOthers) + (isSender ? 0 : 1);
    const seenByEveryone = seenByOthersCount === lodash.size(participants);
    const showSeen = lastMessage?._id === item._id ||
      latestSeenSize === 0 ||
      seenByOthersCount > 0 && seenByOthersCount < lodash.size(participants);
    let specialMessage = item.type === 'newmeeting';
    
    if (Platform.OS === 'web') {
      specialMessage = item.type === 'newmeeting' ||
      item.type === 'callended' ||
      item.type === 'leave' ||
      item.type === 'removed' ||
      item.type === 'added' ||
      item.type === 'newroom' ||
      (item.type === 'text' && item.system);
    }

    return (
      <View style={[styles.bubbleContainer, { alignItems: (isSender && !specialMessage) ? 'flex-end' : 'flex-start' }]}>
        <ChatBubble
          message={item.message}
          messageType={item.type}
          attachment={item.attachment}
          isSender={isSender}
          sender={item.sender}
          createdAt={item.createdAt}
          seenByOthers={seenByOthers}
          seenByEveryone={seenByEveryone}
          showSeen={showSeen}
          isSeen={lodash.size(item.seen) - 1 > 0}
          showDate={!isSameDate}
          maxWidth={width * 0.6}
          onLongPress={(type?:string) => showOption(item, type)}
          deleted={item.deleted}
          unSend={item.unSend}
          edited={item.edited}
          system={item.system}
          delivered={item.delivered}
          onPreview={() => onPreview(item)}
          meeting={item.meeting}
          onCallAgain={onCallAgain}
          user={user}
          isGroup={isGroup}
        />
      </View>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size={'small'} color={text.default} />
        <Text color={text.default}>Fetching messages...</Text>
      </View>
    )
  }
  return (
    <FlatList
      ref={ref}
      showsVerticalScrollIndicator={Platform.OS === 'web'}
      inverted={true}
      data={error ? [] : messages}
      renderItem={renderItem}
      keyExtractor={(item:any) => item._id}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={() => <View style={{ height: 15 }} />}
      ListHeaderComponent={listHeaderComponent}
      {...otherProps}
    />
  )
}

export default ChatList
