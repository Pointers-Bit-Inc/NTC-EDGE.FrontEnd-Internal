import React, {useCallback, useState} from 'react';
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
import {button} from "@styles/color";
import AwesomeAlert from "react-native-awesome-alerts";
import {resetUser} from "../../reducers/user/actions";
import { resetMeeting } from 'src/reducers/meeting/actions';
import { resetChannel } from 'src/reducers/channel/actions';
import Api from 'src/services/api';
import UserProfileScreen from "@screens/HomeScreen/UserProfile";
import {useWindowDimensions} from "react-native";
import Search from "@pages/activities/search";
import {RFValue} from "react-native-responsive-fontsize";
const Drawer = createDrawerNavigator();


const ActivitiesScreen = (props:any) => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootStateOrAny) => state.user);
    const onHide = () => setShowAlert(false)
    const onShow = () => setShowAlert(true);
    const [showAlert, setShowAlert] = useState(false);
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
    const dimensions = useWindowDimensions();
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
            titleStyle={styles.alertMessage}
            title={'Are you sure you would like to log out?'}
            contentStyle={styles.contentStyle}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Yes"
            confirmText="No"
            confirmButtonColor={'white'}
            cancelButtonColor={button.primary}
            confirmButtonStyle={styles.cancelButton}
            confirmButtonTextStyle={styles.cancelText}
            cancelButtonStyle={styles.confirmButton}
            cancelButtonTextStyle={styles.confirmText}
            actionContainerStyle={styles.actionContainerStyle}
            onCancelPressed={onLogout}
            onConfirmPressed={onHide}
        />
    </>

}

export default ActivitiesScreen