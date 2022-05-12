import React, { useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '@components/atoms/text'
import { Regular, Regular500 } from '@styles/font'
import { AddPeopleIcon, ArrowLeftIcon, CloseIcon, MicOffIcon, MicOnIcon, NewMeetIcon, NewPenIcon, NewPhoneIcon, PinParticipantIcon, ToggleIcon } from '@components/atoms/icon'
import { RFValue } from 'react-native-responsive-fontsize'
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
import { updateChannel } from 'src/reducers/channel/actions'
import { setFullScreen, setMeeting, setOptions, setPinnedParticipant, setToggle } from 'src/reducers/meeting/actions'
import AddParticipants from '@components/pages/chat-modal/add-participants'
import { InputField } from '@components/molecules/form-fields'
import useSignalr from 'src/hooks/useSignalr'
import MessageMember from '@components/pages/chat-modal/message'
import RemoveParticipantIcon from '@components/atoms/icon/remove-participant'
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
    muteParticipant,
  } = useSignalr();
  const user = useSelector((state:RootStateOrAny) => state.user);
  const api = useApi(user.sessionToken);
  const { inTheMeeting = [], othersInvited = [], roomId = '', participants = [], meetingId = '', host = {} } = useSelector((state:RootStateOrAny) => {
    const { meeting = {} } = state.meeting;
    const inTheMeeting = lodash.filter(meeting?.participants ?? [], (p:IParticipants) => p.status === 'joined');
    const othersInvited = lodash.filter(meeting?.participants ?? [], (p:IParticipants) => p.status !== 'joined');
    return {
      roomId: meeting?.roomId,
      meetingId: meeting?._id,
      inTheMeeting,
      othersInvited,
      participants: meeting?.participants,
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
  const [listType, setListType] = useState<string>('');
  const optionModalRef = useRef<BottomModalRef>(null);

  useEffect(() => {
    if (!meetingId) {
      navigation.goBack();
    }
  }, [meetingId]);

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

  const onRemoveConfirm = () => {
    optionModalRef.current?.close();
    setAlertData({
      title: 'Remove Participant',
      message: `Remove ${selectedParticipant.firstName} ${selectedParticipant.lastName} from the meeting?`,
      cancel: 'Cancel',
      confirm: 'Yes',
      type: 'remove',
    });
    setTimeout(() => setShowAlert(true), 500);
  }
  const onBack = () => {
    dispatch(setFullScreen(true));
    navigation.goBack();
  };

  const separator = () => (
    <View style={{ backgroundColor: '#E5E5E5', height: 1 }} />
  )

  const options = () => {
    return (
      <>
        {
          isHost(user) && (
            <>
              {
                listType === 'inTheMeeting' && (
                  <TouchableOpacity onPress={() => {
                    optionModalRef.current?.close();
                    dispatch(setToggle({
                      uid: selectedParticipant.uid,
                      muted: !selectedParticipant.muted,
                    }));
                    setLoading(true);
                    muteParticipant(meetingId, {
                      participantId: selectedParticipant._id,
                      muted: !selectedParticipant.muted,
                    }, () => {
                      setLoading(false);
                    });
                  }}>
                    <View style={[styles.option]}>
                      {
                        !selectedParticipant.muted ? (
                          <MicOffIcon />
                        ) : (
                          <MicOnIcon />
                        )
                      }
                      <Text
                        style={{ marginLeft: 15 }}
                        color={'black'}
                        size={18}
                      >
                        {selectedParticipant.muted ? 'Unmute' : 'Mute'} participant
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              }
              <TouchableOpacity onPress={onRemoveConfirm}>
                <View style={[styles.option]}>
                  <RemoveParticipantIcon />
                  <Text
                    style={{ marginLeft: 15 }}
                    color={'black'}
                    size={18}
                  >
                    Remove from meeting
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )
        }
        {
          listType === 'inTheMeeting' && (
            <TouchableOpacity onPress={() => {
              optionModalRef.current?.close();
              dispatch(setPinnedParticipant(selectedParticipant));
            }}>
              <View style={[styles.option, { borderBottomWidth: 0 }]}>
                <PinParticipantIcon />
                <Text
                  style={{ marginLeft: 15 }}
                  color={'black'}
                  size={18}
                >
                  Pin for me
                </Text>
              </View>
            </TouchableOpacity>
          )
        }
      </>
    )
  }

  const showOption = (participant:IParticipants, type = '') => {
    setSelectedParticipant(participant)
    setListType(type);
    optionModalRef.current?.open();
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
        onPress={() => item._id !== user._id && showOption(item, type)}
      />
    ))
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <View style={{ paddingRight: 5 }}>
            <CloseIcon
              type='close'
              size={RFValue(18)}
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
        {
          isHost(user) && (
            <>
              <View style={{ paddingHorizontal: 20, paddingVertical: 10 }}>
                <TouchableOpacity onPress={() => navigation.navigate('Participants')}>
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
            </>
          )
        }
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
        ref={optionModalRef}
        onModalHide={() => optionModalRef.current?.close()}
        header={
          <View style={styles.bar} />
        }
      >
        <View style={{ paddingBottom: 15 }}>
          <Text
            style={{ textAlign: 'center' }}
            color='#808196'
            size={14}
          >
            {`${selectedParticipant.firstName} ${selectedParticipant.lastName}`}
          </Text>
          {options()}
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
