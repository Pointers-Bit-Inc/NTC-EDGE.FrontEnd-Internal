import React, { FC, useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native'
import Text from '@components/atoms/text'
import { CheckIcon, DeleteIcon, ExclamationIcon, NewFileIcon, WriteIcon } from '@components/atoms/icon'
import { primaryColor, bubble, text, outline, errorColor } from '@styles/color'
import { fontValue } from '@components/pages/activities/fontValue';
import { getFileSize } from 'src/utils/formatting';

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
    borderRadius: fontValue(12),
    width: fontValue(12),
    height: fontValue(12),
    borderColor: text.info,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    paddingLeft: 0.5,
    paddingTop: 0.5,
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
})

interface Props {
  message?: string;
  messageId?: string;
  messageType?: string;
  channelId?: string;
  data?: any;
  error?: boolean;
  maxWidth?: any;
  style?: any;
  createdAt?: any;
  onLongPress?: any;
  onSendMessage?: any;
  [x: string]: any;
}

const PendingBubble:FC<Props> = ({
  message,
  messageId,
  messageType = 'text',
  channelId,
  data = {},
  error = false,
  maxWidth = '60%',
  style,
  createdAt,
  onLongPress,
  onSendMessage = () => {},
  ...otherProps
}) => {
  useEffect(() => {
    if (messageType === 'file') {
      console.log('DATA DATA', data);
    } else {
      onSendMessage({
        roomId: channelId,
        message,
      }, messageId);
    }
  }, [messageId]);

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      {...otherProps}
    >
      <View style={[styles.container, { maxWidth }, style]}>
        <View style={styles.bubbleContainer}>
          <View
            style={[
              styles.bubble,
              {
                backgroundColor: bubble.primary
              },
            ]}
          >
            {
              messageType === 'file' ? (
                <View style={styles.file}>
                  <NewFileIcon
                    color={'#606A80'}
                  />
                  <View style={{ paddingHorizontal: 5, maxWidth: width * 0.25 }}>
                    <Text
                      size={12}
                      color={'#606A80'}
                    >
                      {data.name}
                    </Text>
                    <Text
                      size={10}
                      color={'#606A80'}
                      style={{ top: -2 }}
                    >
                      {getFileSize(data.size)}
                    </Text>
                  </View>
                  <View style={{ width: 10 }} />
                </View>
              ) : (
                <Text
                  size={14}
                  color={'white'}
                >
                  {message}
                </Text>
              )
            }
          </View>
        </View>
        <View
          style={[styles.check, error && { borderColor: errorColor }]}
        >
          {
            error && (
              <ExclamationIcon
                name='exclamation'
                size={8}
                color={errorColor}
              />
            )
          }
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PendingBubble
