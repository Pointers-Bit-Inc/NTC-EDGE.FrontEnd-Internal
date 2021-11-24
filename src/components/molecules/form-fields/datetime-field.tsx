import React from 'react'
import { View, StyleSheet } from 'react-native'
import Text from '../../atoms/text';
import DateTimePicker from '../../atoms/datetime-picker';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  }
})

const DateTimeField = ({ title = '', value = '', placeholder = '', style }:any) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={{ marginBottom: 5 }} weight={'bold'} fontSize={16}>{title}</Text>
      <DateTimePicker value={value} placeholder={placeholder} />
    </View>
  )
}

export default DateTimeField
