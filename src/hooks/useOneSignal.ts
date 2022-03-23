import OneSignal from 'react-native-onesignal'
import Constants from "expo-constants";
import IParticipants from 'src/interfaces/IParticipants';

const useOneSignal = (user:IParticipants) => {
  const initialize = () => {
    OneSignal.setAppId(Constants.manifest?.extra?.oneSignalAppId);
    OneSignal.setExternalUserId(user._id);
    OneSignal.setEmail(user.email);
    OneSignal.setSMSNumber(user.contactNumber);
    OneSignal.setLocationShared(true);
  }

  const destroy = () => {
    OneSignal.removeExternalUserId();
    OneSignal.logoutSMSNumber();
    OneSignal.logoutEmail();
  }

  return {
    initialize,
    destroy,
  }
}

export default useOneSignal