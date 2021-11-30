import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  validateEmail,
  validatePassword,
} from 'src/utils/form-validations';
import LoginForm from '@organisms/forms/login';
import Text from '@atoms/text';
import Button from '@components/atoms/button';
import { text, button, outline } from 'src/styles/color';
const logo = require('../../assets/logo.png');
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
  header: {
    paddingVertical: 50,
    marginBottom: 50,
  },
  image: {
    height: 55,
    width: 55,
  },
  formContainer: {
    borderColor: outline.default,
    borderWidth: 1,
    borderRadius: 15,
    padding: 30,
    paddingVertical: 40,
    backgroundColor: 'white',
  },
  footer: {
    marginTop: 35,
    marginBottom: 20,
  },
  button: {
    borderRadius: 5,
    paddingVertical: 12,
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

const errorResponse = {
  email: 'Please enter a valid email address',
  password: 'Password must be atleast 6 characters',
};

const Login = ({ navigation }:any) => {
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
      characterLength: false,
      upperAndLowerCase: false,
      atLeastOneNumber: false,
      strength: 'Weak',
    },
    showPassword: {
      value: false
    },
    keepLoggedIn: {
      value: false,
    }
  });

  const onChangeValue = (key: string, value: any) => {
    switch (key) {
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
          }
        });
      }
      case 'showPassword': {
        return setFormValue({
          ...formValue,
          [key]: {
            value: !formValue.showPassword.value,
          }
        });
      }
      case 'forgotPassword': {
        return;
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

  const onCheckValidation = () => {
    if (!formValue.email.isValid) {
      return onChangeValue('email', formValue.email.value);
    } if (!formValue.password.isValid) {
      return onChangeValue('password', formValue.password.value);
    } else {
      return navigation.navigate(
        'Home',
        {
          email: formValue?.email?.value,
          password: formValue?.password?.value,
        }
      );
    }
  }

  const isValid =
    formValue.email.isValid &&
    formValue.password.isValid;

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
        <View style={styles.header}>
          <View style={styles.horizontal}>
            <Image style={styles.image} source={logo} />
            <View style={{ marginLeft: 10 }}>
              <Text color={text.default} size={10}>
                Republic of the Philippines
              </Text>
              <Text color={text.default} size={10} weight={'500'}>
                NATIONAL TELECOMMUNICATIONS COMMISSION
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.formContainer}>
          <LoginForm onChangeValue={onChangeValue} form={formValue} />
          <View style={styles.footer}>
            <Button
              style={[styles.button, { backgroundColor: isValid ? button.primary : button.default }]}
              onPress={onCheckValidation}
            >
              <Text color="white" size={18}>Login</Text>
            </Button>
          </View>
          <View style={styles.horizontal}>
            <Text color={text.default} size={14}>
              {`Don't have an account? `}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
              <Text color={text.primary} size={14}>
                Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
