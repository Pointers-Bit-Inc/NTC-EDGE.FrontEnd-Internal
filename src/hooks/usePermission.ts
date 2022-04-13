import { Platform } from 'react-native';
import { requestMultiple, PERMISSIONS, openSettings } from 'react-native-permissions'

export const requestCameraAndAudioPermission = async (callback = (err:any, success:any) => {}) => {
  if (Platform.OS !== 'android') {
    return callback(null, { success: true });
  }
  try {
    await requestMultiple([
      PERMISSIONS.IOS.CAMERA,
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.IOS.MICROPHONE,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ])
    .then(status => {
      if (
        (
          status[PERMISSIONS.IOS.CAMERA] === 'granted' &&
          status[PERMISSIONS.IOS.MICROPHONE] === 'granted'
        ) || (
          status[PERMISSIONS.ANDROID.CAMERA] === 'granted' &&
          status[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted'
        )
      ) {
        console.log('You can now use mic & camera');
        return callback(null, { success: true });
      } else {
        console.log('Permissions denied');
        return callback({ error: true }, null);
      }
    });
  } catch (err) {
    console.warn(err);
    return callback({ error: true }, null);
  }
};
