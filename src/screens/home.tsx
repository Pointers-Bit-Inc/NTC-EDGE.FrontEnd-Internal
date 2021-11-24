import React from 'react'
import { SafeAreaView, Text, StyleSheet } from 'react-native'
import { useSelector } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  }
});

const Home = () => {
  const user = useSelector(state => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome, {user.email}</Text>
    </SafeAreaView>
  )
}

export default Home
