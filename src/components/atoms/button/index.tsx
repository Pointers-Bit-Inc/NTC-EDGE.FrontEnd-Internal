import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: 'red',
    alignItems: 'center',
  }
})

const Button = ({ children, style, onPress }:any) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      {children}
    </TouchableOpacity>
  )
}

export default Button
