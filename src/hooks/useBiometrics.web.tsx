import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import * as LocalAuthentication from 'expo-local-authentication';
import { Alert, Platform } from 'react-native';

const ACCESSIBLE = Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY;
const STORAGE = Keychain.STORAGE_TYPE.AES;
const BUNDLE_ID = 'portalapp.ntcedge.com';

const options = {
  accessible: ACCESSIBLE,
  storage: STORAGE,
  service: Platform.OS === 'ios' ? undefined : BUNDLE_ID
}

export const resetCredentials = async () => {
  return await Keychain.resetGenericPassword();
}

const useBiometrics = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [credentials, setCredentials] = useState<false|Keychain.UserCredentials>(false);

  useEffect(() => {
    (async () => {
      Keychain.getSupportedBiometryType()
          .then(biometryType => {
            if (!!biometryType) setIsBiometricSupported(true)
            else setIsBiometricSupported(false)
          })
    })();
  }, []);

  const storeCredentials = async (username:string, password:string) => {
    await resetCredentials();
    return await Keychain.setGenericPassword(username, password, options);
  }

  const getCredentials = async () => await Keychain.getGenericPassword(options);

  const alertComponent = (title:string, msg:string|undefined, btnTxt:string, btnFunc:() => any) => {
    return Alert.alert(title, msg, [
      {
        text: btnTxt,
        onPress: btnFunc,
      },
    ]);
  };

  const handleBiometricAuth = async () => {
    setCredentials(false);
    // Check if hardware supports biometrics
    // Check Biometrics are saved locally in user's device
    if (!isBiometricSupported) return null;

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
      await getCredentials().then(res => {
        setCredentials(res);
      })
          .catch((e) => {
            var properties = e?.message?.split(', ');
            var obj:any = {};
            properties.forEach(function(property:string) {
              var tup = property.split(': ');
              obj[tup[0]] = tup[1];
            });
            if (obj?.msg && !(obj?.code === '13' || obj?.code === '10')) {
              alertComponent(
                  'Alert',
                  obj?.msg || 'Something went wrong',
                  'Ok',
                  () => {}
              );
            }
          })
    }
  };

  return {
    isBiometricSupported,
    credentials,
    handleBiometricAuth,
    storeCredentials,
  }
}

export default useBiometrics;