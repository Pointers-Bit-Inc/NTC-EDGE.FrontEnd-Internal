import React, { useRef, useState, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
  StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TabView, TabBar, SceneMap } from 'react-native-tab-view';
import { useDispatch, useSelector, RootStateOrAny } from 'react-redux';
import useFirebase from 'src/hooks/useFirebase';
import ChatList from '@screens/chat/chat-list';
import FileList from '@components/organisms/chat/files';
import {
  ArrowLeftIcon,
  PhoneIcon,
  VideoIcon,
  MenuIcon,
  PlusIcon,
  CheckIcon,
  CameraIcon,
  MicIcon,
  SendIcon,
} from '@components/atoms/icon';
import Text from '@components/atoms/text';
import GroupImage from '@components/molecules/image/group';
import { InputField } from '@components/molecules/form-fields';
import { outline, text, button, primaryColor } from '@styles/color';
import { getChannelName } from 'src/utils/formatting';
import InputStyles from 'src/styles/input-style';
import {
  removeSelectedMessage
} from 'src/reducers/channel/actions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 15,
    paddingTop: 40,
    backgroundColor: primaryColor
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
  },
  circle: {
    backgroundColor: button.primary,
    borderRadius: 28,
    width: 28,
    height: 28,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const ChatRoute = () => (<ChatList />);
const FileRoute = () => (<FileList />);
const renderScene = SceneMap({
  chat: ChatRoute,
  files: FileRoute,
});

const ChatView = ({ navigation, route }:any) => {
  const dispatch = useDispatch();
  const inputRef:any = useRef(null);
  const layout = useWindowDimensions();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { channelId, otherParticipants } = useSelector(
    (state:RootStateOrAny) => state.channel.selectedChannel
  );
  const { selectedMessage } = useSelector((state:RootStateOrAny) => state.channel);
  const { sendMessage, editMessage } = useFirebase({
    _id: user._id,
    name: user.name,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    image: user.image,
  });
  const [inputText, setInputText] = useState('');
  const [index, setIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [routes] = useState([
    { key: 'chat', title: 'Chat' },
    { key: 'files', title: 'Files' },
  ]);

  const onSendMessage = useCallback(() => {
    if (selectedMessage._id) {
      editMessage(selectedMessage._id, inputText);
      inputRef.current?.blur();
      dispatch(removeSelectedMessage())
    } else {
      sendMessage(channelId, inputText);
      inputRef.current?.blur();
      setInputText('');
    }
  }, [channelId, inputText])

  const onBack = () => navigation.goBack();

  const renderTabBar = (props:any) => (
    <TabBar
      {...props}
      labelStyle={{ color: text.default }}
      indicatorStyle={{ backgroundColor: outline.primary }}
      style={{ backgroundColor: 'white' }}
      renderLabel={({ route, focused, color }) => (
        <Text
          color={focused ? text.primary : color}
          size={16}
          weight={focused ? '600' : 'normal'}
        >
          {route.title}
        </Text>
      )}
    />
  );

  useEffect(() => {
    setInputText(selectedMessage?.message || '');
    inputRef.current?.blur();
  }, [selectedMessage])

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={[styles.header, styles.horizontal]}>
        <TouchableOpacity onPress={onBack}>
          <ArrowLeftIcon
            type='arrow-left'
            color={'white'}
            size={18}
          />
        </TouchableOpacity>
        <View style={{ paddingLeft: 15 }}>
          <GroupImage
            participants={otherParticipants}
            size={50}
            textSize={18}
          />
        </View>
        <View style={styles.info}>
          <Text
            color={'white'}
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
              color={'white'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dial',
          {
            options: {
              isMute: true,
              isVideoEnable: true,
            }
          })
        }>
          <View style={{ paddingHorizontal: 8 }}>
            <VideoIcon
              size={20}
              color={'white'}
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
              ref={inputRef}
              placeholder={'Type a message'}
              inputStyle={[InputStyles.text, styles.input]}
              outlineStyle={[InputStyles.outlineStyle, styles.outline]}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={onSendMessage}
              returnKeyType={'send'}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </View>
          {
            !!selectedMessage._id ? (
              <TouchableOpacity
                onPress={() => {
                  editMessage(selectedMessage._id, inputText);
                  dispatch(removeSelectedMessage())
                }}
              >
                <View style={styles.circle}>
                  <CheckIcon
                    type='check1'
                    color="white"
                    size={16}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              isFocused ? (
                <TouchableOpacity
                  onPress={onSendMessage}
                >
                  <View style={{ marginLeft: 15 }}>
                    <SendIcon
                      color={text.primary}
                      size={28}
                    />
                  </View>
                </TouchableOpacity>
              ) : (
                <>
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
                </>
              )
            )
          }
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default ChatView
