import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { InputField } from '@molecules/form-fields';
import { validateEmail, validatePassword } from 'src/utils/form-validations';
import useTheme from 'src/hooks/useTheme';
import Text from '@atoms/text';
import Button from '@atoms/button';

const styles = StyleSheet.create({
  container: {
    width: '100%'
  },
  button: {}
});

const errorResponse = {
  email: 'Please enter a valid email address',
  password: 'Password must be atleast 6 characters'
};

const LoginForm = ({ onSubmit = ({}) => {}, loading = false }) => {
  const { text, outline, button, roundness, thickness } = useTheme();
  const [formValue, setFormValue] = useState({
    email: {
      value: '',
      isValid: false,
      error: ''
    },
    password: {
      value: '',
      isValid: false,
      error: ''
    }
  });

  const onChangeText = (key: string, value: string) => {
    switch (key) {
      case 'email':
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: validateEmail(value),
            error: !validateEmail(value) ? errorResponse['email'] : ''
          }
        });
      case 'password':
        return setFormValue({
          ...formValue,
          [key]: {
            value: value,
            isValid: validatePassword(value),
            error: !validatePassword(value) ? errorResponse['password'] : ''
          }
        });
      default:
        return setFormValue({
          ...formValue,
          [key]: {
            value: value
          }
        });
    }
  };

  const onPressSubmit = () => {
    if (!formValue.email.isValid) {
      return setFormValue({
        ...formValue,
        ['email']: {
          value: formValue.email.value,
          isValid: false,
          error: errorResponse['email']
        }
      });
    } else if (!formValue.password.isValid) {
      return setFormValue({
        ...formValue,
        ['password']: {
          value: formValue.password.value,
          isValid: false,
          error: errorResponse['password']
        }
      });
    }
    onSubmit({
      email: formValue?.email?.value || '',
      password: formValue?.password?.value || ''
    });
  };

  return (
    <View style={styles.container}>
      <InputField
        style={{ color: text.default }}
        outlineStyle={{
          borderColor: outline.default,
          borderRadius: roundness,
          borderWidth: thickness
        }}
        label={'Email'}
        placeholder="Email Address"
        required={true}
        activeColor={text.primary}
        errorColor={text.error}
        error={formValue?.email?.error}
        onChangeText={(text: string) => onChangeText('email', text)}
        value={formValue?.email?.value}
      />
      <InputField
        style={{ color: text.default }}
        outlineStyle={{
          borderColor: outline.default,
          borderRadius: roundness,
          borderWidth: thickness
        }}
        label={'Password'}
        placeholder="Password"
        secureTextEntry={true}
        required={true}
        activeColor={text.primary}
        errorColor={text.error}
        error={formValue?.password?.error}
        onChangeText={(text: string) => onChangeText('password', text)}
        value={formValue?.password?.value}
      />
      <Button
        disabled={loading}
        style={[styles.button, { backgroundColor: button.primary }]}
        onPress={onPressSubmit}
      >
        {loading ? (
          <ActivityIndicator color={'white'} size={'small'} />
        ) : (
          <Text fontSize={16} color={'white'}>
            Login
          </Text>
        )}
      </Button>
    </View>
  );
};

export default LoginForm;
