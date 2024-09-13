import * as React from 'react';
import {useEffect,useState} from 'react';
import {NavigationContainer,StackActions,useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import lodash from 'lodash';
import ForgotPassword from './forgot-password';
import App from '@screens/app';
import AppIntro from '@screens/intro';
import UserProfile from "@pages/user-profile";
import Settings from '@pages/settings';

import Meeting from '@screens/meet';
import Participants from '@screens/meet/add-participants';
import CreateMeeting from '@screens/meet/create';
import VideoCall from '@screens/meet/video';

import ChatList from '@screens/chat';
import ViewChat from '@screens/chat/view';
import ChatInfo from '@screens/chat/info';
import MeetingParticipants from '@screens/meet/participants';
import NewChat from '@screens/chat/new-chat';
import Search from "@pages/activities/search";
import TabBar from "@pages/activities/tabbar";
import {Platform,Text,TouchableOpacity,View} from "react-native";
import {primaryColor} from "@styles/color";
import EdgeLogo from "@assets/svg/edge";
import SettingTopBar from "@assets/svg/settingTopBar";
import HelpTopBar from "@assets/svg/helpTopbar";
import {RootStateOrAny,useDispatch,useSelector} from "react-redux";
import {isMobile} from "@pages/activities/isMobile";
import Login from "@screens/login/login";
import SignalR from "@pages/signalr";
import FloatingVideo from '@components/pages/chat-modal/floating-video';
import {useComponentLayout} from "../hooks/useComponentLayout";
import {
    setApplicationItem,
    setApplications,
    setNotPinnedApplication,
    setPinnedApplication,
    setTopBarNav
} from "../reducers/application/actions";
import ProfileMenu from "@molecules/headerRightMenu";
import CustomAlert from "@pages/activities/alert/alert1";
import {resetUser} from "../reducers/user/actions";
import {setResetFilterStatus} from "../reducers/activity/actions";
import {resetMeeting} from "../reducers/meeting/actions";
import {resetChannel} from "../reducers/channel/actions";
import useOneSignal from "../hooks/useOneSignal";
import {ACTIVITYITEM, EDITAPPLICATION} from "../reducers/activity/initialstate";
import ActivityModal from "@pages/activities/modal";
import ChooseNewPassword from "@screens/ChooseNewPassword";
import * as Linking from 'expo-linking';
import EditApplication from "@pages/activities/application/editApplication";
import useApplicationSignalr from "../hooks/useApplicationSignalr";
const prefix = Linking.createURL('/');
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
    VideoCall: undefined;
    Meeting: undefined;
    Participants: undefined;
    CreateMeeting: undefined;
    ChatList: undefined;
    ViewChat: undefined;
    ChatInfo: undefined;
    MeetingParticipants: undefined;
    NewChat: undefined;
    SearchActivities: undefined;
    Dashboard: undefined;
    ActivityItem: undefined;
    EditApplication: undefined;
    UserEdit: undefined;
    ChooseNewPassword: undefined;
    SignalR: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
    prefixes: [prefix],
    config: {
        screens: {
            App: '',
            AppIntro: 'Intro',
            SignalR: 'SignalR',
            Login: 'Login',
            ForgotPassword: 'Forgot-Password',
            HomeScreen: 'Home',
            QrCodeScreen: 'Scanner',
            UserProfileScreen: 'Profile',
            Settings: 'Settings',
            Dial: 'Dial',
            Meeting: 'Meeting',
            Participants: 'Participants',
            CreateMeeting: 'Create-Meeting',
            VideoCall: 'VideoCall',
            ChatList: 'Chat-List',
            ViewChat: 'Chat/:id',
            ChatInfo: 'Chat-Info',
            MeetingParticipants: 'Meeting-Participants',
            NewChat: 'New-Chat',
            SearchActivities: 'Search-Activities',
            Dashboard: 'Dashboard',
            ChooseNewPassword: 'Choose-New-Password/:token?'
        }
    },
};

const FloatingVideoComponent = () => {
    const meetingId = useSelector((state:RootStateOrAny) => state.meeting.meeting?._id);

    if (lodash.size(meetingId) > 0 && Platform?.OS !== 'web') {
        return <FloatingVideo />;
    }

    return null
}

const HeaderRight = ({ setVisible = () => {}, visible }:any) => {
    const user = useSelector((state: RootStateOrAny) => state.user) || {};
    const navigation = useNavigation();
    const {destroy} = useOneSignal(user);
    const dispatch=useDispatch();
    const [activitySizeComponent,onActivityLayoutComponent]=useComponentLayout();

    const onLogout = () => {
        setVisible(false)
        setTimeout(()=>{
            dispatch(setApplications([]))
            dispatch(setPinnedApplication([]))
            dispatch(setNotPinnedApplication([]))
            dispatch(setApplicationItem({}))
            dispatch(setResetFilterStatus([]))
            dispatch(resetUser());
            dispatch(resetMeeting());
            dispatch(resetChannel());
            destroy();
            navigation.dispatch(StackActions.replace('Login'));
        },500);
    }

    useEffect(()=>{
        dispatch(setTopBarNav(activitySizeComponent))
    }, [activitySizeComponent?.width])

    return (
        <View onLayout={onActivityLayoutComponent} style={{flexDirection:"row"}}>
            <View style={{paddingRight:32}}>
                <SettingTopBar height={26} width={26}></SettingTopBar>
            </View>
            <View style={{paddingRight:32}}>
                <HelpTopBar height={26} width={26}></HelpTopBar>
            </View>
            <View style={{paddingRight:32}}>

                <ProfileMenu onClose={()=>{

                }} onSelect={value=>{
                    if(value=="editProfile"){
                        navigation.navigate('UserProfileScreen')
                    } else if(value=="logout"){
                        setVisible(true)
                    }
                }} user={user}/>
                <CustomAlert
                    showClose={false}
                    show={visible}
                    title='Log out'
                    message='Are you sure you want to log out?'
                    confirmText='OK'
                    cancelText='Cancel'
                    onConfirmPressed={onLogout}
                    onDismissed={()=>setVisible(false)}
                    onCancelPressed={()=>setVisible(false)}
                />
            </View>
        </View>
    )
}

const RootNavigator = () => {
    const [visible, setVisible] = useState(false);

    return (
        <NavigationContainer linking={linking}>

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
                <Stack.Screen name="ChooseNewPassword" component={ ChooseNewPassword }/>
                <Stack.Screen name="ForgotPassword" component={ ForgotPassword }/>
                <Stack.Screen name="ActivitiesScreen" component={ TabBar } options={
                    {
                        title : null ,
                        headerRight : () => (
                            <HeaderRight setVisible={setVisible} visible={visible} />
                        ),
                        headerLeft : () => (
                            <View style={ { paddingLeft : 32 } }>
                                <EdgeLogo width={ 127 } height={ 29 }/>
                            </View>
                        ) ,
                        headerShown : (isMobile && !Platform?.isPad) ? false : true ,
                        headerStyle : {

                            backgroundColor : primaryColor ,
                        }
                    }
                }/>

                <Stack.Screen name="SignalR" component={ SignalR }/>
                <Stack.Screen name="UserProfileScreen" component={ UserProfile }/>
                <Stack.Screen name="Settings" component={ Settings }/>
                <Stack.Screen name="Meeting" component={ Meeting }/>
                <Stack.Screen name="VideoCall" component={ VideoCall }/>
                <Stack.Screen name="Participants" component={ Participants }/>
                <Stack.Screen name="CreateMeeting" component={ CreateMeeting }/>
                <Stack.Screen name="ChatList" component={ ChatList }/>
                <Stack.Screen name="ViewChat" component={ ViewChat }/>
                <Stack.Screen name="ChatInfo" component={ ChatInfo }/>
                <Stack.Screen name="MeetingParticipants" component={ MeetingParticipants }/>
                <Stack.Screen name="NewChat" component={ NewChat }/>
                <Stack.Screen name="SearchActivities" component={ Search }/>
                <Stack.Screen name={ACTIVITYITEM} component={ActivityModal} />
                <Stack.Screen name={EDITAPPLICATION} component={EditApplication} />


            </Stack.Navigator>
            <FloatingVideoComponent />
            {visible && <View style={{zIndex: -1, position: "absolute", width: "100%", height: "100%",backgroundColor: "rgba(0,0,0,0.5)"}}/>}
        </NavigationContainer>

    );
};

export default RootNavigator;
