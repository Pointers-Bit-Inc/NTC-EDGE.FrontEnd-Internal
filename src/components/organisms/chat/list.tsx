import React, { FC } from 'react'
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import lodash from 'lodash';
import Text from '@components/atoms/text';
import { chatSameDate } from 'src/utils/formatting'; 
import { ChatBubble, GroupBubble } from '@components/molecules/list-item';
import { text } from 'src/styles/color';
import { RFValue } from 'react-native-responsive-fontsize';
import NoConversationIcon from "@assets/svg/noConversations";
import {Regular} from "@styles/font";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  bubbleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(5),
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
        seenByOthers = lodash.reject(seenByOthers, p =>
          lodash.find(latestSeen, l => l._id === p._id)
        );
      }
    }
    let seenByOthersCount = lodash.size(seenByOthers) + (isSender ? 0 : 1);
    const seenByEveryone = seenByOthersCount === lodash.size(participants);
    const showSeen = lastMessage?._id === item._id ||
      latestSeenSize === 0 ||
      seenByOthersCount > 0 && seenByOthersCount < lodash.size(participants);
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
              showSeen={showSeen}
              isSeen={lodash.size(item.seen) - 1 > 0}
              showDate={!isSameDate}
              createdAt={item.createdAt}
              maxWidth={width * 0.6}
              onLongPress={() => showOption(item)}
              deleted={item.deleted}
              unSend={item.unSend}
              edited={item.edited}
              system={item.system}
              delivered={item.delivered}
            />
          ) : (
            <ChatBubble
              message={item.message}
              isSender={isSender}
              sender={item.sender}
              createdAt={item.createdAt}
              seenByOthers={seenByOthers}
              seenByEveryone={seenByEveryone}
              showSeen={showSeen}
              isSeen={lodash.size(item.seen) - 1 > 0}
              showDate={!isSameDate}
              maxWidth={width * 0.6}
              onLongPress={() => showOption(item)}
              deleted={item.deleted}
              unSend={item.unSend}
              edited={item.edited}
              system={item.system}
              delivered={item.delivered}
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
      <>
        <FlatList
            showsVerticalScrollIndicator={false}
            inverted={true}
            data={error ? [] : messages}
            renderItem={renderItem}
            keyExtractor={(item:any) => item._id}
            ListEmptyComponent={emptyComponent}
            ListFooterComponent={() => <View style={{ height: 15 }} />}
            ListHeaderComponent={() => <View style={{ height: 15 }} />}
            {...otherProps}
        />
      </>

  )
}

export default ChatList
