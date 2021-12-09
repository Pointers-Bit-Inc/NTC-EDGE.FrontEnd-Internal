import React, { useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import lodash from 'lodash';
import useFirebase from 'src/hooks/useFirebase';
import ChatList from '@components/organisms/chat/list';
import FileList from '@components/organisms/chat/files';
import {
  ArrowLeftIcon,
  PhoneIcon,
  VideoIcon,
  SendIcon,
  MenuIcon,
  PlusIcon,
  CameraIcon,
  MicIcon,
} from '@components/atoms/icon';
import Text from '@components/atoms/text';
import GroupImage from '@components/molecules/image/group';
import { InputField } from '@components/molecules/form-fields';
import { ChatBubble, GroupBubble } from '@components/molecules/list-item';
import { outline, primaryColor, text, button } from '@styles/color';
import { getChannelName } from 'src/utils/formatting';
import { setMessages, updateMessages, removeMessages } from 'src/reducers/channel/actions';
import InputStyles from 'src/styles/input-style';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    paddingBottom: 0,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  bubbleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 4,
  },
  keyboardAvoiding: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  outline: {
    borderRadius: 10,
  },
  input: {
    fontSize: 16,
  },
  plus: {
    backgroundColor: button.primary,
    borderRadius: 26,
    width: 26,
    height: 26,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const ChatView = ({ navigation, route }:any) => {
  const layout = useWindowDimensions();
  const dispatch = useDispatch();
  const { channelId, isGroup, otherParticipants } = route.params;
  const user = useSelector((state:RootStateOrAny) => state.user);
  const messages = useSelector((state:RootStateOrAny) => {
    const { messages } = state.channel;
    const sortedMessages = lodash.orderBy(messages, 'updatedAt', 'desc');
    return sortedMessages;
  });
  const { getMessages, seenMessage, sendMessage, messagesSubscriber } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'files', title: 'Files' },
  ]);

  const ChatRoute = () => (
    <ChatList
      user={user}
      messages={messages}
      isGroup={isGroup}
      loading={loading}
      error={error}
    />
  );
  
  const FileRoute = () => (<FileList />);
  
  const renderScene = SceneMap({
    chat: ChatRoute,
    files: FileRoute,
  });

  const onSendMessage = useCallback(() => {
    sendMessage(channelId, inputText);
    setInputText('');
  }, [channelId, inputText])

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
        const seen = lodash.find(data[0].seen, s => s._id === user._id);
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

  const onBack = () => navigation.goBack();

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

  const renderTabBar = props => (
    <TabBar
      {...props}
      labelStyle={{ color: text.default }}
      indicatorStyle={{ backgroundColor: outline.primary }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route, focused, color }) => (
        <Text
          color={color}
          size={16}
          weight={focused ? '600' : 'normal'}
        >
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.header, styles.horizontal]}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeftIcon
            size={22}
          />
        </TouchableOpacity>
        <View style={{ paddingLeft: 10 }}>
          <GroupImage
            participants={otherParticipants}
            size={50}
            textSize={18}
          />
        </View>
        <View style={styles.info}>
          <Text
            color={text.default}
            weight={'500'}
            size={18}
            numberOfLines={1}
          >
            {getChannelName(route.params)}
          </Text>
        </View>
        <TouchableOpacity>
          <View style={{ paddingRight: 5 }}>
            <PhoneIcon
              size={20}
              color={text.primary}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ paddingHorizontal: 8 }}>
            <VideoIcon
              size={20}
              color={text.primary}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={{ paddingLeft: 5 }}>
            <MenuIcon
              type={'more'}
              size={22}
              color={text.default}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: layout.width }}
          renderTabBar={renderTabBar}
        />
        {/*  */}
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.keyboardAvoiding}>
          <TouchableOpacity>
            <View style={styles.plus}>
              <PlusIcon
                color="white"
                size={16}
              />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <InputField
              placeholder={'Type a message'}
              inputStyle={[InputStyles.text, styles.input]}
              outlineStyle={[InputStyles.outlineStyle, styles.outline]}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={onSendMessage}
              returnKeyType={'send'}
            />
          </View>
          <TouchableOpacity>
            <View style={{ paddingLeft: 15 }}>
              <CameraIcon
                size={22}
                color={text.default}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ paddingLeft: 15 }}>
              <MicIcon
                size={20}
                color={text.default}
              />
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatView
