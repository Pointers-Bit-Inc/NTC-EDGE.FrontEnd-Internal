import React, { FC, useState } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import Text from '@components/atoms/text'
import lodash from 'lodash';
import { CheckIcon } from '@components/atoms/icon'
import { getChatTimeString } from 'src/utils/formatting'
import { primaryColor, bubble, text, outline } from '@styles/color'
import ProfileImage from '@components/atoms/image/profile'

const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    padding: 5,
    paddingHorizontal: 10,
  },
  seenContainer: {
    paddingTop: 5,
    flexDirection: 'row',
    paddingHorizontal: 5,
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
  isSender = false,
  maxWidth = '60%',
  style,
  createdAt,
  seenByOthers = [],
  seenByEveryone = false,
  showSeen = false,
  showDate = false,
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
      <TouchableOpacity onPress={() => setShowDetails(!showDetails)}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
          <View style={[
            styles.container,
            {
              backgroundColor: isSender ? bubble.primary : bubble.secondary,
              maxWidth,
            },
            style
          ]}>
            <Text
              size={14}
              color={isSender ? 'white' : text.default}
            >
              {message}
            </Text>
          </View>
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
                  name={`${seen.firstname} ${seen.lastname}`}
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
