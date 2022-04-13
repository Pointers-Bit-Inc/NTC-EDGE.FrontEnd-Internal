import { CheckIcon, NewCheckIcon, NewFileIcon } from '@components/atoms/icon';
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native'
import * as FileSystem from 'expo-file-system';
import Text from '@components/atoms/text'
import { getFileSize } from 'src/utils/formatting';
import * as Progress from 'react-native-progress';
import { fontValue } from '@components/pages/activities/fontValue';
import { outline, text } from '@styles/color';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  circle: {
    height: 32,
    width: 32,
    borderRadius: 32,
    backgroundColor: '#D9DBE9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    paddingHorizontal: 10,
  },
  item: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 1,
  },
  file: {
    marginLeft: 10,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    maxWidth: width * 0.6,
    paddingRight: 30,
  },
  progress: {
    top: -2,
    marginLeft: 2,
    paddingLeft: 0,
  },
  check: {
    top: -2,
    borderRadius: fontValue(12),
    width: fontValue(12),
    height: fontValue(12),
    borderColor: text.info,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
    backgroundColor: text.info,
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
})

const FileItem = ({
  name = '',
  size = 0,
  uri = '',
  selected = false,
  onPress = () => {},
  progress = 0,
  error = false,
  downloaded = false,
  onPreview = () => {},
}) => {

  return (
    <View style={styles.item}>
      <TouchableOpacity onPress={onPress}>
        <View style={[styles.circle, selected && { backgroundColor: '#2863D6' }]}>
          {
            !!selected && (
              <NewCheckIcon
                color={'white'}
              />
            )
          }
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPreview}>
        <View style={styles.file}>
          <NewFileIcon
            color={'#606A80'}
          />
          <View style={{ paddingHorizontal: 10 }}>
            <Text
              size={14}
              color={'#606A80'}
            >
              {name}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                size={12}
                color={'#606A80'}
                style={{ top: -2 }}
              >
                {getFileSize(size)}
              </Text>
              {
                downloaded ? (
                  <View
                    style={styles.check}
                  >
                    <CheckIcon
                      type='check1'
                      size={8}
                      color={'white'}
                    />
                  </View>
                ) : (
                  <Progress.Pie
                    style={styles.progress}
                    size={fontValue(12)}
                    progress={progress}
                    borderWidth={0}
                    color={outline.info}
                    unfilledColor={outline.default}
                  />
                )
              }
            </View>
          </View>
          <View style={{ width: 30 }} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default FileItem