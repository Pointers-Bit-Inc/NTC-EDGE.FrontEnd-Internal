import React, { useState, useCallback } from 'react';
import { Platform, KeyboardAvoidingView, Dimensions, ActivityIndicator, View, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Text from '@components/atoms/text';
import { InputField } from '@molecules/form-fields';
import Button from '@components/atoms/button';
import { text, button } from 'src/styles/color';
import { validateEmail, validatePhone } from 'src/utils/form-validations';
import InputStyles from 'src/styles/input-style';
const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    paddingBottom: 0,
    alignItems: 'flex-end',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  description: {
    paddingVertical: 25,
    paddingBottom: 15,
  },
  button: {
    backgroundColor: button.primary,
    borderRadius: 5,
    marginHorizontal: 20,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  keyboardAvoiding: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
})

const errorResponse = {
  account: 'The email address or Mobile number entered is invalid.',
};


const ForgotPassword = ({ navigation }:any) => {
  const [account, setAccount] = useState({
    value: '',
    error: '',
    isValid: false
  });
  const [accountType, setAccountType] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ForgotPasswordOTP', {
        account: account.value,
        accountType,
      })
    }, 3000);
  }, [accountType]);

  const onChangeText = (value: string) => {
    const checkedEmail = validateEmail(value);
    const checkedPhone = validatePhone(value);
    const valid = checkedEmail || checkedPhone;
    if (checkedEmail) {
      setAccountType('email');
    } else if (checkedPhone) {
      setAccountType('phone');
    }
    setAccount({
      value: value,
      isValid: valid,
      error: !valid ? errorResponse['account'] : '',
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
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
          size={22}
          color={text.default}
          weight={'600'}
        >
          Forgot password?
        </Text>
        <View style={styles.description}>
          <Text
            size={16}
            color={text.default}
          >
            {`Don't worry! it happens.\nPlease enter the email address or mobile number\nassociated with your account.`}
          </Text>
        </View>
        <InputField
          inputStyle={InputStyles.text}
          label={'Email address/ Mobile number'}
          placeholder="Email address/ Mobile number"
          required={true}
          hasValidation={true}
          outlineStyle={InputStyles.outlineStyle}
          activeColor={text.primary}
          errorColor={text.error}
          requiredColor={text.error}
          error={account.error}
          value={account.value}
          keyboardType={'email-address'}
          onChangeText={onChangeText}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          keyboardVerticalOffset={height * 0.12}
          style={styles.keyboardAvoiding}
        >
          <Button
            disabled={!account.isValid || loading}
            style={[
              styles.button,
              !account.isValid && {
                backgroundColor: button.default
              },
              loading && {
                backgroundColor: '#60A5FA'
              }
            ]}
            onPress={onSubmit}
          >
            {
              loading ? (
                <>
                  <ActivityIndicator
                    color={'white'}
                    size={'small'}
                  />
                  <Text
                    style={{ marginLeft: 10 }}
                    color="white"
                    size={16}
                    weight={'500'}
                  >
                    Submitting...
                  </Text>
                </>
              ) : (
                <Text
                  color="white"
                  size={16}
                  weight={'500'}
                >
                  Submit
                </Text>
              )
            }
            
          </Button>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default ForgotPassword
