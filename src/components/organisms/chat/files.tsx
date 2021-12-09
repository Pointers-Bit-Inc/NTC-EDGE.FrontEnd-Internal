import React from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@components/atoms/text'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});

const FileList = () => {
  return (
    <View style={styles.container}>
      <Text>Files</Text>
    </View>
  )
}

export default FileList
