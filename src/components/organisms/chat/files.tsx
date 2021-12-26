import React from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/atoms/text'
import { text } from 'src/styles/color';
import { FileIcon } from '@components/atoms/icon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const FileList = () => {
  return (
    <View style={styles.container}>
      <FileIcon
        size={36}
        color={text.default}
      />
      <Text
        color={text.default}
        size={16}
      >
        No files yet
      </Text>
    </View>
  )
}

export default FileList
