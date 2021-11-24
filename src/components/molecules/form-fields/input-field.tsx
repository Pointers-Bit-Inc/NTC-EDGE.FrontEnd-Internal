import React from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '@atoms/text';
import TextInput from '@atoms/text-input';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  }
})

const InputField = ({ title = '', value = '', placeholder = '', secureTextEntry = false, style }:any) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={{ marginBottom: 5 }} weight={'bold'} fontSize={16}>{title}</Text>
      <TextInput value={value} placeholder={placeholder} secureTextEntry={secureTextEntry}/>
    </View>
  )
}

export default InputField
