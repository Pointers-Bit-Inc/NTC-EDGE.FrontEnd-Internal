import React, { FC } from 'react'
import { View, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native'
import Text from '@components/atoms/text';
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
  [x: string]: any;
}

const ChatList: FC<Props> = ({
  messages,
  user,
  isGroup,
  loading,
  error,
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

  const renderItem = ({ item }:any) => {
    const isSender = item.sender._id === user._id;
    return (
      <View style={[styles.bubbleContainer, { alignItems: isSender ? 'flex-end' : 'flex-start' }]}>
        {
          isGroup ? (
            <GroupBubble
              message={item.message}
              isSender={isSender}
              sender={item.sender}
              maxWidth={width * 0.6}
            />
          ) : (
            <ChatBubble
              message={item.message}
              isSender={isSender}
              maxWidth={width * 0.6}
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
      {...otherProps}
    />
  )
}

export default ChatList
