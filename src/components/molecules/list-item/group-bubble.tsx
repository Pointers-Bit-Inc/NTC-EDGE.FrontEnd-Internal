import React, { FC, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import { getChatTimeString } from 'src/utils/formatting'
import { primaryColor, bubble, text } from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bubble: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    padding: 5,
    paddingHorizontal: 10,
    marginTop: 2
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
    paddingTop: 5,
    flexDirection: 'row',
  },
  seenTimeContainer: {
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  flipX: {
    transform: [
      {
        scaleX: -1
      }
    ]
  }
})

interface Props {
  message?: string;
  sender?: any;
  isSender?: boolean;
  maxWidth?: any;
  style?: any;
  createdAt?: any;
  seenByOthers?: any;
  seenByEveryone?: boolean;
  showSeen?: boolean;
  showDate?: boolean;
  [x: string]: any;
}

const ChatBubble:FC<Props> = ({
  message,
  sender = {},
  isSender = false,
  maxWidth = '60%',
  style,
  createdAt,
  seenByOthers = [],
  seenByEveryone = false,
  showSeen = false,
  showDate = false,
  ...otherProps
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const getSeen = () => {
    return seenByOthers.map((seen:any, index:number) => {
      if (index === 0) {
        return seen.firstname;
      }
      return `, ${seen.firstname}`;
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
        {...otherProps}
      >
        <View style={[styles.container, { maxWidth }, style]}>
          {
            !isSender ?(
              <ProfileImage
                image={sender.image}
                name={`${sender.firstname} ${sender.lastname}`}
                size={25}
                textSize={10}
              />
            ) : null
          }
          <View style={{ marginLeft: 10 }}>
            {
              !isSender ? (
                <Text
                  size={10}
                  color={text.default}
                >
                  {sender.firstname}
                </Text>
              ) : null
            }
            <View style={[
              styles.bubble,
              {
                backgroundColor: isSender ? bubble.primary : bubble.secondary
              }
            ]}>
              <Text
                size={14}
                color={isSender ? 'white' : text.default}
              >
                {message}
              </Text>
            </View>
          </View>
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
                    weight={'600'}
                    size={10}
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
                        image={seen.image}
                        name={`${seen.firstname} ${seen.lastname}`}
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
