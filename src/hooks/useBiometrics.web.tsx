import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

const BUNDLE_ID = 'portalapp.ntcedge.com';



const useBiometrics = () => {





  const alertComponent = (title:string, msg:string|undefined, btnTxt:string, btnFunc:() => any) => {
    return Alert.alert(title, msg, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {

    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    if (!biometricAuth.success && biometricAuth.error == 'lockout') {
      return alertComponent(
        'Alert',
        biometricAuth.warning || 'Something went wrong',
        'OK',
        () => {}
      );
    }

    if (biometricAuth.success) {

    }
  };

  return {

    handleBiometricAuth
  }
}

export default useBiometrics;