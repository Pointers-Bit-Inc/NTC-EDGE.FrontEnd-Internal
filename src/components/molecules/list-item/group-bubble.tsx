import React,{FC,useState} from 'react'
import {Dimensions,Image,Platform,StyleSheet,TouchableOpacity,View} from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import {CheckIcon,NewFileIcon,WriteIcon} from '@components/atoms/icon';
import {getChatTimeString,getFileSize} from 'src/utils/formatting'
import {bubble,primaryColor,text} from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import {Regular500} from '@styles/font';
import {fontValue} from '@components/pages/activities/fontValue';
import IAttachment from 'src/interfaces/IAttachment';
import hairlineWidth=StyleSheet.hairlineWidth;

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
    borderRadius: fontValue(15),
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
    width: width * 0.3,
    height: width * 0.3,
    backgroundColor: bubble.primary,
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
  }
})

interface Props {
  message?: string;
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
  [x: string]: any;
}

const ChatBubble:FC<Props> = ({
  message,
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
  ...otherProps
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const _getSenderName = () => {
    let result = '';
    if (sender.title) result += sender.title + ' ';
    result += sender.firstName;
    return result;
  }

  const checkIfImage = (uri:any) => {
    if (uri && (uri.endsWith(".png") || uri.endsWith(".jpg"))) return true;
    return false;
  };

  return (
    <>
      {
        (showDetails || showDate || system) && (
            Platform.select({
              native:(
                  <View style={styles.seenTimeContainer}>
                    <Text
                        color={text.default}
                        size={12}
                    >
                      {getChatTimeString(createdAt)}
                    </Text>
                  </View>
              ),
              web:(
                  <View style={styles.hrText}>
                    <View style={styles.border}/>
                    <View>
                      <Text style={[styles.hrContent, {color:  "#808196",}]}>{getChatTimeString(createdAt)}</Text>
                    </View>
                    <View style={styles.border}/>
                  </View>
              )
            })
        )
      }
      <TouchableOpacity
        onPress={() => setShowDetails(!showDetails)}
        onLongPress={(isSender && !(deleted || unSend || system)) ? onLongPress : null}
        {...otherProps}
      >
        <View style={[styles.container, { maxWidth }, style]}>
          {
            !isSender ?(
              <ProfileImage
                image={sender?.profilePicture?.thumb}
                name={`${sender.firstName} ${sender.lastName}`}
                size={25}
                textSize={10}
                style={{ marginLeft: -5 }}
              />
            ) : null
          }
          {
            (edited && isSender && !(deleted || unSend)) && (
              <View style={{ alignSelf: 'center', marginRight: 0 }}>
                <WriteIcon
                  type='pen'
                  color={text.info}
                  size={14}
                />
              </View>
            )
          }
          <View style={{ marginLeft: 5 }}>
            {
              !isSender ? (
                <Text
                  size={10}
                  color={text.default}
                >
                  {_getSenderName()}
                </Text>
              ) : null
            }
            {
              checkIfImage(attachment?.uri) ? (
                <Image
                  resizeMode={'cover'}
                  style={[
                    styles.imageBubble,
                    {
                      backgroundColor: isSender ? bubble.primary : bubble.secondary
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
                        backgroundColor: isSender ? bubble.primary : bubble.secondary
                      },
                      (deleted || (unSend && isSender) || system) && {
                        backgroundColor: '#E5E5E5'
                      },
                    ]}
                  >
                    {
                      (deleted || (unSend && isSender)) ? (
                        <>
                          <NewDeleteIcon
                            height={fontValue(18)}
                            width={fontValue(18)}
                            color={'#979797'}
                          />
                          <Text
                            style={{ marginLeft: 5 }}
                            size={14}
                            color={'#979797'}
                          >
                            {
                              (unSend && isSender) ?
                              'Unsent for you'
                              : `${isSender ? 'You' : sender.firstName } deleted a message`
                            }
                          </Text>
                        </>
                      ) : !!attachment ? (
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
                      ) : (
                        <Text
                          size={14}
                          color={(isSender && !system) ? 'white' : 'black'}
                        >
                          {message}
                        </Text>
                      )
                    }
                  </View>
                </View>
              )
            }
          </View>
          {
            (edited && !isSender && !(deleted || unSend)) && (
              <View style={{ alignSelf: 'center', marginTop: 10, marginLeft: 5 }}>
                <WriteIcon
                  type='pen'
                  color={text.default}
                  size={14}
                />
              </View>
            )
          }
          {
            (!isSeen && isSender && !deleted && !system) && (
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
      </TouchableOpacity>
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
              seenByEveryone ? (
                <Text
                  color={text.default}
                  numberOfLines={2}
                  size={10}
                >
                  <Text
                    color={text.default}
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
