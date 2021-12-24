import { PermissionsAndroid, Platform } from 'react-native';
import { Camera } from 'expo-camera';

export const requestCameraAndAudioPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      const camera = await Camera.requestCameraPermissionsAsync();
      const microphone = await Camera.requestMicrophonePermissionsAsync();

      if (camera.granted && microphone.granted) {
        console.log('You can use the cameras & mic');
      } else {
        console.log('Permission denied');
      }
    } else {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        granted['android.permission.CAMERA'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('You can use the cameras & mic');
      } else {
        console.log('Permission denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
};
