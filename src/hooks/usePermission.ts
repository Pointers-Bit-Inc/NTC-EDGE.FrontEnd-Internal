import { requestMultiple, PERMISSIONS, openSettings } from 'react-native-permissions'

export const requestCameraAndAudioPermission = async () => {
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
      } else {
        console.log('Permissions denied');
        openSettings().catch(() => console.warn('cannot open settings'));
      }
    });
  } catch (err) {
    console.warn(err);
  }
};
