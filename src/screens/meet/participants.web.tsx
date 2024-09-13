import React, { useState } from 'react'
import { Alert, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '@components/atoms/text'
import { Regular, Regular500 } from '@styles/font'
import { AddPeopleIcon, CloseIcon, MicOffIcon, MicOnIcon } from '@components/atoms/icon'
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux'
import lodash from 'lodash';
import IParticipants from '@/src/interfaces/IParticipants';
import { ContactItem } from '@components/molecules/list-item'
import { outline, text } from '@styles/color'
import AwesomeAlert from 'react-native-awesome-alerts'
import useApi from '@/src/services/api'
import Loading from '@components/atoms/loading'
import { updateChannel } from '@/src/reducers/channel/actions'
import { setPinnedParticipant, updateMeetingParticipants } from '@/src/reducers/meeting/actions'
import AddParticipants from '@components/pages/chat-modal/add-participants'
import useSignalr from '@/src/hooks/useSignalr'
import { fontValue } from '@components/pages/activities/fontValue'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'
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
    padding: 20,
    paddingHorizontal: 0,
    marginHorizontal: 20,
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: fontValue(16),
    color: '#DC2626',
    fontFamily: Regular500,
  },
  confirmText: {
    fontSize: fontValue(16),
    color: text.info,
    fontFamily: Regular500,
  },
  titleMessage: {
    color: '#14142B',
    textAlign: 'center',
    fontSize: fontValue(18),
    fontFamily: Regular500,
  },
  message: {
    color: '#4E4B66',
    textAlign: 'center',
    fontSize:fontValue(14),
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
    fontSize: fontValue(16),
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
  menuOptions: {
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius:15,
    elevation: 45,
  }
})

const Participants = ({ onClose = () => {} }:any) => {
  const dispatch = useDispatch();
  const {
    muteParticipant,
  } = useSignalr();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const api = useApi(user.sessionToken,user.createdAt);
  const { waitingInLobby = [], inTheMeeting = [], othersInvited = [], roomId = '', participants = [], meetingId = '', host = {} } = useSelector((state:RootStateOrAny) => {
    const { selectedChannel = {} } = state.channel;
    const { meeting = {} } = state.meeting;
    const meetingParticipants = meeting?.participants?.map((item:IParticipants) => {
      const p:IParticipants = lodash.find(selectedChannel.participants, (p:IParticipants) => p._id === item._id);
      if (p) {
        item.isOnline = p?.isOnline;
        item.lastOnline = p?.lastOnline;
        item.email = p?.email;
      }
      item.name = `${item?.firstName} ${item?.lastName}`;

      return item;
    });
    const inTheMeeting = lodash.filter(meetingParticipants ?? [], (p:IParticipants) => p.status === 'joined');
    const othersInvited = lodash.filter(meetingParticipants ?? [], (p:IParticipants) => !(p.status === 'joined' || p.status === 'waiting'));
    const waitingInLobby = lodash.filter(meetingParticipants ?? [], (p:IParticipants) => p.status === 'waiting');
    return {
      roomId: meeting?.roomId,
      meetingId: meeting?._id,
      inTheMeeting,
      othersInvited,
      waitingInLobby,
      participants: meetingParticipants,
      host: meeting?.host,
    }
  });
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
  const [onAddParticipant, setOnAddParticipant] = useState(false);
  const [listType, setListType] = useState<string>('');
  const [layout, setLayout] = useState({
    height: 0,
    left: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  });

  const isHost = (item:any = {}) => {
    return item?._id === host._id;
  }

  const alertConfirm = () => {
    if (alertData.type === 'remove') removeMember();
  }

  const removeMember = () => {
    setShowAlert(false);
    setLoading(true);
    api.post(`/rooms/${roomId}/remove-member?participantId=${selectedParticipant._id}`)
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

  const admitMember = () => {
    setLoading(true);
    api.post(`/meetings/${meetingId}/admit?participantId=${selectedParticipant._id}`)
    .then((res) => {
      setLoading(false);
      if(res.data) {
        dispatch(updateMeetingParticipants(res.data));
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
    api.post(`/rooms/${roomId}/add-members`,{
      participants: addedMembers,
      meetingId,
    })
    .then((res) => {
      setLoading(false);
      if (res.data) {
        dispatch(updateChannel(res.data));
      }
    })
    .catch(e => {
      setLoading(false);
      Alert.alert('Alert',e?.message||'Something went wrong.')
    });
};

  const onRemoveConfirm = (user:IParticipants) => {
    setAlertData({
      title: 'Remove Participant',
      message: `Remove ${user.firstName} ${user.lastName} from the meeting?`,
      cancel: 'Cancel',
      confirm: 'Yes',
      type: 'remove',
    });
    setTimeout(() => setShowAlert(true), 500);
  }

  const onLayout = ({ nativeEvent }:any) => setLayout(nativeEvent.layout);

  const separator = () => (
    <View style={{ backgroundColor: '#E5E5E5', height: 1 }} />
  )

  const showOption = (participant:IParticipants, type = '') => {
    setSelectedParticipant(participant)
    setListType(type);
  }

  const options = (type:string, item:IParticipants) => {
    if (isHost(user) && listType === 'waitingInLobby') {
      return (
        <>
          <MenuOption
            onSelect={admitMember}
          >
            <Text>Admit</Text>
          </MenuOption><MenuOption
            onSelect={() => onRemoveConfirm(item)}
          >
            <Text>Decline</Text>
          </MenuOption>
        </>
      )
    }

    return (
      <>
        {
          isHost(user) && (
            <>
              {
                type === 'inTheMeeting' && (
                  <MenuOption
                    onSelect={() => {
                      setLoading(true);
                      muteParticipant(meetingId, {
                        participantId: item._id,
                        muted: !item.muted,
                      }, () => {
                        setLoading(false);
                      });
                    }}
                  >
                    <Text>{`${item.muted ? 'Unmute' : 'Mute'} participant`}</Text>
                  </MenuOption>
                )
              }
              <MenuOption
                onSelect={() => onRemoveConfirm(item)}
              >
                <Text>Remove from meeting</Text>
              </MenuOption>
            </>
          )
        }
        {
          type === 'inTheMeeting' && (
            <MenuOption
              onSelect={() => dispatch(setPinnedParticipant(item))}
            >
              <Text>Pin for me</Text>
            </MenuOption>
          )
        }
      </>
    )
  }

  const renderParticipants = (participants = [], type = '') => {
    return participants?.map((item:IParticipants) => (
      <Menu key={item._id} onOpen={() => item._id !== user._id && showOption(item, type)}>
        <MenuTrigger>
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
            disabled={item._id !== user._id}
            indicator={() => {
              if (isHost(item)) {
                return (
                  <Text
                    color='#606A80'
                    size={12}
                  >
                    Organizer
                  </Text>
                )
              }
            }}
            rightIcon={
              type === 'inTheMeeting' && 
              <View style={{ marginRight: item.muted ? -18 : -15 }}>
                {
                  item.muted ? (
                    <MicOffIcon color={'#212121'} />
                  ) : (
                    <MicOnIcon color={'#2863D6'} />
                  )
                }
              </View>
            }
          />
        </MenuTrigger>
        <MenuOptions optionsContainerStyle={styles.menuOptions}>
          {options(type, item)}
        </MenuOptions>
      </Menu>
    ))
  }

  if (onAddParticipant) {
    return (
      <AddParticipants
        members={participants}
        onClose={() => setOnAddParticipant(false)}
        onSubmit={(members:any)=>{
          setOnAddParticipant(false);
          setTimeout(() => addMembers(members), 300);
        }}
      />
    )
  }

  return (
    <View style={styles.container } onLayout={onLayout}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <View style={{ paddingRight: 5 }}>
            <CloseIcon
              type='close'
              size={fontValue(18)}
            />
          </View>
        </TouchableOpacity>
        <View style={{ alignContent: 'center', flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={styles.title}
            size={14}
          >
            Meeting participants ({lodash.size(participants)})
          </Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
          <TouchableOpacity onPress={() => setOnAddParticipant(true)}>
            <View style={styles.participantItem}>
              <AddPeopleIcon />
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
            Waiting in lobby ({lodash.size(waitingInLobby)})
          </Text>
          {renderParticipants(waitingInLobby, 'waitingInLobby')}
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
          <View style={[styles.loading, { width: layout.width, height: layout.height }]}>
            <Loading color='#fff' size={fontValue(10)} />
          </View>
        )
      }
    </View>
  )
}

export default Participants
