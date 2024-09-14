import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  BackHandler,Platform,
} from 'react-native';
import Statusbar from '@atoms/status-bar';
import Text from '@atoms/text';
import { text, primaryColor } from '@styles/color';
import { Bold } from '@styles/font';
import ArrowRightIcon from "@assets/svg/ArrowRightIcon";
import FilledSuccessIcon from "@assets/svg/FilledSuccess";

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: '30%',
    padding: 30,
  },
  circle: {

    ...Platform.select({
      web: {
        height: width *  0.046,
        width: width *  0.046,
        borderRadius: width *  0.046,
      },
      native:{
        height: width / 5,
        width: width / 5,
        borderRadius: width / 5,
      }
    }),


    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  subMessage: {
    marginTop: 5,
    textAlign: 'center',
    marginHorizontal: 30,
  },
  boldText: {
    fontFamily: Bold
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
});

const ForgotPasswordSuccess = ({ navigation }:any) => {

  const onBack = () => {
    navigation.replace('Login');
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBack);
    };
  }, []);

  return (
      <View style={styles.container}>
        <Statusbar barStyle='dark-content' />
        <View style={styles.content}>
          <View style={styles.circle}>
            <FilledSuccessIcon/>
          </View>

          <Text
              style={styles.boldText}
              color={text.primary}
              size={24}
          >
            Congratulations
          </Text>
          <Text
              style={styles.subMessage}
              color={text.default}
              size={16}
          >
            You can now sign in to the app using your new password.
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.replace('Login')}>
          <View style={styles.horizontal}>
            <Text
                style={styles.boldText}
                color={text.info}
                size={18}
            >
              Log in
            </Text>
            <ArrowRightIcon
                style={{ marginLeft: 5 }}
                color={text.info}
                size={24}
            />
          </View>
        </TouchableOpacity>
      </View>
  );
};

export default ForgotPasswordSuccess;