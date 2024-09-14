import React from 'react'
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import Text from '@components/atoms/text';
import { AttachIcon, MediaIcon, NewCameraIcon } from '@components/atoms/icon'
import { RFValue } from 'react-native-responsive-fontsize'

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  fileButtonContainer: {
    paddingTop: 20,
    paddingHorizontal: 15,
    height: height * 0.25,
    backgroundColor: '#F0F1F2',
    flexDirection: 'row',
  },
  attachmentButton: {
    backgroundColor: 'white',
    width: 55,
    height: 50,
    marginHorizontal: 10,
    marginBottom: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  }
})

const AttachmentMenu = ({ onPress = (type:string) => {} }) => {
  return (
    <View style={styles.fileButtonContainer}>
      <TouchableOpacity onPress={() => onPress('camera')}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.attachmentButton}>
            <NewCameraIcon
              color={'#606A80'}
              height={RFValue(30)}
              width={RFValue(30)}
            />
          </View>
          <Text size={12} color={'#606A80'}>Camera</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('image')}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.attachmentButton}>
            <MediaIcon
              color={'#606A80'}
              height={RFValue(30)}
              width={RFValue(30)}
            />
          </View>
          <Text size={12} color={'#606A80'}>Media</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onPress('document')}>
        <View style={{ alignItems: 'center' }}>
          <View style={styles.attachmentButton}>
            <AttachIcon
              color={'#606A80'}
              height={RFValue(30)}
              width={RFValue(30)}
            />
          </View>
          <Text size={12} color={'#606A80'}>Attach</Text>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default AttachmentMenu