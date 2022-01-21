import React, { useState, useCallback } from 'react';
import {SafeAreaView, Text, StyleSheet, View} from 'react-native';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from 'src/reducers/user/actions'
import { resetMeeting } from 'src/reducers/meeting/actions';
import { resetChannel } from 'src/reducers/channel/actions';
import AwesomeAlert from 'react-native-awesome-alerts';
import { button, text } from 'src/styles/color';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30
  },
  alertMessage: {
    textAlign: 'center',
    color: text.default,
  },
  contentStyle: {
    padding: 30,
  },
  actionContainerStyle: {
    justifyContent: 'space-around',
  },
  confirmButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderWidth: 1,
    borderColor: text.default,
  },
  confirmText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelText: {
    color: text.default,
    fontSize: 14,
    fontWeight: '600',
  }
});

const Home = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const user = useSelector((state: RootStateOrAny) => state.user);
  const onLogout = useCallback(() => {
    onHide();
    dispatch(setUser({}));
    dispatch(resetMeeting());
    dispatch(resetChannel());
    setTimeout(() => {
      navigation.replace('Login');
    }, 100);
  }, []);

  const onHide = () => setShowAlert(false)

  return (
    <SafeAreaView style={styles.container}>

      <Text onPress={() => setShowAlert(true)}>Welcome, {user.email}</Text>



      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        titleStyle={styles.alertMessage}
        title={'Are you sure you would\nlike to log out?'}
        contentStyle={styles.contentStyle}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={true}
        showConfirmButton={true}
        cancelText="Yes"
        confirmText="No"
        confirmButtonColor={'white'}
        cancelButtonColor={button.primary}
        confirmButtonStyle={styles.cancelButton}
        confirmButtonTextStyle={styles.cancelText}
        cancelButtonStyle={styles.confirmButton}
        cancelButtonTextStyle={styles.confirmText}
        actionContainerStyle={styles.actionContainerStyle}
        onCancelPressed={onLogout}
        onConfirmPressed={onHide}
      />


    </SafeAreaView>
  );
};

export default Home;
