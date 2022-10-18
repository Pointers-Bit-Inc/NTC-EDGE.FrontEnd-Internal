import * as React from 'react';
import {useEffect,useMemo,useState} from 'react';
import {
    Dimensions,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';
import {createDrawerNavigator,} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import QrCodeScanner from "@pages/barcode/view";
import MeetScreen from '@screens/meet';
import ChatScreen from '@screens/chat';
import {Ionicons} from "@expo/vector-icons";
import ActivityTabbar from "@assets/svg/activitytabbar";
import ChatIcon from "@assets/svg/chattabbar";
import MeetIcon from "@assets/svg/meettabbar";
import ScanQrIcon from "@assets/svg/scanqrtabbar";
import MoreTabBarIcon from "@assets/svg/moretabbar";
import {
    ACTIVITIES, ADMIN,
    CHAT,
    CHECKER, CONFIGURATION, DASHBOARD,
    DIRECTOR, EMPLOYEES,
    EVALUATOR, GROUP,
    MEET,
    MORE, REPORT, ROLEANDPERMISSION,
    SCANQR, SCHEDULE,
    SEARCH, SETTINGS, USERS,
} from "../../../reducers/activity/initialstate";
import {RootStateOrAny,useDispatch,useSelector} from "react-redux";
import {setTabBarHeight} from "../../../reducers/application/actions";
import lodash from 'lodash';
import {getRole} from "@pages/activities/script";
import {Bold,Regular} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {Audio} from 'expo-av';
import CustomSidebarMenu from "@pages/activities/customNavigationDrawer";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import useSignalr from 'src/hooks/useSignalr';
import {setConnectionStatus} from 'src/reducers/meeting/actions';
import RNExitApp from 'react-native-exit-app';
import AwesomeAlert from 'react-native-awesome-alerts';
import {outline,text} from '@styles/color';
import IMeetings from 'src/interfaces/IMeetings';
import IParticipants from 'src/interfaces/IParticipants';
import IRooms from 'src/interfaces/IRooms';
import ActivitiesNavigator from "../../../navigations/activities";
import DashboardNavigator from "../../../navigations/dashboard";
import ReportNavigator from "../../../navigations/reports";
import {getFocusedRouteNameFromRoute} from "@react-navigation/native";
import useOneSignal from 'src/hooks/useOneSignal';
import {isTablet} from "react-native-device-info";
import GroupNavigator from "../../../navigations/group";
import EmployeeNavigator from "../../../navigations/employee";
import UserNavigator from "../../../navigations/user";
import Settings from "@pages/settings";
import RoleAndPermissionNavigator from "../../../navigations/role-and-permission";
import ConfigurationNavigator from "../../../navigations/configuration";
import ScheduleNavigator from "../../../navigations/schedule";

const {width}=Dimensions.get('window');

const customStyles=StyleSheet.create({
    confirmText:{
        fontSize:RFValue(14),
        fontFamily:Regular,
        color:text.primary,
    },
    title:{
        textAlign:'center',
        fontSize:RFValue(16),
        fontFamily:Bold,
        color:'#1F2022'
    },
    message:{
        textAlign:'center',
        fontSize:RFValue(14),
        fontFamily:Regular,
        marginHorizontal:15,
        marginBottom:15,
    },
    content:{
        borderBottomColor:outline.default,
        borderBottomWidth:1,
    }
});

const Tab=createBottomTabNavigator();

const Drawer=createDrawerNavigator();

export default function TabBar({navigation,route}){


    const user=useSelector((state:RootStateOrAny)=>state.user);
    const onHide=()=>setShowAlert(false);
    const onShow=()=>setShowAlert(true);
    const [showAlert,setShowAlert]=useState(false);
    const [alertData,setAlertData]:any=useState({});
    const [versionChecked,setVersionChecked]=useState(false);
    const {
        connectionStatus,
        initSignalR,
        destroySignalR,
        onConnection,
        onStatusUpdate,
        onChatUpdate,
        onRoomUpdate,
        onMeetingUpdate,
        OnMeetingNotification,
        checkVersion,
    }=useSignalr();

    const pinnedApplications=useSelector((state:RootStateOrAny)=>state.application?.pinnedApplications);
    const notPinnedApplications=useSelector((state:RootStateOrAny)=>state.application?.notPinnedApplications);
    const tabBarHeight=useSelector((state:RootStateOrAny)=>state.application?.tabBarHeight);
    const currentMeeting = useSelector((state: RootStateOrAny) => state.meeting.meeting);
    const normalizeActiveMeetings = useSelector((state: RootStateOrAny) => state.meeting.normalizeActiveMeetings);
    const hasNewChat = false;
    const hasMeet = false;
    const newMeeting = useMemo(() => {
      const meetingList = lodash.keys(normalizeActiveMeetings).map((m:string) => normalizeActiveMeetings[m])
      const hasMeet = lodash.reject(meetingList, (mt:IMeetings) => mt.ended);
      const newMeeting = lodash.find(hasMeet, (am:IMeetings) =>
        lodash.find(am.participants, (ap:IParticipants) =>
          ap._id === user._id && ap.hasJoined === false && !(ap.status === 'busy' || ap.status === 'waiting' || ap.muted)
        )
      );
      return newMeeting;
    }, [normalizeActiveMeetings]);
    const [pnApplication,setPnApplication]=useState(pinnedApplications);
    const [notPnApplication,setNotPnApplication]=useState(notPinnedApplications);
    const dispatch=useDispatch();
    const soundRef:any=React.useRef(new Audio.Sound());
    const playSound=async()=>{
        await soundRef.current?.loadAsync(require('@assets/sound/incoming.wav'),{shouldPlay:true});
        await soundRef.current?.setIsLoopingAsync(true);
    };
    const onPressAlert=()=>{
        if(alertData.link){
            return Linking.openURL(alertData.link);
        } else{
            return RNExitApp.exitApp();
        }
    };
    const {initialize}=useOneSignal(user);

    useEffect(()=>{
        dispatch(setConnectionStatus(connectionStatus));
        let unmount=false;

        if(!versionChecked&&connectionStatus==='connected'&&Platform.OS!='web'){
            checkVersion((err:any,res:any)=>{
                if(!unmount){
                    setVersionChecked(true);
                    if(res){
                        setAlertData(res);
                        setShowAlert(true);
                    }
                }
            })
        }
        return ()=>{
            unmount=true;
        }
    },[connectionStatus]);

    useEffect(()=>{
        initialize();
        initSignalR();
        onConnection('OnStatusUpdate', onStatusUpdate);
        onConnection('OnChatUpdate',onChatUpdate);
        onConnection('OnRoomUpdate',onRoomUpdate);
        onConnection('OnMeetingUpdate',onMeetingUpdate);
        onConnection('OnMeetingNotification',OnMeetingNotification);

        return ()=>destroySignalR();
    },[]);

    useEffect(() => {
        if (lodash.size(newMeeting) && !currentMeeting?._id && Platform.OS != 'web') {
          playSound();
        }
        return () => {
          soundRef?.current?.unloadAsync();
        }
      }, [newMeeting, currentMeeting]);

    useEffect(()=>{

        setPnApplication(pinnedApplications.reduce((n,e)=>!e?.dateRead ? n+1 : n,0));
        setNotPnApplication(notPinnedApplications.reduce((n,e)=>!e?.dateRead ? n+1 : n,0))

    },[pinnedApplications,notPinnedApplications,pnApplication,notPnApplication]);

    function ActivityTab({state,descriptors,navigation}:any){
        const currentRoute=state.routes.map((route:any,index:number)=>getFocusedRouteNameFromRoute(route));
        const hidden=currentRoute.find((route:string)=>route==SEARCH);

        return (
            <View onLayout={(event)=>{
                if(tabBarHeight==0){
                    dispatch(setTabBarHeight(event.nativeEvent.layout.height))
                }

            }} style={{
                display:hidden ? "none" : "flex",flexDirection:'row',justifyContent:'space-around',
                alignItems:'center',
                paddingHorizontal:20,
                backgroundColor:'white',
                paddingBottom:10,
                paddingTop:5,
                borderWidth:1,
                borderColor:'#E5E5E5'
            }}>
                {state.routes.map((route:any,index:number)=>{


                    const {options}=descriptors[route.key];

                    const label=
                        options.tabBarLabel!==undefined
                        ? options.tabBarLabel
                        : options.title!==undefined
                          ? options.title
                          : route.name;

                    const isFocused=state.index===index;

                    const onPress=()=>{
                        const event=navigation.emit({
                            type:'tabPress',
                            target:route.key,
                            canPreventDefault:true,
                        });

                        if(!isFocused&& !event.defaultPrevented){
                            navigation.navigate({name:route.name,merge:true});
                        }
                    };
                    const onLongPress=()=>{
                        navigation.emit({
                            type:'tabLongPress',
                            target:route.key,
                        });
                    };
                    const focused="#2863D6";
                    const unfocused="#606A80";
                    return (
                        <View key={route.key} style={{flex:1}}>
                            <TouchableOpacity
                                //disabled={((label == CHAT && !isMobile)  || (label == MEET && !isMobile) || (label == SCANQR && !isMobile)  ) }
                                accessibilityRole="button"
                                accessibilityState={isFocused ? {selected:true} : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}>
                                <View style={{
                                    justifyContent:'center',
                                    alignItems:'center',
                                }}>
                                    {label==ACTIVITIES
                                     ? (
                                         <ActivityTabbar notification={false} width={fontValue(30)}
                                                         height={fontValue(30)}
                                                         fill={isFocused ? focused : unfocused}/>) :
                                     label==CHAT
                                     ?
                                     (
                                         <ChatIcon notification={hasNewChat} width={fontValue(30)}
                                                   height={fontValue(30)} fill={isFocused ? focused : unfocused}/>)
                                     : label==MEET
                                       ?
                                       (
                                           <MeetIcon notification={hasMeet} width={fontValue(30)} height={fontValue(30)}
                                                     fill={isFocused ? focused : unfocused}/>)

                                       :
                                       label==SCANQR
                                       ?
                                       (
                                           <ScanQrIcon notification={false} width={fontValue(30)} height={fontValue(30)}
                                                       fill={isFocused ? focused : unfocused}/>)
                                       :

                                       label==MORE
                                       ?
                                       (
                                           <MoreTabBarIcon notification={false} width={fontValue(30)}
                                                           height={fontValue(30)}
                                                           fill={isFocused ? focused : unfocused}/>)

                                       :
                                       <Ionicons color={isFocused ? focused : unfocused} size={fontValue(28)}  name="apps"></Ionicons>}

                                    <Text style={[{
                                        fontSize:fontValue(14),
                                        fontFamily:isFocused ? Bold : Regular,
                                        color:isFocused ? '#2863d6' : '#606a80'
                                    }]}>{label}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>


                    );
                })}
            </View>
        );
    }


    const dimensions=useWindowDimensions();
    return (
        <>
            {(
                 isMobile&& !(
                    Platform?.isPad||isTablet())) ? <Tab.Navigator   tabBar={(props)=><ActivityTab  {...props} />}>
                 <Tab.Screen options={({route})=>(
                     {
                         headerShown:false,
                     })} name={ACTIVITIES} component={ActivitiesNavigator}/>
                 <Tab.Screen options={{headerShown:false}} name={CHAT} component={ChatScreen}/>
                 <Tab.Screen options={{headerShown:false}} name={MEET} component={MeetScreen}/>
                 {getRole(user,[CHECKER,EVALUATOR,DIRECTOR])&&
                 <Tab.Screen options={{headerShown:false}} name={SCANQR} component={QrCodeScanner}/>}
                 {/*<Tab.Screen options={{headerShown:false}} name={DASHBOARD} component={DashboardNavigator}/>*/}
             </Tab.Navigator> : <Drawer.Navigator

                 screenOptions={{

                     drawerStyle:{
                         width:108
                     },
                     drawerType: !(Platform.OS == "web" && Platform?.isPad)? 'permanent' : 'front',
                     drawerItemStyle:{
                         backgroundColor:'rgba(0,0,0,0)',
                         marginLeft:20,
                         marginBottom:20,
                     },
                 }}
                 backBehavior='none'
                 drawerContent={(props)=><CustomSidebarMenu {...props} />} initialRouteName={ACTIVITIES}>
                 <Drawer.Screen options={{drawerLabel:ACTIVITIES,headerShown:false}} name={ACTIVITIES}
                                component={ActivitiesNavigator}/>
                {user?.role?.permission?.chatPermission ?<Drawer.Screen options={{drawerLabel:CHAT,headerShown:false}} name={CHAT} component={ChatScreen}/> : <></>}
                {user?.role?.permission?.meetPermission ? <Drawer.Screen options={{drawerLabel:MEET,headerShown:false}} name={MEET} component={MeetScreen}/> : <></>}
                {(user?.role?.permission?.qrCodePermission && Platform.OS != "web") &&
                    <Drawer.Screen options={{drawerLabel:SCANQR,headerShown:false}} name={SCANQR} component={QrCodeScanner}/>}

                 {/*<Drawer.Screen options={{drawerLabel:DASHBOARD,headerShown:false}} name={DASHBOARD} component={DashboardNavigator}/>*/}
                 {/*<Drawer.Screen options={{drawerLabel:REPORT,headerShown:false}} name={REPORT} component={ReportNavigator}/>*/}
                {user?.role?.permission?.rolePermission?.view ? <Drawer.Screen options={{drawerLabel:ROLEANDPERMISSION,headerShown:false}} name={ROLEANDPERMISSION} component={RoleAndPermissionNavigator}/> : <></>}
                 {/*<Drawer.Screen options={{drawerLabel:GROUP,headerShown:false}} name={GROUP} component={GroupNavigator}/>*/}
                {user?.role?.permission?.schedulePermission?.view ? <Drawer.Screen options={{drawerLabel:SCHEDULE,headerShown:false}} name={SCHEDULE} component={ScheduleNavigator}/> : <></>}
                {user?.role?.permission?.employeePermission.view ? <Drawer.Screen options={{drawerLabel:EMPLOYEES,headerShown:false}} name={EMPLOYEES} component={EmployeeNavigator}/> : <></>}
                {user?.role?.permission?.userPermission.view ? <Drawer.Screen options={{drawerLabel:USERS,headerShown:false}} name={USERS} component={UserNavigator}/>: <></>}
                 {/*<Drawer.Screen options={{drawerLabel:SETTINGS,headerShown:false}} name={SETTINGS} component={Settings}/>*/}
                {user?.role?.permission?.configurationPermission?.view  ?<Drawer.Screen options={{drawerLabel: SETTINGS, headerShown: false}} name={CONFIGURATION}
                                                                                 component={ConfigurationNavigator}/> : <></>}
             </Drawer.Navigator>}
            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                contentContainerStyle={{borderRadius:15,maxWidth:width*0.7}}
                titleStyle={customStyles.title}
                title={alertData?.title||'Alert'}
                message={alertData?.message}
                messageStyle={customStyles.message}
                contentStyle={customStyles.content}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText={alertData.button||'OK'}
                confirmButtonColor={'white'}
                confirmButtonTextStyle={customStyles.confirmText}
                actionContainerStyle={{justifyContent:'space-around'}}
                onConfirmPressed={onPressAlert}
            />
        </>


    );
}
