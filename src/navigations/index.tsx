import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer,useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import lodash from 'lodash';
import ForgotPassword from './forgot-password';
import Dial from '@screens/meet/video';
import VideoCall from '@screens/meet/video';
import JoinVideoCall from '@screens/meet/video';
import App from '@screens/app';
import AppIntro from '@screens/intro';
import UserProfile from "@pages/user-profile";
import Settings from '@pages/settings';

import Meeting from '@screens/meet';
import Participants from '@screens/meet/add-participants';
import CreateMeeting from '@screens/meet/create';
import InitiateVideoCall from '@screens/meet/create';

import ChatList from '@screens/chat';
import ViewChat from '@screens/chat/view';
import ChatInfo from '@screens/chat/info';
import MeetingParticipants from '@screens/meet/participants';
import NewChat from '@screens/chat/new-chat';
import Search from "@pages/activities/search";
import TabBar from "@pages/activities/tabbar";
import {Platform,TouchableOpacity,View} from "react-native";
import {primaryColor} from "@styles/color";
import EdgeLogo from "@assets/svg/edge";
import SettingTopBar from "@assets/svg/settingTopBar";
import HelpTopBar from "@assets/svg/helpTopbar";
import {RootStateOrAny,useDispatch,useSelector} from "react-redux";
import ProfileImage from "@atoms/image/profile";
import {isMobile} from "@pages/activities/isMobile";
import Login from "@screens/login/login";
import FloatingVideo from '@components/pages/chat-modal/floating-video';
import {useComponentLayout} from "../hooks/useComponentLayout";
import {setTopBarNav} from "../reducers/application/actions";

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
    MeetingParticipants: undefined;
    NewChat: undefined;
    InitiateVideoCall: undefined;
    JoinVideoCall: undefined;
    SearchActivities: undefined;
    Dashboard: undefined;
};
const Stack = createNativeStackNavigator<RootStackParamList>();



const RootNavigator = () => {
    const user = useSelector((state: RootStateOrAny) => state.user) || {};
    const { meeting } = useSelector((state:RootStateOrAny) => state.meeting);

    const renderFloatingVideo = () => {
        if (Platform?.OS === 'web') {
            return null
        }

        if (lodash.size(meeting) > 0) {
            return <FloatingVideo />;
        }

        return null;
    }

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
                            const dispatch=useDispatch();
                            const [activitySizeComponent,onActivityLayoutComponent]=useComponentLayout();
                            useEffect(()=>{
                                dispatch(setTopBarNav(activitySizeComponent))
                            }, [activitySizeComponent?.width])
                            const navigation = useNavigation();
                            return <View  onLayout={onActivityLayoutComponent}  style={ { flexDirection : "row" } }>
                                <View style={{paddingRight: 32}}>
                                    <SettingTopBar height={ 26 } width={ 26 } ></SettingTopBar>
                                </View>
                                <View  style={{paddingRight: 32}}>
                                    <HelpTopBar height={ 26 } width={ 26 }></HelpTopBar>
                                </View>
                                <View style={{paddingRight: 32}}>
                                    <TouchableOpacity onPress={()=> navigation.navigate("Settings")}>
                                        <ProfileImage
                                            style={ {
                                                borderRadius : 26 , } }
                                            size={28 }
                                            image={ user?.profilePicture?.small }
                                            name={ `${ user?.firstName } ${ user?.lastName }` }
                                        />
                                    </TouchableOpacity>
                                </View>


                            </View>
                        },
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
                <Stack.Screen name="MeetingParticipants" component={ MeetingParticipants }/>
                <Stack.Screen name="NewChat" component={ NewChat }/>
                <Stack.Screen name="InitiateVideoCall" component={ InitiateVideoCall }/>
                <Stack.Screen name="JoinVideoCall" component={ JoinVideoCall }/>
                <Stack.Screen name="SearchActivities" component={ Search }/>
            </Stack.Navigator>
            {renderFloatingVideo()}
        </NavigationContainer>

    );
};

export default RootNavigator;
