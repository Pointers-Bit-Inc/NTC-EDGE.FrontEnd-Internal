import React, {useCallback, useState, useEffect} from 'react';
import { StackActions } from '@react-navigation/native';
import ActivitiesPage from "@pages/activities/tabbar";
import {createDrawerNavigator} from "@react-navigation/drawer";
import CustomSidebarMenu from "@pages/activities/customNavigationDrawer";
import AccountIcon from "@assets/svg/account";
import BellIcon from "@assets/svg/bell";
import DonutIcon from "@assets/svg/donut";
import WarningIcon from "@assets/svg/warning";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import styles from "@screens/HomeScreen/DrawerNavigation/styles";
import {button, outline} from "@styles/color";
import AwesomeAlert from "react-native-awesome-alerts";
import {resetUser} from "../../reducers/user/actions";
import { resetMeeting, addMeeting, updateMeeting, setConnectionStatus } from 'src/reducers/meeting/actions';
import { resetChannel, addMessages, updateMessages, addChannel, removeChannel } from 'src/reducers/channel/actions';
import Api from 'src/services/api';
import UserProfileScreen from "@screens/HomeScreen/UserProfile";
import useSignalr from 'src/hooks/useSignalr';
import lodash from 'lodash';
import RNExitApp from 'react-native-exit-app';
import { Alert, BackHandler, Linking, Dimensions, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { text } from '@styles/color';
import { Bold, Regular } from '@styles/font';
const Drawer = createDrawerNavigator();

const { width } = Dimensions.get('window');

const customStyles = StyleSheet.create({
  confirmText: {
    fontSize: RFValue(14),
    fontFamily: Regular,
    color: text.primary,
  },
  title: {
    textAlign: 'center',
    fontSize: RFValue(16),
    fontFamily: Bold,
    color: '#1F2022'
  },
  message: {
    textAlign: 'center',
    fontSize: RFValue(14),
    fontFamily: Regular,
    marginHorizontal: 15,
    marginBottom: 15,
  },
  content: {
    borderBottomColor: outline.default,
    borderBottomWidth: 1,
  }
})

const ActivitiesScreen = (props:any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const onHide = () => setShowAlert(false)
    const onShow = () => setShowAlert(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData] = useState({});
    const [versionChecked, setVersionChecked] = useState(false);
    const {
        connectionStatus,
        initSignalR,
        destroySignalR,
        onConnection,
        checkVersion,
      } = useSignalr();
    const onLogout = useCallback(() => {
        const api = Api(user.sessionToken);
        onHide();
        setTimeout(() => {
            api.post('/user/logout')
            .then(() => {
                dispatch(resetUser());
                dispatch(resetMeeting());
                dispatch(resetChannel());
                props.navigation.dispatch(StackActions.replace('Login'));
            });
        }, 500);
    }, []);

    const onPressAlert = () => {
      if (alertData.link) {
        return Linking.openURL(alertData.link);
      } else {
        return RNExitApp.exitApp();
      }
    }

    useEffect(() => {
      dispatch(setConnectionStatus(connectionStatus));
      let unmount = false

      if (!versionChecked && connectionStatus === 'connected') {
        checkVersion((err, res) => {
          if (!unmount) {
            setVersionChecked(true);
            if (res) {
              setAlertData(res);
              setShowAlert(true);
            }
          }
        })
      }
      return () => {
        unmount = true;
      }
    }, [connectionStatus])

    useEffect(() => {
        initSignalR();
        onConnection('OnChatUpdate', (users, type, data) => {
          if (data) {
            switch(type) {
              case 'create': {
                dispatch(addMessages(data.roomId, data));
                break;
              }
              case 'update': {
                dispatch(updateMessages(data.roomId, data));
                break;
              }
            }
          }
        });

        onConnection('OnRoomUpdate', (users, type, data) => {
          if (data) {
            switch(type) {
              case 'create': {
                dispatch(addChannel(data));
                dispatch(addMessages(data._id, data.lastMessage));
                break;
              }
              case 'delete': dispatch(removeChannel(data._id)); break;
            }
          }
        });

        onConnection('OnMeetingUpdate', (users, type, data) => {
          if (data) {
            switch(type) {
              case 'create': {
                const { room } = data;
                const { lastMessage } = room;
                dispatch(addChannel(room));
                dispatch(addMessages(room._id, lastMessage));
                dispatch(addMeeting(data));
                break;
              };
              case 'update': {
                const { room = {} } = data;
                const { lastMessage } = room;
                if (lastMessage) dispatch(addChannel(room));
                if (lastMessage) dispatch(addMessages(room._id, lastMessage));
                dispatch(updateMeeting(data));
                break;
              }
            }
          }
        });
    
        return () => destroySignalR();
      }, []);

    return <>

        <Drawer.Navigator
           
            screenOptions={{

                drawerStyle: {
                    width: 108
                },
                drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
                drawerItemStyle:{
                    backgroundColor: 'rgba(0,0,0,0)',
                    marginLeft: 20,
                    marginBottom: 20,
                },
            }}
            backBehavior='none'

            drawerContent={(props) => <CustomSidebarMenu onLogout={onShow} {...props} />} initialRouteName="Home">
           <Drawer.Screen   options={{ drawerLabel: "Activity",   headerShown: false }}  name="activity"  component={ActivitiesPage} />
           <Drawer.Screen   options={{ drawerLabel: "Chat",   headerShown: false }}  name="chat"  component={ActivitiesPage} />
           <Drawer.Screen   options={{ drawerLabel: "Meet",   headerShown: false }}  name="meet"  component={ActivitiesPage} />

            <Drawer.Screen  options={{ drawerItemStyle: {display: "none"}, headerShown: false }}  name="search" component={Search} />

        </Drawer.Navigator>
        <AwesomeAlert
            show={showAlert}
            showProgress={false}
            contentContainerStyle={{ borderRadius: 15, maxWidth: width * 0.7 }}
            titleStyle={customStyles.title}
            title={alertData?.title || 'Alert'}
            message={alertData?.message}
            messageStyle={customStyles.message}
            contentStyle={customStyles.content}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={false}
            showConfirmButton={true}
            confirmText={alertData.button || 'OK'}
            confirmButtonColor={'white'}
            confirmButtonTextStyle={customStyles.confirmText}
            actionContainerStyle={{ justifyContent: 'space-around' }}
            onConfirmPressed={onPressAlert}
        />
    </>

}

export default ActivitiesScreen