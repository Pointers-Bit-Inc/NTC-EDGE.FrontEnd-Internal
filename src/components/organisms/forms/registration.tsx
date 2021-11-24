import React from 'react'
import { View } from 'react-native'
import { useNavigation } from '@react-navigation/core';
import { InputField, DateTimeField, DropdownField } from '@molecules/form-fields';
import Text from '@atoms/text';
import Button from '@atoms/button';

const RegistrationForm = () => {
  const navigation = useNavigation();
  return (
    <View>
      <InputField title={'FirstName'} placeholder='FirstName' />
      <InputField title={'LastName'} placeholder='LastName' />
      <DateTimeField title={'Birthday'} borderColor={'red'} placeholder='Birthday' />
      <DropdownField title={'Gender'} />
      <InputField title={'Email'} placeholder='Email Address' />
      <InputField title={'Password'} placeholder='Password' secureTextEntry={true} style={{ marginBottom: 15 }} />
      <Button style={{ backgroundColor: '#2B23FF' }} onPress={() => navigation.navigate('Login')}>
        <Text fontSize={16} color={'white'}>Save</Text>
      </Button>
    </View>
  )
}

export default RegistrationForm
