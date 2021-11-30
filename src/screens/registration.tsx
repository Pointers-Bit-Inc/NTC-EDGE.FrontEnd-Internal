import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  validateEmail,
  validatePassword,
  validatePhone,
} from 'src/utils/form-validations';
import RegistrationForm from '@organisms/forms/registration';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import { text, button } from 'src/styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    marginBottom: 10,
    fontWeight: '500',
    color: '#37405B',
    marginTop: '18%',
  },
  footer: {
    paddingVertical: 45,
  },
  button: {
    marginTop: 35,
    marginBottom: 35,
    borderRadius: 5,
    paddingVertical: 12,
  }
});

const errorResponse = {
  email: 'Please enter a valid email address',
  password: 'Password must be atleast 6 characters',
  phone: 'Please enter a valid phone number',
  confirm: 'password does not match',
};

const Registration = ({ navigation }:any) => {
  const [formValue, setFormValue] = useState({
    username: {
      value: '',
      isValid: false,
      error: '',
    },
    email: {
      value: '',
      isValid: false,
      error: '',
    },
    phone: {
      value: '',
      isValid: false,
      error: '',
    },
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
      case 'username': {
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: !!value,
            error: !value ? 'Enter Username' : ''
          }
        });
      }
      case 'email': {
        const checked = validateEmail(value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: checked,
            error: !checked ? errorResponse['email'] : ''
          }
        });
      }
      case 'phone': {
        const checked = validatePhone(value);
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: checked,
            error: !checked ? errorResponse['phone'] : ''
          }
        });
      }
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
    if (!formValue.username.isValid) {
      return onChangeText('username', formValue.username.value);
    } else if (!formValue.email.isValid) {
      return onChangeText('email', formValue.email.value);
    } else if (!formValue.phone.isValid) {
      return onChangeText('phone', formValue.phone.value);
    } else if (!formValue.password.isValid) {
      return onChangeText('password', formValue.password.value);
    } else if (!formValue.confirmPassword.isValid) {
      return onChangeText('confirmPassword', formValue.confirmPassword.value);
    } else {
      return navigation.navigate(
        'RegistrationPageTwo',
        {
          username: formValue?.username?.value,
          email: formValue?.email?.value,
          phone: formValue?.phone?.value,
          password: formValue?.password?.value,
        }
      );
    }
  }

  const isValid =
    formValue.username.isValid &&
    formValue.email.isValid &&
    formValue.phone.isValid &&
    formValue.password.isValid &&
    formValue.confirmPassword.isValid;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
      <ScrollView
        style={{ paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <Text size={24} weight={'500'} style={styles.title}>
          Sign up
        </Text>
        <RegistrationForm onChangeValue={onChangeText} form={formValue} />
        <View style={styles.footer}>
          <View style={{ alignItems: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => navigation.replace('Login')}
            >
              <Text
                weight={'500'}
                size={18}
                color={text.primary}
              >
                Sign in instead
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            style={[styles.button, { backgroundColor: isValid ? button.primary : button.default }]}
            onPress={onCheckValidation}
          >
            <Text color="white" size={18}>Next</Text>
          </Button>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Registration;
