import React, { useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '@components/atoms/text'
import { Regular, Regular500 } from '@styles/font'
import { ArrowLeftIcon, NewMeetIcon, NewPenIcon, NewPhoneIcon, ToggleIcon } from '@components/atoms/icon'
import { RFValue } from 'react-native-responsive-fontsize'
import AddParticipantsIcon from '@components/atoms/icon/new-add-participants'
import LinkIcon from '@components/atoms/icon/link'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import lodash from 'lodash';
import IParticipants from 'src/interfaces/IParticipants';
import { getChannelName } from 'src/utils/formatting';
import { ContactItem } from '@components/molecules/list-item'
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal'
import CreateMeeting from '@components/pages/chat-modal/meeting';
import { outline, text } from '@styles/color'
import AwesomeAlert from 'react-native-awesome-alerts'
import useApi from 'src/services/api'
import Loading from '@components/atoms/loading'
import { addChannel, removeChannel, removeSelectedMessage, setMessages, setSelectedChannel, updateChannel } from 'src/reducers/channel/actions'
import { setMeeting, setOptions } from 'src/reducers/meeting/actions'
import AddParticipants from '@components/pages/chat-modal/add-participants'
import { InputField } from '@components/molecules/form-fields'
import useSignalr from 'src/hooks/useSignalr'
import MessageMember from '@components/pages/chat-modal/message'
const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    paddingHorizontal: 10,
    paddingTop: 30,
    paddingBottom: 5,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
    backgroundColor: 'white'
  },
  title: {
    fontFamily: Regular500,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: Regular,
    textAlign: 'center'
  },
  buttonContainer: {
    padding: 30,
    paddingBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row', 
    backgroundColor: 'white'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  muteChatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
  },
  toggleDefault: {
    transform: [{ scaleX: -1 }],
    color: '#A0A3BD',
  },
  toggleActive: {
    color: '#610BEF',
  },
  participantsContainer: {
    padding: 20,
  },
  smallCircle: {
    width: 30,
    height: 30,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7
  },
  footerContainer: {
    padding: 20,
  },
  bar: {
    height: 15,
    width: 35,
    borderRadius: 4,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: RFValue(16),
    color: '#DC2626',
    fontFamily: Regular500,
  },
  confirmText: {
    fontSize: RFValue(16),
    color: text.info,
    fontFamily: Regular500,
  },
  titleMessage: {
    color: '#14142B',
    textAlign: 'center',
    fontSize: RFValue(18),
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
  },
  loading: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    position: 'absolute',
    zIndex: 999,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlineText: {
    borderRadius: 10,
  },
  inputText: {
    fontSize: RFValue(16),
    textAlign: 'center',
  },
  groupName: {
    height: undefined,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: 'white',
    marginBottom: -25,
    marginTop: -5,
    paddingHorizontal: 0
  },
})

const Participants = ({ navigation }) => {
  const dispatch = useDispatch();
  const {
    leaveChannel,
  } = useSignalr();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const api = useApi(user.sessionToken);
  const { _id, otherParticipants = [], participants = [], hasRoomName = false, name = '', isGroup = false, muted = false, author = {} } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;
      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, (p:IParticipants) => p._id === user._id);
      selectedChannel.muted = !!lodash.find(selectedChannel.participants, (p:IParticipants) => p._id === user._id && p.muted);
      return selectedChannel;
    }
  );
  const { inTheMeeting = [], othersInvited = [] } = useSelector((state:RootStateOrAny) => {
    const { meeting = {} } = state.meeting;
    const inTheMeeting = lodash.filter(meeting.participants, (p:IParticipants) => p.status === 'joined');
    const othersInvited = lodash.filter(meeting.participants, (p:IParticipants) => p.status !== 'joined');
    return {
      inTheMeeting,
      othersInvited,
    }
  });
  const [isVideoEnable, setIsVideoEnable] = useState(false);
  const [muteChat, setMuteChat] = useState(muted);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState({
    title: '',
    message: '',
    cancel: '',
    confirm: '',
    type: '',
  });
  const [selectedParticipant, setSelectedParticipant] = useState<any>({});
  const [groupName, setGroupName] = useState(name || '');
  const [editName, setEditName] = useState(false);
  const modalRef = useRef<BottomModalRef>(null);
  const participantModal = useRef<BottomModalRef>(null);
  const optionModalRef = useRef<BottomModalRef>(null);
  const newMessageModalRef = useRef<BottomModalRef>(null);
  const meetingModalRef = useRef<BottomModalRef>(null);
  const groupNameRef:any = useRef(null);

  useEffect(() => {
    if (editName) {
      groupNameRef.current?.focus();
    }
  }, [editName]);

  const isAdmin = () => {
    const participant:IParticipants = lodash.find(participants, (p:IParticipants) => p._id === user._id);
    
    return participant?.isAdmin;
  }

  const isHost = (item:any = {}) => {
    return item?._id === author._id;
  }

  const addAdmin = () => {
    optionModalRef.current?.close();
    setLoading(true);
    api.post(`/rooms/${_id}/add-admin?participantId=${selectedParticipant._id}`)
    .then((res) => {
      setLoading(false);
      if(res.data) {
        dispatch(updateChannel(res.data));
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert', e?.message || 'Something went wrong.')
    });
  }

  const alertConfirm = () => {
    if (alertData.type === 'remove') removeMember();
    else if (alertData.type === 'delete') leaveChat();
    else if (alertData.type === 'clear') clearChat();
  }

  const leaveChat = () => {
    setShowAlert(false);
    setLoading(true);
    leaveChannel(_id, (err, res) => {
      setLoading(false);
      if (res) {
        dispatch(removeChannel(res));
        navigation.navigate('Chat');
      }
      if (err) {
        Alert.alert('Alert', err?.message || 'Something went wrong.')
      }
    })
  }

  const removeMember = () => {
    setShowAlert(false);
    setLoading(true);
    api.post(`/rooms/${_id}/remove-member?participantId=${selectedParticipant._id}`)
    .then((res) => {
      setLoading(false);
      if(res.data) {
        dispatch(updateChannel(res.data));
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert', e?.message || 'Something went wrong.')
    });
  }

  const addMembers = (addedMembers:any) => {
    setShowAlert(false);
    setLoading(true);
    api.post(`/rooms/${_id}/add-members`, {
      participants: addedMembers
    })
    .then((res) => {
      setLoading(false);
      if(res.data) {
        dispatch(updateChannel(res.data));
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert', e?.message || 'Something went wrong.')
    });
  }

  const editRoomName = () => {
    if (!groupName) {
      setEditName(n => !n);
      return;
    }

    setShowAlert(false);
    setLoading(true);
    api.post(`/rooms/${_id}/edit-name?roomname=${groupName}`)
    .then((res) => {
      setLoading(false);
      setEditName(n => !n);
      if(res.data) {
        dispatch(updateChannel(res.data));
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert', e?.message || 'Something went wrong.')
    });
  }

  const muteChatRoom = (mute = false) => {
    setShowAlert(false);
    setLoading(true);
    api.post(`/rooms/${_id}/mute-chat?muted=${mute}`)
    .then((res) => {
      setLoading(false);
      setMuteChat(mute)
      if(res.data) {
        dispatch(updateChannel(res.data));
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert', e?.message || 'Something went wrong.')
    });
  }

  const clearChat = () => {
    setShowAlert(false);
    setLoading(true);
    api.post(`/rooms/${_id}/clear-chat`)
    .then((res) => {
      setLoading(false);
      if(res.data) {
        dispatch(setMessages(res.data._id, {}));
        dispatch(removeSelectedMessage(res.data._id));
        dispatch(updateChannel(res.data));
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert', e?.message || 'Something went wrong.')
    });
  }

  const onBack = () => navigation.goBack();

  const onInitiateCall = (isVideoEnable = false) => {
    setIsVideoEnable(isVideoEnable);
    modalRef.current?.open();
  }

  const separator = () => (
    <View style={{ backgroundColor: '#E5E5E5', height: 1 }} />
  )

  const options = () => {
    return (
      <>
        <TouchableOpacity onPress={() => {
          optionModalRef.current?.close();
          setTimeout(() => {
            meetingModalRef.current?.open();
          }, 500);
        }}>
          <View style={[styles.option]}>
            <Text
              style={{ marginLeft: 15 }}
              color={'black'}
              size={18}
            >
              Call {`${selectedParticipant.firstName} ${selectedParticipant.lastName}`}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          optionModalRef.current?.close();
          setTimeout(() => {
            newMessageModalRef.current?.open()
          }, 500);
        }}>
          <View style={[styles.option]}>
            <Text
              style={{ marginLeft: 15 }}
              color={'black'}
              size={18}
            >
              Message {`${selectedParticipant.firstName} ${selectedParticipant.lastName}`}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => optionModalRef.current?.close()}>
          <View style={[styles.option, { borderBottomWidth: 0 }]}>
            <Text
              style={{ marginLeft: 15 }}
              color={'black'}
              size={18}
            >
              Cancel
            </Text>
          </View>
        </TouchableOpacity>
      </>
    )
  }

  const showOption = (participant:IParticipants) => {
    setSelectedParticipant(participant)
    optionModalRef.current?.open();
  }

  const onRemoveConfirm = () => {
    optionModalRef.current?.close();
    setAlertData({
      title: 'Remove Member',
      message: `Remove ${selectedParticipant.firstName} ${selectedParticipant.lastName} from ${renderChannelName()}?`,
      cancel: 'Cancel',
      confirm: 'Yes',
      type: 'remove',
    });
    setTimeout(() => setShowAlert(true), 500);
  }

  const onDeleteChat = () => {
    setAlertData({
      title: 'Delete Chat',
      message: 'Are you sure you want to permanently delete this conversation?',
      cancel: 'Cancel',
      confirm: 'Yes',
      type: 'delete',
    });
    setShowAlert(true);
  }

  const onClearChat = () => {
    setAlertData({
      title: 'Clear Chat',
      message: 'Are you sure you want to clear chat content?',
      cancel: 'Cancel',
      confirm: 'Yes',
      type: 'clear',
    });
    setShowAlert(true);
  }

  const renderChannelName = () => {
    return getChannelName({
      otherParticipants,
      hasRoomName,
      name,
      isGroup
    });
  }

  const renderParticipants = (participants = [], type = '') => {
    return participants?.map((item:IParticipants) => (
      <ContactItem
        key={item._id}
        style={{ marginLeft: -15 }}
        image={item?.profilePicture?.thumb}
        imageSize={30}
        textSize={16}
        data={item}
        name={item.name}
        isOnline={item.isOnline}
        contact={item.email || ''}
        rightIcon={
          item.isAdmin ? (
            <View style={{ marginRight: -15 }}>
              <Text
                color='#606A80'
                size={12}
              >
                {isHost(item) ? 'Host' : 'Admin'}
              </Text>
            </View>
          ) : null
        }
        onPress={() => {
          if (isGroup && item._id != user._id) showOption(item);
        }}
      />
    ))
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <View style={{ paddingRight: 5 }}>
            <ArrowLeftIcon
              type='chevron-left'
              color={'#111827'}
              size={RFValue(26)}
            />
          </View>
        </TouchableOpacity>
        <View style={{ alignContent: 'center', flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={styles.title}
            size={14}
          >
            Meeting participants
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <TouchableOpacity onPress={() => participantModal.current?.open()}>
            <View style={styles.participantItem}>
              <AddParticipantsIcon
                color={'#000'}
                height={RFValue(14)}
                width={RFValue(14)}
              />
              <Text
                style={{ marginLeft: 10 }}
                size={16}
              >
                Add participants
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {separator()}
        <View style={styles.participantsContainer}>
          <Text
            style={{ fontFamily: Regular500 }}
            size={14}
          >
            In the  meeting ({lodash.size(inTheMeeting)})
          </Text>
          {renderParticipants(inTheMeeting, 'inTheMeeting')}
        </View>
        {separator()}
        <View style={styles.participantsContainer}>
          <Text
            style={{ fontFamily: Regular500 }}
            size={14}
          >
            Others invited ({lodash.size(othersInvited)})
          </Text>
          {renderParticipants(othersInvited, 'othersInvited')}
        </View>
      </ScrollView>
      <BottomModal
        ref={modalRef}
        onModalHide={() => modalRef.current?.close()}
        avoidKeyboard={false}
        header={
          <View style={styles.bar} />
        }
        containerStyle={{ maxHeight: null }}
        onBackdropPress={() => {}}
      >
        <View style={{ paddingBottom: 20, height: height * (Platform.OS === 'ios' ? 0.94 : 0.98) }}>
          <CreateMeeting
            barStyle={'dark-content'}
            participants={participants}
            isVideoEnable={isVideoEnable}
            isVoiceCall={!isVideoEnable}
            isChannelExist={true}
            channelId={_id}
            onClose={() => modalRef.current?.close()}
            onSubmit={(params, data) => {
              modalRef.current?.close();
              dispatch(setOptions({
                ...params.options,
                isHost: params.isHost,
                isVoiceCall: params.isVoiceCall,
              }));
              setTimeout(() => dispatch(setMeeting(data)), 300);
            }}
          />
        </View>
      </BottomModal>
      <BottomModal
        ref={optionModalRef}
        onModalHide={() => setShowDeleteOption(false)}
        header={
          <View style={styles.bar} />
        }
      >
        <View style={{ paddingBottom: 15 }}>
          {options()}
        </View>
      </BottomModal>
      <BottomModal
        ref={participantModal}
        onModalHide={() => participantModal.current?.close()}
        avoidKeyboard={false}
        header={
          <View style={styles.bar} />
        }
        containerStyle={{ maxHeight: null }}
        onBackdropPress={() => {}}
      >
        <View style={{ height: height * (Platform.OS === 'ios' ? 0.94 : 0.98) }}>
          <AddParticipants
            members={participants}
            onClose={() => participantModal.current?.close()}
            onSubmit={(members:any) => {
              participantModal.current?.close();
              setTimeout(() => addMembers(members), 300);
            }}
          />
        </View>
      </BottomModal>
      <BottomModal
        ref={newMessageModalRef}
        onModalHide={() => newMessageModalRef.current?.close()}
        avoidKeyboard={false}
        header={
          <View style={styles.bar} />
        }
        containerStyle={{ maxHeight: null }}
        onBackdropPress={() => {}}
      >
        <View style={{ height: height * (Platform.OS === 'ios' ? 0.94 : 0.98) }}>
          <MessageMember
            members={[selectedParticipant]}
            onClose={() => newMessageModalRef.current?.close()}
            onSubmit={(res:any) => {
              res.otherParticipants = lodash.reject(res.participants, (p:IParticipants) => p._id === user._id);
              dispatch(setSelectedChannel(res));
              dispatch(addChannel(res));
              newMessageModalRef.current?.close();
              setTimeout(() => navigation.navigate('ViewChat', res), 500);
            }}
          />
        </View>
      </BottomModal>
      <BottomModal
        ref={meetingModalRef}
        onModalHide={() => meetingModalRef.current?.close()}
        avoidKeyboard={false}
        header={
          <View style={styles.bar} />
        }
        containerStyle={{ maxHeight: null }}
        onBackdropPress={() => {}}
      >
        <View style={{ paddingBottom: 20, height: height * (Platform.OS === 'ios' ? 0.94 : 0.98) }}>
          <CreateMeeting
            participants={[selectedParticipant]}
            onClose={() => meetingModalRef.current?.close()}
            channelId={''}
            isChannelExist={false}
            onSubmit={(params, data) => {
              meetingModalRef.current?.close();
              dispatch(setOptions({
                ...params.options,
                isHost: params.isHost,
                isVoiceCall: params.isVoiceCall,
              }));
              setTimeout(() => dispatch(setMeeting(data)), 300);
            }}
          />
        </View>
      </BottomModal>
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        contentContainerStyle={{ borderRadius: 15 }}
        title={alertData.title}
        titleStyle={styles.titleMessage}
        message={alertData.message}
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
        cancelText={alertData.cancel}
        confirmText={alertData.confirm}
        onCancelPressed={() => setShowAlert(false)}
        onConfirmPressed={alertConfirm}
      />
      {
        loading && (
          <View style={styles.loading}>
            <Loading color='#fff' size={10} />
          </View>
        )
      }
    </View>
  )
}

export default Participants
