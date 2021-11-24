import React from 'react'
import { SafeAreaView, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const Home = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>home</Text>
    </SafeAreaView>
  )
}

export default Home
