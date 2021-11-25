import React from 'react';
import { SafeAreaView, ScrollView, View, StyleSheet } from 'react-native';
import RegistrationForm from '@organisms/forms/registration';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  }
});

const Registration = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ paddingHorizontal: 15 }}>
        <RegistrationForm />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Registration;
