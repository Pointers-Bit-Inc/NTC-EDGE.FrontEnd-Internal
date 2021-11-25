import React, { useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { InputField } from '@molecules/form-fields';
import { validateEmail, validatePassword } from 'src/utils/form-validations';
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
  'password': 'Password must be atleast 6 characters'
}

const LoginForm = ({ onSubmit = ({}) => {}, loading = false }) => {
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

  const onChangeText = (key: string, value: string) => {
    switch(key) {
      case 'email': return setFormValue({
        ...formValue,
        [key]: {
          value: value,
          isValid: validateEmail(value),
          error: !validateEmail(value) ? errorResponse['email'] : '',
        }
      });
      case 'password': return setFormValue({
        ...formValue,
        [key]: {
          value: value,
          isValid: validatePassword(value),
          error: !validatePassword(value) ? errorResponse['password'] : '',
        }
      });
      default: return setFormValue({
        ...formValue,
        [key]: {
          value: value
        }
      })
    };
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
    } else if (!formValue.password.isValid) {
      return setFormValue({
        ...formValue,
        ['password']: {
          value: formValue.password.value,
          isValid: false,
          error: errorResponse['password'],
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
        onChangeText={(text:string) => onChangeText('email', text)}
        value={formValue?.email?.value}
      />
      <InputField
        label={'Password'}
        placeholder='Password'
        secureTextEntry={true}
        required={true}
        activeColor={'#2B23FF'}
        errorColor={'red'}
        error={formValue?.password?.error}
        onChangeText={(text:string) => onChangeText('password', text)}
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
