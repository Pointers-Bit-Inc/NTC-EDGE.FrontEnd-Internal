import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '@components/atoms/text';
import { InputField } from '@molecules/form-fields';
import Button from '@components/atoms/button';
import { ArrowLeftIcon } from '@components/atoms/icon';
import PasswordForm from '@components/organisms/forms/reset-password';
import { text, button } from 'src/styles/color';
import InputStyles from 'src/styles/input-style';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  content: {
    padding: 20,
    flex: 1,
  },
  description: {
    paddingVertical: 25,
  },
  button: {
    backgroundColor: button.primary,
    borderRadius: 5,
    position: 'absolute',
    bottom: 30,
    marginHorizontal: 20,
    width: '100%',
  }
})

const OneTimePin = ({ navigation }) => {
  const [account, setAccount] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeftIcon
            size={26}
            color={text.default}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
        >
          <Text
            size={18}
            color={text.default}
          >
            Close
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text
          style={{ marginBottom: 15 }}
          size={22}
          color={text.default}
          weight={'600'}
        >
          Reset password
        </Text>
        <PasswordForm />
        <Button
          style={styles.button}
          onPress={() => navigation.navigate('ForgotPasswordSuccess')}
        >
          <Text
            color="white"
            size={16}
            weight={'500'}
          >
            Submit
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default OneTimePin
