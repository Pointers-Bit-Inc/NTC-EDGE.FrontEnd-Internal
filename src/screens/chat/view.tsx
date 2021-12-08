import React, { useState, useCallback, useEffect } from 'react'
import { SafeAreaView, StyleSheet, View, TouchableOpacity, FlatList } from 'react-native'
import { useSelector } from 'react-redux';
import useFirebase from 'src/hooks/useFirebase';
import { ArrowLeftIcon, VideoIcon } from '@components/atoms/icon';
import Text from '@components/atoms/text';
import { InputField } from '@components/molecules/form-fields';
import { ChatBubble, GroupBubble } from '@components/molecules/list-item';
import { outline, text } from '@styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  bubbleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
});

const ChatView = ({ navigation, route }:any) => {
  const user = useSelector(state => state.user);
  const { sendMessage, getMessagesRealtime, messages } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [inputText, setInputText] = useState('');
  const { channelId, channelName, isGroup } = route.params;
  const onSendMessage = useCallback(() => {
    sendMessage(channelId, inputText);
    setInputText('');
  }, [channelId, inputText])

  const onBack = () => navigation.goBack();

  useEffect(() => {
    const unsubscriber = getMessagesRealtime(channelId);
    return () => unsubscriber();
  }, [])

  const emptyComponent = () => (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        transform: [
          {
            scaleY: -1
          }
        ]
      }}>
      <Text
        color={text.default}
        size={14}
      >
        No messages
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
              maxWidth={'60%'}
            />
          ) : (
            <ChatBubble
              message={item.message}
              isSender={isSender}
              maxWidth={'60%'}
            />
          )
        }
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, styles.horizontal]}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeftIcon
            size={22}
          />
        </TouchableOpacity>
        <View style={styles.info}>
          <Text
            weight={'700'}
            size={16}
            numberOfLines={1}
          >
            {channelName}
          </Text>
        </View>
        <TouchableOpacity>
          <VideoIcon
            size={28}
          />
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          inverted={true}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item:any) => item._id}
          ListEmptyComponent={emptyComponent}
        />
      </View>
      <InputField
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={onSendMessage}
      />
    </SafeAreaView>
  )
}

export default ChatView
