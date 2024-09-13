import React, { useState, useCallback } from 'react';
import { createDrawerNavigator, DrawerItem, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUser } from '@/src/reducers/user/actions'
import AwesomeAlert from 'react-native-awesome-alerts';
import HomeScreen from '@screens/HomeScreen';
import { Entypo, Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { primaryColor, button } from '@/src/styles/color';
import styles from './styles';
import UserProfile from "@pages/user-profile";

type DrawerScreenList = {
    Home: undefined,
    Profile: undefined,
    Account: undefined,
    Notifications: undefined,
    Help: undefined,
    About: undefined,
    Logout: undefined,
}
const Drawer = createDrawerNavigator<DrawerScreenList>();

const CustomDrawerContent = ({onLogout, ...props}:any) => {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <DrawerItem
          label="Logout"
          icon={({ color, size }) => <MaterialIcons name="logout" color={color} size={size} />}
          onPress={onLogout}
        />
      </DrawerContentScrollView>
    );
  }

const DrawerNavigation = ({ navigation }:any) => {
  const dispatch = useDispatch();
  const [showAlert, setShowAlert] = useState(false);
  const user = useSelector((state: RootStateOrAny) => state.user);
  const onLogout = useCallback(() => {
    onHide();
    dispatch(setUser({}));
    setTimeout(() => {
      navigation.replace('Login');
    }, 100);
  }, []);

  const onHide = () => setShowAlert(false)
  const onShow = () => setShowAlert(true);

  return (
    <>
      <Drawer.Navigator
        initialRouteName="Home"
        screenOptions={{
            drawerActiveTintColor: primaryColor,
            drawerActiveBackgroundColor: 'rgba(0,0,0,0)',
            drawerPosition: 'right',
            headerShown: false,
        }}
        drawerContent={props => <CustomDrawerContent onLogout={onShow} {...props} />}
      >
        <Drawer.Screen name="Profile" options={{ title: "Wave C. Ambray", drawerIcon: ({ color, size }) => <Ionicons name="ios-person-circle-outline" color={color} size={size} /> }} component={UserProfile} />
        <Drawer.Screen name="Home" options={{ drawerIcon: ({ color, size }) => <Feather name="home" color={color} size={size} /> }} component={HomeScreen} />
        <Drawer.Screen name="Account" options={{ drawerIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} /> }} component={HomeScreen} />
        <Drawer.Screen name="Notifications" options={{ drawerIcon: ({ color, size }) => <Ionicons name="ios-megaphone-outline" color={color} size={size} /> }} component={HomeScreen} />
        <Drawer.Screen name="Help" options={{ title: "Help Center",drawerIcon: ({ color, size }) => <Entypo name="lifebuoy" color={color} size={size} /> }} component={HomeScreen} />
        <Drawer.Screen name="About" options={{ drawerIcon: ({ color, size }) => <Feather name="info" color={color} size={size} /> }} component={HomeScreen} />
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
  )
}

export default DrawerNavigation
