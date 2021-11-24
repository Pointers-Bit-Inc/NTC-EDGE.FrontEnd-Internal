import React from 'react'
import { SafeAreaView, Text, StyleSheet } from 'react-native'
import RegistrationForm from '@organisms/forms/registration';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 15,
  }
});

const Registration = () => {
  return (
    <SafeAreaView style={styles.container}>
      <RegistrationForm />
    </SafeAreaView>
  )
}

export default Registration
