import React from 'react'
import { Text, StyleSheet, SafeAreaView } from 'react-native'
import LoginForm from '../components/organisms/forms/login';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoginForm />
    </SafeAreaView>
  )
}

export default Login
