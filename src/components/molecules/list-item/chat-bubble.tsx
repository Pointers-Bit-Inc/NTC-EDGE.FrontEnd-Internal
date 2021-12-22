import React, { FC, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import { CheckIcon, DeleteIcon, WriteIcon } from '@components/atoms/icon'
import { getChatTimeString } from 'src/utils/formatting'
import { primaryColor, bubble, text, outline } from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    borderRadius: 15,
    padding: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: outline.primary,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    paddingLeft: 0.5,
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
  showDate = false,
  onLongPress,
  deleted = false,
  unSend = false,
  edited = false,
  ...otherProps
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const getSeen = () => {
    return seenByOthers.map((seen:any, index:number) => {
      if (index === 0) {
        return seen.firstName;
      }
      return `, ${seen.firstName}`;
    });
  }

  return (
    <>
      {
        (showDetails || showDate) && (
          <View style={styles.seenTimeContainer}>
            <Text
              color={text.default}
              size={12}
            >
              {getChatTimeString(createdAt?.seconds)}
            </Text>
          </View>
        )
      }
      <TouchableOpacity
        onPress={() => setShowDetails(!showDetails)}
        onLongPress={(isSender && !(deleted || unSend)) ? onLongPress : null}
        {...otherProps}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          {
            (edited && isSender) && (
              <View style={{ alignSelf: 'center', marginRight: 5 }}>
                <WriteIcon
                  type='pen'
                  color={text.primary}
                  size={14}
                />
              </View>
            )
          }
          <View style={[
            styles.container,
            {
              backgroundColor: isSender ? bubble.primary : bubble.secondary,
              maxWidth,
            },
            (deleted || (unSend && isSender)) && {
              backgroundColor: '#E5E5E5'
            },
            style
          ]}>
            {
              (deleted || (unSend && isSender)) ? (
                <>
                  <DeleteIcon
                    size={18}
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
                  color={isSender ? 'white' : text.default}
                >
                  {message}
                </Text>
              )
            }
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
            (!lodash.size(seenByOthers) && isSender) && (
              <View
                style={styles.check}
              >
                <CheckIcon
                  type='check1'
                  size={8}
                  color={text.primary}
                />
              </View>
            )
          }
        </View>
      </TouchableOpacity>
      {
        ((showDetails || showSeen) && seenByEveryone) && (
          <View
            style={[{ flexDirection: 'row', paddingTop: 5 }, isSender && styles.flipX]}
          >
            {
              seenByOthers.map(seen => (
                <ProfileImage
                  style={[{ marginHorizontal: 1, }, isSender && styles.flipX]}
                  key={seen._id}
                  image={seen.image}
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
