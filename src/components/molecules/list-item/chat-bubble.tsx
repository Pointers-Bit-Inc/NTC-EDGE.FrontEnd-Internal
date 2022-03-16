import React, { FC, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import { CheckIcon, DeleteIcon, WriteIcon } from '@components/atoms/icon'
import { getChatTimeString } from 'src/utils/formatting'
import { primaryColor, bubble, text, outline } from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'
import NewDeleteIcon from '@components/atoms/icon/new-delete';
import { RFValue } from 'react-native-responsive-fontsize';

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
    borderRadius: RFValue(15),
    padding: RFValue(5),
    paddingHorizontal: RFValue(10),
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? undefined : 1,
  },
  seenContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
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
  check: {
    borderRadius: 12,
    width: 12,
    height: 12,
    borderColor: text.info,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    paddingLeft: 0.5,
    paddingBottom: Platform.OS === 'ios' ? 0 : 1
  }
})

interface Props {
  message?: string;
  isSender?: boolean;
  sender?: any;
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
  isSender = false,
  sender = {},
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

  return (
    <>
      {
        (showDetails || showDate || system) && (
          <View style={styles.seenTimeContainer}>
            <Text
              color={text.default}
              size={12}
            >
              {getChatTimeString(createdAt)}
            </Text>
          </View>
        )
      }
      <TouchableOpacity
        onPress={() => setShowDetails(!showDetails)}
        onLongPress={(isSender && !(deleted || unSend || system)) ? onLongPress : null}
        {...otherProps}
      >
        <View style={[styles.container, { maxWidth }, style]}>
          {
            (edited && isSender && !(deleted || unSend)) && (
              <View style={{ alignSelf: 'center', marginRight: 5 }}>
                <WriteIcon
                  type='pen'
                  color={text.info}
                  size={14}
                />
              </View>
            )
          }
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
                      height={RFValue(18)}
                      width={RFValue(18)}
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
          {
            (edited && !isSender) && (
              <View style={{ alignSelf: 'center', marginLeft: 5 }}>
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
        ((showDetails || showSeen) && seenByEveryone) && !edited && (
          <View
            style={[{ flexDirection: 'row', paddingTop: 3, paddingBottom: 10 }, isSender && styles.flipX]}
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
    </>
  )
}

export default ChatBubble
