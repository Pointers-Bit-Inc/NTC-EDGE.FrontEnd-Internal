import { useEffect, useState } from 'react';
import * as Keychain from 'react-native-keychain';
import { Alert, Platform } from 'react-native';

const ACCESS_CONTROL = Keychain.ACCESS_CONTROL.BIOMETRY_ANY;
const ACCESSIBLE = Keychain.ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY;
const AUTHENTICATION_TYPE = Keychain.AUTHENTICATION_TYPE.BIOMETRICS;
const STORAGE = Keychain.STORAGE_TYPE.RSA;
const BUNDLE_ID = 'portalapp.ntcedge.com';
const ACCESS_GROUP = `4A3P2635GN.${BUNDLE_ID}`;

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
    return await Keychain.setGenericPassword(username, password, {
      accessControl: ACCESS_CONTROL,
      accessible: ACCESSIBLE,
      accessGroup: ACCESS_GROUP,
      authenticationType: AUTHENTICATION_TYPE,
      storage: STORAGE,
      service: BUNDLE_ID
    });
  }

  const getCredentials = async () => {
    const options = {
      accessControl: ACCESS_CONTROL,
      accessGroup: ACCESS_GROUP,
      service: BUNDLE_ID,
      authenticationPrompt: {
        title: 'Login with your Biometrics',
        cancel: 'Cancel',
      },
    };
    return await Keychain.getGenericPassword(options);
  }

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
  };

  return {
    isBiometricSupported,
    credentials,
    handleBiometricAuth,
    storeCredentials,
  }
}

export default useBiometrics;