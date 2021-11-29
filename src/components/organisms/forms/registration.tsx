import React, { FC, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { CheckIcon, CloseIcon } from '@atoms/icon';
import {
  InputField,
} from '@molecules/form-fields';
import InputStyles from 'src/styles/input-style';
import { text } from 'src/styles/color';
import Text from '@atoms/text';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    marginLeft: 10
  },
  passwordValidationContainer: {
    paddingVertical: 5,
    marginBottom: 10,
    marginTop: 5,
  },
  strengthBar: {
    height: 4,
    borderRadius: 4,
    marginTop: 10,
    flex: 1,
  },
  horizontal: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unchecked: {
    height: 18,
    width: 18,
    backgroundColor: '#DBDFE5',
    borderRadius: 3,
  }
});

interface Props {
  formValue?: any;
  onChangeText?: any;
}

const RegistrationForm : FC<Props> = ({ formValue = {}, onChangeText = () => {} }) => {
  const validateIcon = (valid:boolean) => {
    if (valid) {
      return (
        <CheckIcon
          color={text.success}
          size={18}
        />
      )
    }
    return (
      <CloseIcon
        color={text.error}
        size={18}
      />
    )
  }
  const validateColor = (valid:boolean) => {
    return valid ? text.success : text.error;
  }
  const renderPasswordChecker = (checked:boolean) => {
    if (checked) {
      return (
        <View
          style={[
            styles.unchecked,
            {
              backgroundColor: text.primary,
              justifyContent: 'center',
              alignItems: 'center'
            }
          ]}
        >
          <CheckIcon
            type="check"
            color="white"
            size={14}
          />
        </View>
      );
    }
    return (
      <View style={styles.unchecked} />
    );
  }
  const passwordMeterColor = (strength:string) => {
    if (strength === 'Average') {
      return '#F8BF24';
    } else if (strength === 'Strong') {
      return '#2C9669';
    }
    return '#DC2626';
  }
  return (
    <View style={styles.container}>
      <InputField
        inputStyle={InputStyles.text}
        label={'Username'}
        placeholder="Username"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        error={formValue?.username?.error}
        requiredColor={text.error}
        value={formValue?.username?.value}
        onChangeText={(value: string) => onChangeText('username', value)}
        onSubmitEditing={(event:any) => onChangeText('username', event.nativeEvent.text)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Email'}
        placeholder="Email address"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={formValue?.email?.error}
        value={formValue?.email?.value}
        keyboardType={'email-address'}
        onChangeText={(value: string) => onChangeText('email', value)}
        onSubmitEditing={(event:any) => onChangeText('email', event.nativeEvent.text)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Phone'}
        placeholder="Phone number"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        error={formValue?.phone?.error}
        value={formValue?.phone?.value}
        keyboardType={'phone-pad'}
        onChangeText={(value: string) => onChangeText('phone', value)}
        onSubmitEditing={(event:any) => onChangeText('phone', event.nativeEvent.text)}
      />
      <InputField
        inputStyle={InputStyles.text}
        label={'Password'}
        placeholder="Password"
        textContentType="oneTimeCode"
        required={true}
        hasValidation={false}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        secureTextEntry={!formValue?.showPassword?.value}
        error={formValue?.password?.error}
        value={formValue?.password?.value}
        onChangeText={(value: string) => onChangeText('password', value)}
        onSubmitEditing={(event:any) => onChangeText('password', event.nativeEvent.text)}
      />
      <View style={{ marginBottom: 20, marginTop: 5 }}>
        <Text
          style={InputStyles.text}
          size={12}
          color={text.default}
        >
          Your password must have:
        </Text>
        <View style={styles.passwordValidationContainer}>
          <View style={styles.horizontal}>
            {validateIcon(formValue?.password?.characterLength)}
            <Text
              style={styles.label}
              size={12}
              color={validateColor(formValue?.password?.characterLength)}
            >
              8 or more characters
            </Text>
          </View>
          <View style={styles.horizontal}>
            {validateIcon(formValue?.password?.upperAndLowerCase)}
            <Text
              style={styles.label}
              size={12}
              color={validateColor(formValue?.password?.upperAndLowerCase)}
            >
              Uppercase and lowercase letters
            </Text>
          </View>
          <View style={styles.horizontal}>
            {validateIcon(formValue?.password?.atLeastOneNumber)}
            <Text
              style={styles.label}
              size={12}
              color={validateColor(formValue?.password?.atLeastOneNumber)}
            >
              At least one number
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text
            style={[InputStyles.text, { fontWeight: '600' }]}
            size={12}
            color={text.default}
          >
            Strength:
          </Text>
          <Text
            style={[InputStyles.text,
              {
                fontWeight: '600',
                color: passwordMeterColor(formValue?.password?.strength),
              }
            ]}
            size={12}
          >
            {` ${formValue?.password?.strength || 'Weak'}`}
          </Text>
        </View>
        <View style={styles.horizontal}>
          <View
            style={[
              styles.strengthBar,
              {
                backgroundColor: passwordMeterColor(formValue?.password?.strength)
              }]
            }
          />
        </View>
      </View>
      <InputField
        inputStyle={InputStyles.text}
        label={'Confirm'}
        placeholder="Confirm password"
        textContentType="oneTimeCode"
        required={true}
        hasValidation={true}
        outlineStyle={InputStyles.outlineStyle}
        activeColor={text.primary}
        errorColor={text.error}
        requiredColor={text.error}
        secureTextEntry={!formValue?.showPassword?.value}
        error={formValue?.confirmPassword?.error}
        value={formValue?.confirmPassword?.value}
        onChangeText={(value: string) => onChangeText('confirmPassword', value)}
        onSubmitEditing={(event:any) => onChangeText('confirmPassword', event.nativeEvent.text)}
      />
      <View style={[styles.horizontal, { marginTop: 20 }]}>
        <TouchableOpacity onPress={() => onChangeText('showPassword', !formValue?.showPassword?.value)}>
          {renderPasswordChecker(formValue?.showPassword?.value)}
        </TouchableOpacity>
        <Text
          style={[InputStyles.text, styles.label]}
          size={14}
        >
          Show password
        </Text>
      </View>
    </View>
  );
};

export default RegistrationForm;
