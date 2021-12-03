import React, { useState, useCallback } from 'react';
import { Dimensions, ActivityIndicator, View, SafeAreaView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Text from '@components/atoms/text';
import InputField from '@atoms/input';
import { OTPField } from '@molecules/form-fields';
import Button from '@components/atoms/button';
import { ArrowLeftIcon } from '@components/atoms/icon';
import { text, button } from 'src/styles/color';
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
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  input: {
    letterSpacing: 10,
    fontSize: 36,
    fontWeight: 'bold',
  },
  outlineStyle: {
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  labelStyle: {
    fontSize: 16,
  },
  keyboardAvoiding: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
})

const OneTimePin = ({ navigation, route }:any) => {
  const {
    account,
    accountType
  } = route.params;
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const onSubmit = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ForgotPasswordReset')
    }, 5000);
  }, []);

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
          size={22}
          color={text.default}
          weight={'600'}
        >
          OTP code sent!
        </Text>
        <View style={styles.description}>
          <Text
            size={16}
            color={text.default}
          >
            {accountType === 'phone' ?
              `Enter the OTP code we sent view SMS to your\nregistered phone number.` :
              `Enter the OTP code we sent view EMAIL to your\nregistered email address.`
            }
          </Text>
        </View>
        <OTPField
          style={[InputStyles.text, styles.input]}
          maxLength={4}
          placeholder="••••"
          label={'OTP'}
          labelStyle={styles.labelStyle}
          required={true}
          hasValidation={true}
          outlineStyle={[InputStyles.outlineStyle, styles.outlineStyle]}
          errorColor={text.error}
          requiredColor={text.error}
          error={''}
          value={otp}
          keyboardType={'number-pad'}
          onChangeText={setOtp}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          keyboardVerticalOffset={height * 0.12}
          style={styles.keyboardAvoiding}
        >
          <Button
            disabled={otp.length < 4 || loading}
            style={[
              styles.button,
              otp.length < 4 && {
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
                    Confirming...
                  </Text>
                </>
              ) : (
                <Text
                  color="white"
                  size={16}
                  weight={'500'}
                >
                  Confirm
                </Text>
              )
            }
          </Button>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default OneTimePin
