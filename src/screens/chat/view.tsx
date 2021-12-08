import React, { useState, useCallback, useEffect } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useSelector } from 'react-redux';
import useFirebase from 'src/hooks/useFirebase';
import { ArrowLeftIcon, VideoIcon, SendIcon } from '@components/atoms/icon';
import Text from '@components/atoms/text';
import { InputField } from '@components/molecules/form-fields';
import { ChatBubble, GroupBubble } from '@components/molecules/list-item';
import { outline, primaryColor, text } from '@styles/color';
import { getChannelName } from 'src/utils/formatting';
import InputStyles from 'src/styles/input-style';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomColor: outline.default,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    paddingVertical: 4,
  },
  keyboardAvoiding: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  }
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
        No messages yet
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
            {getChannelName(route.params, user)}
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.keyboardAvoiding}>
          <View style={{ flex: 1 }}>
            <InputField
              placeholder={'Type a message'}
              inputStyle={InputStyles.text}
              outlineStyle={InputStyles.outlineStyle}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={onSendMessage}
              returnKeyType={'send'}
            />
          </View>
          <TouchableOpacity onPress={onSendMessage}>
            <View style={{ paddingLeft: 10 }}>
              <SendIcon
                size={32}
                color={primaryColor}
              />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatView
