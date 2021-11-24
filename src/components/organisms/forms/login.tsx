import React from 'react'
import { View, Platform } from 'react-native'
import { InputField } from '@molecules/form-fields';
import Text from '@atoms/text';
import Button from '@atoms/button';

const LoginForm = () => {
  return (
    <View>
      <InputField title={'Email'} placeholder='Email Address' />
      <InputField title={'Password'} placeholder='Password' secureTextEntry={true} style={{ marginBottom: 15 }} />
      <Button style={{ backgroundColor: '#2B23FF' }}>
        <Text fontSize={16} color={'white'}>Login</Text>
      </Button>
    </View>
  )
}

export default LoginForm
