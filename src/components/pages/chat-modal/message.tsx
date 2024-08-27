import React, { useState, useEffect, useRef } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  View,
  TouchableOpacity,
  StatusBar,
  Platform
} from 'react-native'
import lodash from 'lodash';
import { outline, button, text } from '@styles/color';
import Text from '@atoms/text';
import ChatView from './view';
import { CloseIcon } from '@components/atoms/icon'
import { header } from '@styles/color';
import { Bold, Regular, Regular500 } from '@styles/font';
import useSignalr from 'src/hooks/useSignalr';
import { InputTags } from '@components/molecules/form-fields';
import AwesomeAlert from 'react-native-awesome-alerts';
import IParticipants from 'src/interfaces/IParticipants';
import { RootStateOrAny, useSelector } from 'react-redux';
import {fontValue as RFValue} from "@pages/activities/fontValue";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    zIndex: 999,
    backgroundColor: 'white'
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  input: {
    fontSize: RFValue(14),
    fontFamily: Regular,
    color: 'black',
    flex: 1,
  },
  outline: {
    borderWidth: 0,
    backgroundColor: '#EFF0F6',
    borderRadius: 10,
  },
  icon: {
    fontSize: RFValue(16),
    color: '#6E7191'
  },
  separator: {
    // height: StyleSheet.hairlineWidth,
    // width: width - 60,
    // alignSelf: 'flex-end',
    // backgroundColor: outline.default,
  },
  notSelected: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: button.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    height: RFValue(20),
    width: RFValue(20),
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: button.info,
    backgroundColor: button.info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTitle: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  outlineBorder: {
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  newGroupContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#EAEAF4',
    alignContent: 'center',
    justifyContent: 'space-between',
  },
  outlineText: {
    borderRadius: 10,
  },
  inputText: {
    fontSize: RFValue(16),
  },
  groupName: {
    height: undefined,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    marginBottom: -30,
    marginTop: 20,
    paddingHorizontal: 10
  },
  plus: {
    backgroundColor: button.info,
    borderRadius: RFValue(20),
    width: RFValue(20),
    height: RFValue(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    paddingLeft: Platform.OS === 'ios' ? 1 : 0,
    paddingTop: Platform.OS === 'ios' ? 1 : 0,
  },
  cancelText: {
    fontSize: RFValue(16),
    color: text.info,
    fontFamily: Regular500,
  },
  confirmText: {
    fontSize: RFValue(16),
    color: text.error,
    fontFamily: Regular500,
  },
  title: {
    color: '#14142B',
    textAlign: 'center',
    fontSize: RFValue(16),
    fontFamily: Regular500,
  },
  message: {
    color: '#4E4B66',
    textAlign: 'center',
    fontSize:RFValue(14),
    marginHorizontal: 15,
    marginBottom: 15,
    fontFamily: Regular,
  },
  content: {
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  }
});

const tagStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#D6D6D6',
  },
  container: {
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-start',
  },
  tag: {
    borderRadius: 10,
  },
  textTag: {
    color: header.default,
    fontFamily: Bold,
    fontSize: RFValue(14),
  },
  input: {
    backgroundColor: '#FFFFFF',
    color: header.default,
    fontSize: RFValue(14),
    fontFamily: Bold,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 1,
    marginTop: Platform.OS === 'ios'|| Platform.OS === 'web'  ? 0 : -2
  },
});

const MessageMember = ({ members = [], onClose = () => {}, onSubmit = () => {} }:any) => {
  const {
    createChannel,
    getChannelByParticipants,
  } = useSignalr();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const inputRef:any = useRef(null);
  const inputTagRef:any = useRef(null);
  const [nextLoading, setNextLoading] = useState(false);
  const [participants, setParticipants]:any = useState(members);
  const [searchText, setSearchText] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isGroup, setIsGroup] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<any>({});

  useEffect(() => {
    let unmount = false;
    setSelectedChannel({})
    if (participants) {
      getChannelByParticipants({ participants }, (err:any, res:any) => {
        if (!unmount) {
          if (res) {
            setSelectedChannel(res)
          }
          if (err) {
            console.log('ERROR', err);
          }
        }
      });
    }

    return () => {
      unmount = true;
    }
  }, [participants]);

  const onNext = (message:string, channelData = null) => {
    if (channelData) {
      onSubmit(channelData);
    } else {
      if (participants) {
        setNextLoading(true);
        const formData = new FormData();
        formData.append('name', groupName);
        formData.append('message', message);
        formData.append('participants', JSON.stringify(participants));
        createChannel(formData, (err:any, res:any) => {
          setNextLoading(false);
          if (res) {
            onSubmit(res);
          }
          if (err) {
            console.log('ERROR', err);
          }
        });
      }
    }
  }

  const onBeforeClose = () => {
    if (isGroup) {
      setGroupName('');
      setIsGroup(false);
      setParticipants([]);
      inputRef.current?.focus();
    } else {
      if (lodash.size(participants) > 1) {
        setShowAlert(true);
      } else {
        onClose();
      }
    }
  }

  const onConfirmPressed = () => {
    setShowAlert(false);
    onClose();
  }

  const onChangeTags = (tags:any) => {
    setParticipants(tags);
  };

  const renderTag = ({ tag, index, onPress, deleteTagOnPress, readonly }:any) => {
    return (
      <TouchableOpacity
        key={`${tag?._id}-${index}`}
        onPress={onPress}
        style={tagStyles.tag}>
        <Text style={tagStyles.textTag}>{tag?.firstName},</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.header}>
        <View style={[styles.horizontal, { paddingVertical: 5, marginHorizontal: 15 }]}>
          <View style={{ position: 'absolute', left: 0, zIndex: 999 }}>
            <TouchableOpacity onPress={onBeforeClose}>
              <CloseIcon
                type='close'
                size={RFValue(18)}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.titleContainer}>
            <Text
              color={header.default}
              size={16}
              style={{ fontFamily: Bold }}
            >
              New message
            </Text>
          </View>
          {
            lodash.size(participants) > 1 && isGroup && (
              <View style={{ position: 'absolute', right: 0, zIndex: 999 }}>
                <TouchableOpacity
                  disabled={!lodash.size(participants) || nextLoading}
                  onPress={() => onNext("")}
                >
                  {
                    nextLoading ? (
                      <ActivityIndicator color={text.default} size={'small'} />
                    ) : (
                      <Text
                        color={text.default}
                        size={14}
                        style={{ fontFamily: Regular500 }}
                      >
                        Create
                      </Text>
                    )
                  }
                </TouchableOpacity>
              </View>
            )
          }
        </View>
        <View style={{ marginBottom: 5, marginTop: 20 }}>
          <View style={{ flexDirection: 'row', alignContent: 'center', paddingHorizontal: 15, paddingTop: 10, marginBottom: 5 }}>
            <Text
              color={text.default}
              size={14}
              style={{ fontFamily: Regular }}
            >
              To:
            </Text>
            <View style={{ flex: 1, paddingLeft: 5, marginTop: Platform.OS === 'ios' || Platform.OS === 'web' ? 0 : -2 }}>
              <InputTags
                ref={inputTagRef}
                editable={false}
                deleteTagOnPress={false}
                containerStyle={tagStyles.container}
                initialTags={participants}
                initialText={searchValue}
                inputStyle={tagStyles.input}
                onChangeTags={onChangeTags}
                renderTag={renderTag}
                onChangeTextDebounce={setSearchValue}
                onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </View>
          </View>
        </View>
      </View>
      <ChatView
        channelId={selectedChannel?._id}
        otherParticipants={lodash.reject(selectedChannel.participants, (p:IParticipants) => p._id === user._id)}
        isGroup={selectedChannel.isGroup}
        groupName={groupName}
        lastMessage={selectedChannel.lastMessage}
        onNext={(message:string, data:any) => onNext(message, data)}
        participants={participants}
      />
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        contentContainerStyle={{ borderRadius: 15 }}
        title={'Discard group?'}
        titleStyle={styles.title}
        message={"Are you sure you would like to discard this group? your changes won't be saved"}
        messageStyle={styles.message}
        contentStyle={styles.content}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelButtonColor={'white'}
        confirmButtonColor={'white'}
        cancelButtonTextStyle={styles.cancelText}
        confirmButtonTextStyle={styles.confirmText}
        actionContainerStyle={{ justifyContent: 'space-around' }}
        cancelText="Cancel"
        confirmText="Discard"
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={onConfirmPressed}
      />
    </View>
  )
}

export default MessageMember
