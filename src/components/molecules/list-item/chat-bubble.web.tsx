import React,{FC,useState} from 'react'
import {Dimensions,Image,Platform,StyleSheet,TouchableOpacity,View} from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import {CheckIcon,NewFileIcon,NewMeetIcon,NewVideoIcon,WriteIcon} from '@components/atoms/icon';
import {getChatTimeString,getDateTimeString,getFileSize, getTimerString} from 'src/utils/formatting'
import {bubble,button,primaryColor,text} from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import {Bold, Regular, Regular500} from '@styles/font';
import {fontValue} from '@components/pages/activities/fontValue';
import IAttachment from 'src/interfaces/IAttachment';
import hairlineWidth=StyleSheet.hairlineWidth;
import IParticipants from 'src/interfaces/IParticipants';
import GroupImage from '../image/group';
import dayjs from 'dayjs';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubbleContainer: {
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    borderRadius: fontValue(6),
    padding: fontValue(5),
    paddingHorizontal: fontValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      native: {
        paddingBottom: Platform.OS === 'ios' ? undefined : 1,
      },
      default: {
        paddingBottom:  undefined,
      }
    })

  },
  imageBubble: {
    marginRight: 2,
    marginTop: 2,
    width: 250,
    height: 250,
    backgroundColor: bubble.primary,
  },
  systemMessage: {
    flexDirection: 'row',
    marginTop: 5,
    alignItems: 'center',
    marginLeft: -3,
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 25,
    backgroundColor: primaryColor,
    marginRight: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seenContainer: {
    paddingTop: 3,
    paddingBottom: 10,
    flexDirection: 'row',
  },
  seenTimeContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    marginBottom: 5,
    marginTop: 10,
  },

  flipX: {
    transform: [
      {
        scaleX: -1
      }
    ]
  },
  hrText:{
    flex:1,
    paddingVertical: 20,
    alignSelf:'center',
    width:"100%",
    flexDirection:"row",
    justifyContent:"center"
  },
  border:{
    flex:1,
    backgroundColor:  "#D1D1D6",
    width:"100%",
    height:hairlineWidth,
    alignSelf:"center"
  },
  hrContent:{
    color:  "#2863D6",
    paddingHorizontal:20,
    textAlign:'center'
  },
  check: {
    borderRadius: fontValue(12),
    width: fontValue(12),
    height: fontValue(12),
    borderColor: text.info,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    paddingLeft: 0.5,
    ...Platform.select({
      native: {
        paddingBottom: Platform.OS === 'ios' ? undefined : 1,
      },
      default: {
        paddingBottom:  undefined,
      }
    })
  },
  file: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: 'white',
  },
  imageFile: {
    width: width * 0.3,
    height: width * 0.3,
  },
  notif: {
    backgroundColor: '#C4C4C4',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 2,
    borderRadius: 15,
    marginBottom: 5,
    marginTop: 5,
  },
  callAgainBtn: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: button.info,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  }
})

interface Props {
  message?: string;
  messageType?: string;
  attachment?: IAttachment;
  sender?: any;
  isSender?: boolean;
  maxWidth?: any;
  style?: any;
  createdAt?: any;
  seenByOthers?: any;
  seenByEveryone?: boolean;
  showSeen?: boolean;
  showDate?: boolean;
  onLongPress?: any;
  deleted?: boolean;
  unSend?: boolean;
  edited?: boolean;
  system?: boolean;
  delivered?: boolean;
  onPreview?: any;
  meeting?: any;
  onCallAgain?: any;
  user?: any;
  isGroup?: boolean;
  [x: string]: any;
}

const ChatBubble:FC<Props> = ({
  message,
  messageType,
  attachment,
  sender = {},
  isSender = false,
  maxWidth = '60%',
  style,
  createdAt,
  seenByOthers = [],
  seenByEveryone = false,
  showSeen = false,
  isSeen = false,
  showDate = false,
  onLongPress,
  deleted = false,
  unSend = false,
  edited = false,
  system = false,
  delivered = false,
  onPreview = () => {},
  meeting = null,
  onCallAgain = () => {},
  user = {},
  isGroup = false,
  ...otherProps
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const deletedOrUnsend = deleted || (unSend && isSender);

  const _getSenderName = () => {
    if (isSender) {
      return 'You';
    }
    let result = '';
    if (sender.title) result += sender.title + ' ';
    result += sender.firstName;
    return result;
  }

  const senderName = _getSenderName();

  const checkIfImage = (uri:any) => {
    if (uri && (uri.endsWith(".png") || uri.endsWith(".jpg") || uri.endsWith(".jpeg"))) return true;
    return false;
  };

  const renderTime = () => {
    return (showDetails || showDate) ? (
      <View style={styles.hrText}>
        <View style={styles.border}/>
        <Text style={[styles.hrContent, {color:  "#64748B",}]}>{getChatTimeString(createdAt)}</Text>
        <View style={styles.border}/>
      </View>
    ) : null;
  }

  const renderContent = () => {
    if (deletedOrUnsend) {
      return (
        <Text
          style={{ marginLeft: 5 }}
          size={14}
          color={'#979797'}
        >
          {
            (unSend && isSender) ?
            'Unsent for you'
            : `${senderName} deleted a message`
          }
        </Text>
      )
    } else if (!!attachment) {
      return (
        <View style={styles.file}>
          <NewFileIcon
            color={'#606A80'}
          />
          <View style={{ paddingHorizontal: 5, maxWidth: width * 0.3 }}>
            <Text
              size={12}
              color={'#606A80'}
            >
              {attachment.name}
            </Text>
            <Text
              size={10}
              color={'#606A80'}
              style={{ top: -2 }}
            >
              {getFileSize(attachment.size)}
            </Text>
          </View>
          <View style={{ width: 10 }} />
        </View>
      )
    }
    
    return (
      <View>
        <Text
          size={10}
          color={'black'}
          style={{ fontFamily: Regular }}
        >
          {getChatTimeString(createdAt)}{edited ? ' • Edited' : ''}
        </Text>
        <Text
          size={14}
          color={'black'}
        >
          {message}
        </Text>
      </View>
    )
  }
  console.log('MESSAGE TYPE', messageType, system, message);
  if (messageType === 'leave' || messageType === 'removed' || messageType === 'added' || messageType === 'newroom' || (messageType === 'text' && system)) {
    return (
      <>
        {renderTime()}
        <View style={styles.systemMessage}>
          <View
            style={{ marginRight: 5, marginLeft: -2 }}
          >
            <ProfileImage
              image={sender?.profilePicture?.thumb}
              name={`${sender.firstName} ${sender.lastName}`}
              size={25}
              textSize={10}
            />
          </View>
          <Text
            size={14}
            color={'#606A80'}
            style={{ textAlign: 'center' }}
          >
            {`${(messageType === 'removed' || messageType === 'added') ? `${senderName} ` : ''}${message}`}
          </Text>
        </View>
      </>
    )
  }

  if (messageType === 'newmeeting' || messageType === 'callended') {
    let msg = `${getDateTimeString(createdAt, 'MM/DD/YYYY hh:mm A')} | ${isGroup ? 'Meeting' : 'Call'} started`;
    let duration = '';
    let joinedParticipants = [];
    let timeDiff = null;
    let missedCall = false;

    if (meeting) {
      joinedParticipants = lodash.filter(meeting.participants, (p:IParticipants) => p.hasJoined);
      const timeStart = dayjs(meeting?.createdAt);
      const timeEnded = dayjs(meeting?.endedAt);
      timeDiff = timeEnded.diff(timeStart);
      timeDiff = getTimerString(timeDiff/1000);

      if (!isGroup) {
        missedCall = lodash.size(joinedParticipants) < 2;
      }
    }

    if (messageType === 'callended') {
      msg = `${getDateTimeString(meeting?.endedAt, 'MM/DD/YYYY hh:mm A')} | ${meeting?.isGroup ? 'Meeting' : 'Call'} ended:`;
      duration = `${timeDiff}s`;
    }

    if (missedCall) {
      if (isSender) {
        const recipient = lodash.find(meeting.participants, (p:IParticipants) => p._id !== user._id)
        if (recipient) {
          msg = `${getDateTimeString(meeting?.endedAt, 'MM/DD/YYYY hh:mm A')} | ${recipient.firstName} missed your call:`;
        }
      } else {
        msg = `${getDateTimeString(meeting?.endedAt, 'MM/DD/YYYY hh:mm A')} | You missed a call:`;
      }
    }

    return (
      <>
        {renderTime()}
        <View style={styles.systemMessage}>
          {
            messageType === 'newmeeting' ? (
              <NewMeetIcon color={'#2863D6'} />
            ) : (
              <NewVideoIcon
                color={'#606A80'}
                height={20}
                width={20}
              />
            )
          }
          <Text
            size={14}
            color={'#606A80'}
            style={{ textAlign: 'center', marginLeft: 5 }}
          >
            {msg}
          </Text>
          {
            !!duration && (
              <Text
                size={14}
                color={'#606A80'}
                style={{ textAlign: 'center', marginLeft: 5, fontFamily: Bold }}
              >
                {duration}
              </Text>
            )
          }
        </View>
      </>
    )
  }

  return (
    <>
      {renderTime()}
      <View style={[styles.container, { maxWidth }, style]}>
        {
          !isSender ?(
            <View
              style={{ marginLeft: -5 }}
            >
              <ProfileImage
                image={sender?.profilePicture?.thumb}
                name={`${sender.firstName} ${sender.lastName}`}
                size={25}
                textSize={10}
              />
            </View>
          ) : null
        }
        <View style={{ marginLeft: 5 }}>
          {
            (!isSender && isGroup) ? (
              <Text
                size={10}
                color={text.default}
              >
                {_getSenderName()}
              </Text>
            ) : null
          }
          {
            checkIfImage(attachment?.uri) && !deletedOrUnsend ? (
              <Image
                resizeMode={'cover'}
                style={[
                  styles.imageBubble,
                  {
                    backgroundColor: isSender ? '#E3E5EF' : 'white'
                  }
                ]}
                borderRadius={10}
                source={{ uri: attachment?.uri }}
              />
            ) : (
              <View style={styles.bubbleContainer}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isSender ? '#E3E5EF' : 'white'
                    },
                    (deletedOrUnsend || system) && {
                      backgroundColor: '#E5E5E5'
                    },
                  ]}
                >
                  {renderContent()}
                </View>
              </View>
            )
          }
        </View>
        {
          (!isSeen && isSender && !deleted && !system && !(unSend && isSender)) && (
            <View
              style={[styles.check, delivered && { backgroundColor: text.info }]}
            >
              <CheckIcon
                type='check1'
                size={8}
                color={delivered ? 'white' : text.info}
              />
            </View>
          )
        }
      </View>
      {
        ((showDetails || showSeen) && lodash.size(seenByOthers) > 0) && (
          <View
            style={[
              styles.seenContainer,
              {
                maxWidth,
                alignSelf: isSender ? 'flex-end' : 'flex-start',
                paddingLeft: isSender ? 0 : 20,
              }
            ]}
          >
            {
              (seenByEveryone && isGroup) ? (
                <Text
                  color={'#64748B'}
                  numberOfLines={2}
                  size={10}
                >
                  <Text
                    color={'#64748B'}
                    size={10}
                    style={{ fontFamily: Regular500 }}
                  >
                    {'Seen by '}
                  </Text>
                  everyone
                </Text>
              ) : (
                <View
                  style={[{ flexDirection: 'row' }, isSender && styles.flipX]}
                >
                  {
                    seenByOthers.map(seen => (
                      <ProfileImage
                        style={[{ marginHorizontal: 1, }, isSender && styles.flipX]}
                        key={seen._id}
                        image={seen?.profilePicture?.thumb}
                        name={`${seen.firstName} ${seen.lastName}`}
                        size={12}
                        textSize={5}
                      />
                    ))
                  }
                </View>
              )
            }
          </View>
        )
      }
    </>
  )
}

export default ChatBubble
