import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import {
  validateEmail,
  validatePassword,
} from 'src/utils/form-validations';
import RegistrationForm from '@organisms/forms/registration';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import { text, button } from 'src/styles/color';
import useKeyboard from 'src/hooks/useKeyboard';
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  title: {
    marginBottom: 15,
    fontWeight: '500',
    color: '#37405B',
    marginTop: 90,
  },
  footer: {
    paddingTop: 30,
    paddingVertical: 45,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 30,
    backgroundColor: 'white',
  },
  keyboardAvoiding: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 15,
  },
  blankSpace: {
    height: 150,
  }
});

const errorResponse = {
  userType: 'Please select a user type',
  permitType: 'Please select a permit type',
  username: 'Please enter a valid username',
  email: 'Please enter a valid email address',
  password: 'Password must be atleast 6 characters',
  confirm: 'password does not match',
};

const Registration = ({ navigation }:any) => {
  const isKeyboardVisible = useKeyboard();
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
            error: !value ? errorResponse['username'] : ''
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
          password: formValue?.password?.value,
        }
      );
    }
  }

  const isValid =
    formValue.username.isValid &&
    formValue.email.isValid &&
    formValue.password.isValid &&
    formValue.confirmPassword.isValid;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={75}
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
              onPress={() => navigation.navigate('Login')}
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
        </View>
        <View style={styles.blankSpace} />
      </ScrollView>
      </KeyboardAvoidingView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'position' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <View style={[styles.buttonContainer, isKeyboardVisible && styles.shadow]}>
          <Button
            style={[
              styles.button,
              {
                backgroundColor: isValid ?
                  button.primary :
                  button.default
              }
            ]}
            onPress={onCheckValidation}
          >
            <Text color="white" size={18}>Next</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Registration;
