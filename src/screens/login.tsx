import React, { useState, useCallback, useEffect } from 'react';
import {
  ImageBackground ,
  ScrollView ,
  View ,
  TouchableOpacity ,
  StyleSheet ,
  KeyboardAvoidingView ,
  Platform ,
  Image ,
  ActivityIndicator ,
  Dimensions , StatusBar
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';
import { validateEmail, validatePassword } from 'src/utils/form-validations';
import Text from '@atoms/text';
import Button from '@atoms/button';
import LoginForm from '@organisms/forms/login';
import { text, button, outline } from '@styles/color';
import { Bold } from '@styles/font';
import useApi  from 'src/services/api';
import { setUser } from 'src/reducers/user/actions';
import { StackActions } from '@react-navigation/native';
import Ellipsis from "@atoms/ellipsis";
import {setTabBarHeight} from "../reducers/application/actions";
const logo = require('@assets/ntc-edge-horizontal.png');
const background = require('@assets/background.png');

const { width, height } = Dimensions.get('screen');
const navigationBarHeight = height - Dimensions.get('window').height;
const styles = StyleSheet.create({
  bgImage: {
    height ,
    width,
  },
  formTitleText: {
    color: text.primary,
    fontSize: RFValue(20),
    textAlign: 'center',
    fontFamily: Bold,
    marginBottom: 30,
  },
  image: {
    height: width * .15,
    width: width * .60,
    marginTop: height * .10,
    marginVertical: height * .08,
    alignSelf: 'center',
  },
  formContainer: {
    flex: 1,
    borderRadius: 15,
    borderWidth: 0.5,
    borderBottomWidth: 0,
    borderColor: outline.disabled,
    backgroundColor: '#fff',
    padding: 30,
  },
  bottomContainer: {
    paddingVertical: 30,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
  },
  loginButton: {
    borderRadius: 10,
    justifyContent: 'center',
  },
  boldText: {
    fontFamily: Bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  }
});

const errorResponse = {
  email: 'Enter a valid email address',
  password: 'Password must be at least 8 characters',
};

const Login = ({ navigation }:any) => {
  const api = useApi('');
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onLogin = async (data) => {
    setLoading(true);
    api.post('/signin', {
      email: data.email,
      password: data.password,
    })
        .then(res => {
          setLoading(false);
          dispatch(setUser(res.data));
          navigation.dispatch(StackActions.replace('ActivitiesScreen'));
        })
        .catch(e => {
          setLoading(false);
          if (e) {
            setFormValue({
              ...formValue,
              email: {
                ...formValue.email,
                error: 'Authentication failed'
              }
            });
          }
        });
  };
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
        return navigation.navigate('ForgotPassword');
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
      return onLogin({
        email: formValue?.email?.value,
        password: formValue?.password?.value,
      });
    }
  }
  const isValid =
      formValue.email.isValid &&
      formValue.password.isValid;

  return (
      <ImageBackground
          resizeMode='stretch'
          source={background}
          style={styles.bgImage}
          imageStyle={{flex: 1}}
      >
        <StatusBar barStyle='dark-content' />

        <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}
        >

          <Image
              resizeMode='contain'
              source={logo}
              style={styles.image}
          />

          <View style={styles.formContainer}>

            <Text style={styles.formTitleText}>Login</Text>

            <LoginForm onChangeValue={onChangeValue} form={formValue} />

            <View style={styles.bottomContainer}>
              <Button
                  style={[
                    styles.loginButton,
                    {
                      backgroundColor:  loading
                                       ? button.info
                                       : isValid
                                         ? button.primary
                                         : button.default
                    }
                  ]}
                  disabled={loading}
                  onPress={onCheckValidation}
              >
                {
                  loading ? (
                      <View style={{paddingVertical: 6  }}>
                        <Ellipsis   color='#fff' size={RFValue(8)} />
                      </View>

                  ) : (
                      <View>
                        <Text style={styles.boldText} color={isValid ? '#fff' : text.disabled} size={RFValue(18)}>Login</Text>
                      </View>

                  )
                }
              </Button>
              {
                Platform.OS === 'android' && <View style={{height: navigationBarHeight}} />
              }
            </View>

          </View>

        </ScrollView>

      </ImageBackground>
  );
};

export default Login;