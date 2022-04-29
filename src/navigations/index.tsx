import * as React from 'react';
import {NavigationContainer , useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ForgotPassword from './forgot-password';
import Dial from '@screens/meet/video';
import VideoCall from '@screens/meet/video';
import JoinVideoCall from '@screens/meet/video';
import App from '@screens/app';
import AppIntro from '@screens/intro';
import UserProfile from "@pages/user-profile";
import Settings from '@pages/settings';

import Meeting from '@screens/meet';
import Participants from '@screens/meet/participants';
import CreateMeeting from '@screens/meet/create';
import InitiateVideoCall from '@screens/meet/create';

import ChatList from '@screens/chat';
import ViewChat from '@screens/chat/view';
import ChatInfo from '@screens/chat/info';
import NewChat from '@screens/chat/new-chat';
import Search from "@pages/activities/search";
import TabBar from "@pages/activities/tabbar";
import {Image , Platform , TouchableOpacity , View} from "react-native";
import {primaryColor} from "@styles/color";
import EdgeLogo from "@assets/svg/edge";
import SettingTopBar from "@assets/svg/settingTopBar";
import HelpTopBar from "@assets/svg/helpTopbar";
import {RootStateOrAny ,  useSelector} from "react-redux";
import {fontValue} from "@pages/activities/fontValue";
import ProfileImage from "@atoms/image/profile";
import {createRef , useRef} from "react";
import {isMobile} from "@pages/activities/isMobile";
import Login from "@screens/login/login";

type RootStackParamList = {
    App: undefined;
    AppIntro: undefined;
    Login: undefined;
    ForgotPassword: undefined;
    HomeScreen: undefined;
    QrCodeScreen: undefined;
    ActivitiesScreen: undefined;
    UserProfileScreen: undefined;
    Settings: undefined;
    DrawerNavigation: undefined;
    Dial: undefined;
    Meeting: undefined;
    Participants: undefined;
    CreateMeeting: undefined;
    VideoCall: undefined;
    ChatList: undefined;
    ViewChat: undefined;
    ChatInfo: undefined;
    NewChat: undefined;
    InitiateVideoCall: undefined;
    JoinVideoCall: undefined;
    SearchActivities: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();



const RootNavigator = () => {
    const user = useSelector((state: RootStateOrAny) => state.user) || {};
    return (
        <NavigationContainer>

            <Stack.Navigator

                screenOptions={ {
                    gestureEnabled : false ,
                    headerShown : false ,

                } }

                initialRouteName="App"
            >

                <Stack.Screen name="App" component={ App }/>
                <Stack.Screen name="AppIntro" component={ AppIntro }/>
                <Stack.Screen name="Login" component={ Login }/>
                <Stack.Screen name="ForgotPassword" component={ ForgotPassword }/>
                <Stack.Screen name="ActivitiesScreen" component={ TabBar } options={
                    {
                        title : null ,
                        headerRight : () => {
                            const navigation = useNavigation();
                            return <View style={ { paddingRight : 32 , gap : 32 , flexDirection : "row" } }>
                                <SettingTopBar height={ 26 } width={ 26 }></SettingTopBar>
                                <HelpTopBar height={ 26 } width={ 26 }></HelpTopBar>
                                <TouchableOpacity onPress={()=> navigation.navigate("Settings")}>
                                    <ProfileImage
                                        style={ {
                                            borderRadius : 26 , } }
                                        size={ fontValue(28) }
                                        image={ user?.profilePicture?.small }
                                        name={ `${ user?.firstName } ${ user?.lastName }` }
                                    />
                                </TouchableOpacity>

                            </View>
                        },
                        headerLeft : () => (
                            <View style={ { paddingLeft : 32 } }>
                                <EdgeLogo width={ 127 } height={ 29 }/>
                            </View>
                        ) ,
                        headerShown : isMobile ? false : true ,
                        headerStyle : {

                            backgroundColor : primaryColor ,
                        }
                    }
                }/>
                <Stack.Screen name="UserProfileScreen" component={ UserProfile }/>
                <Stack.Screen name="Settings" component={ Settings }/>
                <Stack.Screen name="Dial" component={ Dial }/>
                <Stack.Screen name="Meeting" component={ Meeting }/>
                <Stack.Screen name="Participants" component={ Participants }/>
                <Stack.Screen name="CreateMeeting" component={ CreateMeeting }/>
                <Stack.Screen name="VideoCall" component={ VideoCall }/>
                <Stack.Screen name="ChatList" component={ ChatList }/>
                <Stack.Screen name="ViewChat" component={ ViewChat }/>
                <Stack.Screen name="ChatInfo" component={ ChatInfo }/>
                <Stack.Screen name="NewChat" component={ NewChat }/>
                <Stack.Screen name="InitiateVideoCall" component={ InitiateVideoCall }/>
                <Stack.Screen name="JoinVideoCall" component={ JoinVideoCall }/>
                <Stack.Screen name="SearchActivities" component={ Search }/>
            </Stack.Navigator>
        </NavigationContainer>

    );
};

export default RootNavigator;
