import React, { useRef, useState } from 'react'
import { Dimensions, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'
import Text from '@components/atoms/text'
import { Regular, Regular500 } from '@styles/font'
import { ArrowLeftIcon, NewMeetIcon, NewPenIcon, NewPhoneIcon, ToggleIcon } from '@components/atoms/icon'
import { RFValue } from 'react-native-responsive-fontsize'
import AddParticipantsIcon from '@components/atoms/icon/new-add-participants'
import LinkIcon from '@components/atoms/icon/link'
import { RootStateOrAny, useSelector } from 'react-redux'
import lodash from 'lodash';
import IParticipants from 'src/interfaces/IParticipants';
import { getChannelName } from 'src/utils/formatting';
import { ContactItem } from '@components/molecules/list-item'
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal'
import CreateMeeting from '@components/pages/chat/meeting';
import { outline, text } from '@styles/color'
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
})

const ChatInfo = ({ navigation }) => {
  const user = useSelector((state:RootStateOrAny) => state.user);
  const { _id, otherParticipants, participants, hasChannelName, channelName, isGroup } = useSelector(
    (state:RootStateOrAny) => {
      const { selectedChannel } = state.channel;
      selectedChannel.otherParticipants = lodash.reject(selectedChannel.participants, (p:IParticipants) => p._id === user._id);
      return selectedChannel;
    }
  );
  const [isVideoEnable, setIsVideoEnable] = useState(false);
  const [muteChat, setMuteChat] = useState(false);
  const [showDeleteOption, setShowDeleteOption] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<any>({});
  const modalRef = useRef<BottomModalRef>(null);
  const optionModalRef = useRef<BottomModalRef>(null);

  const onBack = () => navigation.goBack();

  const onInitiateCall = (isVideoEnable = false) => {
    setIsVideoEnable(isVideoEnable);
    modalRef.current?.open();
  }

  const separator = () => (
    <View style={{ backgroundColor: '#F8F8F8', height: 10 }} />
  )

  const options = () => {
    return (
      <>
        <TouchableOpacity>
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
        <TouchableOpacity>
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
        <TouchableOpacity>
          <View style={[styles.option]}>
            <Text
              style={{ marginLeft: 15 }}
              color={'black'}
              size={18}
            >
              Add as admin
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={[styles.option]}>
            <Text
              style={{ marginLeft: 15 }}
              color={text.error}
              size={18}
            >
              Remove from chat
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

  const renderChannelName = () => {
    return getChannelName({
      otherParticipants,
      hasChannelName,
      channelName,
      isGroup
    });
  }

  const renderParticipants = () => {
    return participants.map((item:IParticipants) => (
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
                Admin
              </Text>
            </View>
          ) : null
        }
        onLongPress={() => showOption(item)}
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
            size={16}
          >
            {renderChannelName()}
          </Text>
          {
            isGroup && (
              <Text
                style={styles.subtitle}
                color={'#606A80'}
                size={10}
              >
                {`${lodash.size(participants)} participants`}
              </Text>
            )
          }
        </View>
        <TouchableOpacity>
          <View style={{ paddingHorizontal: 5, paddingTop: 5 }}>
            <NewPenIcon color={'#2863D6'} />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => onInitiateCall(false)}>
            <View style={styles.circle}>
              <NewPhoneIcon color={'#082080'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onInitiateCall(true)}>
            <View style={styles.circle}>
              <NewMeetIcon color={'#082080'} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.circle}>
              <AddParticipantsIcon color={'#082080'} />
            </View>
          </TouchableOpacity>
        </View>
        {separator()}
        <View style={styles.muteChatContainer}>
          <Text size={14}>
            Mute Chat
          </Text>
          <TouchableOpacity onPress={() => setMuteChat(m => !m)}>
            <ToggleIcon
              style={muteChat ? styles.toggleActive : styles.toggleDefault}
              size={RFValue(32)}
            />
          </TouchableOpacity>
        </View>
        {separator()}
        <View style={styles.participantsContainer}>
          {
            isGroup && (
              <Text
                size={14}
              >
                {`Participants (${lodash.size(participants)})`}
              </Text>
            )
          }
          <View style={{ paddingTop: isGroup ? 10 : 0 }}>
            <TouchableOpacity>
              <View style={styles.participantItem}>
                <View style={styles.smallCircle}>
                  <AddParticipantsIcon
                    color={'#082080'}
                    height={RFValue(14)}
                    width={RFValue(14)}
                  />
                </View>
                <Text
                  size={16}
                  color={'#37405B'}
                >
                  Add Participants
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.participantItem}>
                <View style={styles.smallCircle}>
                  <LinkIcon
                    color={'#082080'}
                    height={RFValue(14)}
                    width={RFValue(14)}
                  />
                </View>
                <Text
                  size={16}
                  color={'#37405B'}
                >
                  Add Participants via link
                </Text>
              </View>
            </TouchableOpacity>
            {renderParticipants()}
          </View>
        </View>
        {separator()}
        <View style={styles.footerContainer}>
          <TouchableOpacity>
            <View style={{ marginVertical: 10 }}>
              <Text
                size={14}
                color={'#CF0327'}
              >
                Clear Chat Content
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={{ marginVertical: 10 }}>
              <Text
                size={14}
                color={'#CF0327'}
              >
                Leave and Delete
              </Text>
            </View>
          </TouchableOpacity>
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
        backdropOpacity={0}
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
            onSubmit={(type:any, params:any) => {
              modalRef.current?.close();
              setTimeout(() => navigation.navigate(type, params), 300);
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
    </View>
  )
}

export default ChatInfo
