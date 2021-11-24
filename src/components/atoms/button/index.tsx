import React, { ReactNode, FC } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  default: {
    padding: 15,
    alignItems: 'center',
  }
})

interface Props {
  children: ReactNode,
  style?: any,
  [x:string]: any,
}

const Button: FC<Props> = ({ children, style, ...otherProps }:any) => {
  return (
    <TouchableOpacity style={[styles.default, style]} {...otherProps}>
      {children}
    </TouchableOpacity>
  )
}

export default Button
