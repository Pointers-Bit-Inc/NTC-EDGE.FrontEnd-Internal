import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Dimensions, View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '@components/atoms/text';
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from 'src/utils/form-validations';
import { InputField } from '@molecules/form-fields';
import Button from '@components/atoms/button';
import { ArrowLeftIcon } from '@components/atoms/icon';
import PasswordForm from '@components/organisms/forms/reset-password';
import { text, button } from 'src/styles/color';
import InputStyles from 'src/styles/input-style';
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    marginTop: 10,
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
    marginHorizontal: 20,
    width: '100%',
  },
  keyboardAvoiding: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
})

const errorResponse = {
  password: 'Password must be atleast 6 characters',
  confirm: 'Passwords do not match',
};

const OneTimePin = ({ navigation }) => {
  const [formValue, setFormValue] = useState({
    password: {
      value: '',
      isValid: false,
      error: '',
      characterLength: false,
      upperAndLowerCase: false,
      atLeastOneNumber: false,
      strength: 'Weak',
    },
    confirmPassword: {
      value: '',
      isValid: false,
      error: '',
    },
    showPassword: {
      value: false,
    }
  });

  const onChangeText = (key: string, value: any) => {
    switch (key) {
      case 'password': {
        const passwordTest = validatePassword(value);
        const checked = validatePasswordMatch(value, formValue.confirmPassword.value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: passwordTest?.isValid,
            error: !passwordTest?.isValid ? errorResponse['password'] : '',
            characterLength: passwordTest.characterLength,
            upperAndLowerCase: passwordTest.upperAndLowerCase,
            atLeastOneNumber: passwordTest.atLeastOneNumber,
            strength: passwordTest.strength,
          },
          'confirmPassword': {
            ...formValue.confirmPassword,
            isValid: checked,
            error: !checked ? errorResponse['confirm'] : ''
          }
        });
      }
      case 'confirmPassword': {
        const checked = validatePasswordMatch(value, formValue.password.value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: checked,
            error: !checked ? errorResponse['confirm'] : ''
          }
        });
      }
      case 'showPassword': {
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
          }
        });
      }
      default:
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: !!value,
            error: '',
          }
        });
    }
  };

  const validatePasswordMatch = (value:string, password:string) => {
    return value === password;
  }

  const onCheckValidation = () => {
    if (!formValue.password.isValid) {
      return onChangeText('password', formValue.password.value);
    } else if (!formValue.confirmPassword.isValid) {
      return onChangeText('confirmPassword', formValue.confirmPassword.value);
    } else {
      return navigation.navigate('ForgotPasswordSuccess')
    }
  }

  const isValid = formValue.password.isValid && formValue.confirmPassword.isValid;

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
        <PasswordForm onChangeValue={onChangeText} form={formValue} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          keyboardVerticalOffset={height * 0.12}
          style={styles.keyboardAvoiding}
        >
          <Button
            style={[styles.button, { backgroundColor: isValid ? button.primary : button.default }]}
            onPress={onCheckValidation}
          >
            <Text
              color="white"
              size={16}
              weight={'500'}
            >
              Submit
            </Text>
          </Button>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default OneTimePin
