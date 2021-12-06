import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, ActivityIndicator, View, SafeAreaView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import Text from '@components/atoms/text';
import * as Progress from 'react-native-progress';
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
    marginTop: 10,
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
    letterSpacing: 8,
    fontSize: 36,
    fontWeight: 'bold',
    flex: 1,
    paddingHorizontal: 0,
  },
  outlineStyle: {
    paddingHorizontal: 0,
    borderWidth: 0,
  },
  labelStyle: {
    fontSize: 14,
    color: text.default,
  },
  keyboardAvoiding: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
  },
})

const timerLimit = 90;
const errorResponse = 'Invalid verification code. Please try again';
const code = '1234';

const OneTimePin = ({ navigation, route }:any) => {
  const {
    account,
    accountType
  } = route.params;
  const [timer, setTimer] = useState(timerLimit);
  const [started, setStarted] = useState(false);
  const [ended, setEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const onSubmit = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp === code) {
        setEnded(true);
        navigation.navigate('ForgotPasswordReset')
      } else {
        setError(errorResponse);
      }
    }, 3000);
  }, [otp]);
  const onResend = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      resetTimer();
    }, 3000);
  }, []);

  const resetTimer = () => {
    setStarted(true);
    setEnded(false);
    setTimer(timerLimit);
    setError('');
    setOtp('');
  }

  const format = (time:number) => {   
    var mins = ~~((time % 3600) / 60);
    var secs = ~~time % 60;
    var format = "";
    format += (mins < 10 ? "0" : "") + mins + ":" + (secs < 10 ? "0" : "");
    format += "" + secs;
    return format;
  }

  useEffect(() => {
    resetTimer();
  }, []);

  useEffect(() => {
    let interval:any = null;
    if (started && !ended) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [started, ended]);

  useEffect(() => {
    if (timer === 0) {
      setStarted(false);
      setEnded(true);
    }
  }, [timer]);
  
  const renderButton = () => {
    if (ended || error) {
      return (
        <Button
          disabled={loading}
          style={[
            styles.button,
            {
              backgroundColor: button.success
            },
            loading && {
              backgroundColor: '#3BC759'
            }
          ]}
          onPress={onResend}
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
                  Sending code...
                </Text>
              </>
            ) : (
              <Text
                color="white"
                size={16}
                weight={'500'}
              >
                Resend code
              </Text>
            )
          }
        </Button>
      )
    }
    return (
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
    )
  }

  const renderDetail = () => {
    if (accountType === 'phone') {
      const lastFour = account.substr(account.length - 4);
      return `**** ${lastFour}`;
    }
    const email = account.split('@');
    return `****@${email[1]}`;
  }

  const onChangeText = (value:string) => {
    if (!!error) {
      setError('');
    }
    setOtp(value);
  }

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
              `Enter the OTP code we sent via SMS to your registered phone number ${renderDetail()}.` :
              `Enter the OTP code we sent via EMAIL to your registered email address ${renderDetail()}.`
            }
          </Text>
        </View>
        <OTPField
          style={[
            InputStyles.text,
            styles.input,
            !!error && {
              color: text.error
            }
          ]}
          maxLength={4}
          placeholder="••••"
          label={'OTP'}
          labelStyle={styles.labelStyle}
          required={true}
          hasValidation={true}
          outlineStyle={[InputStyles.outlineStyle, styles.outlineStyle]}
          errorColor={text.error}
          requiredColor={text.error}
          error={error}
          value={otp}
          keyboardType={'number-pad'}
          onChangeText={onChangeText}
        >
          {
            !ended && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Progress.Pie
                  style={{
                    transform: [
                        {scaleX: -1},
                    ]
                  }}
                  color={text.success}
                  borderWidth={0}
                  progress={timer/timerLimit}
                  size={16}
                />
                <Text
                  style={{ marginLeft: 5 }}
                  size={16}
                  color={text.default}
                >
                  {format(timer)}
                </Text>
              </View>
            )
          }
        </OTPField>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'position' : 'height'}
          keyboardVerticalOffset={height * 0.12}
          style={styles.keyboardAvoiding}
        >
          {renderButton()}
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  )
}

export default OneTimePin
