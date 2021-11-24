import React, { useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { InputField } from '@molecules/form-fields';
import Text from '@atoms/text';
import Button from '@atoms/button';

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  button: {
    backgroundColor: '#2B23FF'
  }
})

const errorResponse = {
  'email': 'Please enter a valid email address',
}

const LoginForm = ({ onSubmit = () => {}, loading = false }) => {
  const [formValue, setFormValue] = useState({
    email: {
      value: '',
      isValid: false,
      error: '',
    },
    password: {
      value: '',
      isValid: false,
      error: '',
    }
  });
  const checkIsEmail = (text:string) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(text);
  }

  const onChangeText = (key, value) => {
    if (key === 'email') {
      return setFormValue({
        ...formValue,
        [key]: {
          value: value,
          isValid: checkIsEmail(value),
          error: !checkIsEmail(value) ? 'Please enter a valid email address' : '',
        }
      }) 
    }
    return setFormValue({
      ...formValue,
      [key]: {
        value: value
      }
    })
  }

  const onPressSubmit = () => {
    if (!formValue.email.isValid) {
      return setFormValue({
        ...formValue,
        ['email']: {
          value: formValue.email.value,
          isValid: false,
          error: errorResponse['email'],
        }
      });
    }
    onSubmit({
      email: formValue?.email?.value || '',
      password: formValue?.password?.value || '',
    });
  };

  return (
    <View style={styles.container}>
      <InputField
        label={'Email'}
        placeholder='Email Address'
        required={true}
        activeColor={'#2B23FF'}
        errorColor={'red'}
        error={formValue?.email?.error}
        onChangeText={text => onChangeText('email', text)}
        value={formValue?.email?.value}
      />
      <InputField
        label={'Password'}
        placeholder='Password'
        secureTextEntry={true}
        containerStyle={{ marginBottom: 15 }}
        required={true}
        activeColor={'#2B23FF'}
        errorColor={'red'}
        onChangeText={text => onChangeText('password', text)}
        value={formValue?.password?.value}
      />
      <Button disabled={loading} style={styles.button} onPress={onPressSubmit}>
        {
          loading ? (
            <ActivityIndicator color={'white'} size={'small'} />
          ) : (
            <Text fontSize={16} color={'white'}>Login</Text>
          )
        }
      </Button>
    </View>
  )
}

export default LoginForm
