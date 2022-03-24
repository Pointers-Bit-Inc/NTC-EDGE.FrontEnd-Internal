import OneSignal from 'react-native-onesignal'
import Constants from "expo-constants";
import IUser from 'src/interfaces/IUser';

const useOneSignal = (user:IUser) => {
  const initialize = () => {
    OneSignal.setAppId(Constants.manifest?.extra?.oneSignalAppId);
    OneSignal.setExternalUserId(user._id);
    // OneSignal.setNotificationWillShowInForegroundHandler(e => e.complete());
    if (user.email) OneSignal.setEmail(user.email);
    if (user.contactNumber) OneSignal.setSMSNumber(user.contactNumber);
    if (user.role?.key) OneSignal.sendTag("role", user.role.key);
    OneSignal.setLocationShared(true);
  }

  const destroy = () => {
    OneSignal.removeExternalUserId();
  }

  return {
    initialize,
    destroy,
  }
}

export default useOneSignal