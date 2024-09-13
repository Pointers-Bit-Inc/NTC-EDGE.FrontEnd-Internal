import OneSignal from 'react-native-onesignal'
import Constants from "expo-constants";
import IUser from '@/src/interfaces/IUser';
import {StackActions, useNavigation} from "@react-navigation/native";
import {ACTIVITYITEM} from "../reducers/activity/initialstate";
import axios from "axios";
import {BASE_URL} from "../services/config";
import {ToastType} from "@atoms/toast/ToastProvider";
import Alert from "@atoms/alert";
import {setApplicationItem} from "../reducers/application/actions";
import {useDispatch} from "react-redux";

const useOneSignal = (user:IUser) => {
  const navigation = useNavigation();
  const dispatch=useDispatch();

  const initialize = () => {
    OneSignal.setAppId(Constants.manifest?.extra?.oneSignalAppId);
    OneSignal.provideUserConsent(true);
    OneSignal.promptForPushNotificationsWithUserResponse(() => {});
    OneSignal.setExternalUserId(user._id);
    // OneSignal.setNotificationWillShowInForegroundHandler(e => e.complete());
    if (user.email) OneSignal.setEmail(user.email);
    if (user.contactNumber) OneSignal.setSMSNumber(user.contactNumber);
    if (user.role?.key) OneSignal.sendTag("role", user.role.key);


    OneSignal.setNotificationOpenedHandler(notification => {
      const id = notification?.notification?.additionalData?.id;
      if (id) {
        axios.get(BASE_URL + "/applications/" + id, {
          headers: {
            Authorization: "Bearer ".concat(user?.sessionToken), CreatedAt: user?.createdAt
          }
        }).then((response) => {
          let _response = response.data
          if(_response?.region?.code){
            _response.region = _response?.region?.code
          }
          dispatch(setApplicationItem(_response))
          navigation.navigate(ACTIVITYITEM, {
            onDismissed: () => {
             if(navigation.canGoBack()){
               navigation.goBack()
             }else{
               navigation.dispatch(StackActions.replace('ActivitiesScreen'));
             }
            },
            onChangeEvent: () => {},
            onChangeAssignedId: () => {}
          })
        }).catch((error) => {

          let _err = '';

          for (const err in error?.response?.data?.errors) {
            _err += error?.response?.data?.errors?.[err]?.toString() + "\n";
          }
          if (_err || error?.response?.data?.message || error?.response?.statusText || (typeof error?.response?.data == "string") ) {
           // Alert(ToastType.Error, _err || error?.response?.data?.message || error?.response?.statusText || error?.response?.data)
          }

        });

      }
    });
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
