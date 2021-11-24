import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  input: {
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
  }
})


const DateTimePicker = ({ value = '', keyboardType, secureTextEntry = false, placeholder = '' }:any) => {
  const [text, setText] = useState(value);

  return (
    <TextInput
      style={styles.input}
      value={text}
      placeholder={placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureTextEntry}
      underlineColorAndroid={'transparent'}
      onChangeText={setText}
    />
  )
}

export default DateTimePicker;