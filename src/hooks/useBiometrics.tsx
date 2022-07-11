import { useEffect, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert } from 'react-native';

const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [grantAccess, setGrantAccess] = useState(false);

  useEffect(() => {
    (async () => {
      // Check if hardware supports biometrics
      const compatible = await LocalAuthentication.hasHardwareAsync();
      // Check Biometrics are saved locally in user's device
      const savedBiometrics = await LocalAuthentication.isEnrolledAsync();

      setIsBiometricSupported(compatible && savedBiometrics);
    })();
  });

  const alertComponent = (title:string, msg:string|undefined, btnTxt:string, btnFunc:() => any) => {
    return Alert.alert(title, msg, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    setGrantAccess(false);
    // Check if hardware supports biometrics
    // Check Biometrics are saved locally in user's device
    if (!isBiometricSupported) return null;

    // Check Biometrics types available (Fingerprint, Facial recognition, Iris recognition)
    await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Authenticate use with Biometrics (Fingerprint, Facial recognition, Iris recognition)
    const biometricAuth = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Biometrics',
      cancelLabel: 'Cancel',
      disableDeviceFallback: true,
    });

    if (!biometricAuth.success && biometricAuth.error == 'lockout') {
      return alertComponent(
        'Alert',
        'Too many attempts. Please try again later.',
        'OK',
        () => {}
      );
    }

    if (biometricAuth.success) setGrantAccess(true);
  };

  return {
    isBiometricSupported,
    grantAccess,
    handleBiometricAuth,
  }
}

export default useBiometrics;