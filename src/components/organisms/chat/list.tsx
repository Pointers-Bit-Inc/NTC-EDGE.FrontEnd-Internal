import React, { FC } from 'react'
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import lodash from 'lodash';
import Text from '@components/atoms/text';
import { chatSameDate } from 'src/utils/formatting'; 
import { ChatBubble, GroupBubble } from '@components/molecules/list-item';
import { text } from 'src/styles/color';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  bubbleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 4,
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
  ...otherProps
}) => {
  const emptyComponent = () => (
    <View style={styles.empty}>
      <Text
        color={error ? text.error : text.default}
        size={14}
      >
        {error? 'Unable to fetch messages' : 'No messages yet'}
      </Text>
    </View>
  )

  const renderItem = ({ item, index }:any) => {
    const isSender = item.sender._id === user._id;
    const isSameDate = chatSameDate(messages[index + 1]?.createdAt?.seconds, item.createdAt?.seconds);
    const seenByOthers = lodash.reject(
      item.seen,
      (seen:any) =>
        seen._id === item.sender._id ||
        seen._id === user._id
    );
    const seenByEveryone = lodash.size(item.seen) - 1 === lodash.size(participants);
    return (
      <View style={[styles.bubbleContainer, { alignItems: isSender ? 'flex-end' : 'flex-start' }]}>
        {
          isGroup ? (
            <GroupBubble
              message={item.message}
              isSender={isSender}
              sender={item.sender}
              seenByOthers={seenByOthers}
              seenByEveryone={seenByEveryone}
              showSeen={lastMessage?.messageId === item._id}
              showDate={!isSameDate}
              createdAt={item.createdAt}
              maxWidth={width * 0.6}
              onLongPress={() => showOption(item)}
              deleted={item.deleted}
              unSend={item.unSend}
              edited={item.edited}
            />
          ) : (
            <ChatBubble
              message={item.message}
              isSender={isSender}
              sender={item.sender}
              createdAt={item.createdAt}
              seenByOthers={seenByOthers}
              seenByEveryone={seenByEveryone}
              showSeen={lastMessage?.messageId === item._id}
              showDate={!isSameDate}
              maxWidth={width * 0.6}
              onLongPress={() => showOption(item)}
              deleted={item.deleted}
              unSend={item.unSend}
              edited={item.edited}
            />
          )
        }
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
      showsVerticalScrollIndicator={false}
      inverted={true}
      data={error ? [] : messages}
      renderItem={renderItem}
      keyExtractor={(item:any) => item._id}
      ListEmptyComponent={emptyComponent}
      ListFooterComponent={() => <View style={{ height: 15 }} />}
      {...otherProps}
    />
  )
}

export default ChatList
