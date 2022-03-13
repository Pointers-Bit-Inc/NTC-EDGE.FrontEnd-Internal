import * as React from 'react';
import {Dimensions, Image , Linking, Platform , Text , TouchableOpacity , useWindowDimensions , View, StyleSheet} from 'react-native';
import {createDrawerNavigator , DrawerContentScrollView , DrawerItem ,} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import QrCodeScanner from "@pages/barcode/view";
import MeetScreen from '@screens/meet';
import ChatScreen from '@screens/chat';
import {Entypo} from "@expo/vector-icons";
import ActivityTabbar from "@assets/svg/activitytabbar";
import ChatIcon from "@assets/svg/chattabbar";
import MeetIcon from "@assets/svg/meettabbar";
import ScanQrIcon from "@assets/svg/scanqrtabbar";
import MoreTabBarIcon from "@assets/svg/moretabbar";
import {
    ACTIVITIES ,
    CHAT ,
    CHECKER ,
    DIRECTOR ,
    EVALUATOR ,
    MEET ,
    MORE ,
    SCANQR ,
    SEARCH ,
} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {setTabBarHeight} from "../../../reducers/application/actions";
import lodash from 'lodash';
import {getRole } from "@pages/activities/script";
import {Bold , Regular} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import { Audio } from 'expo-av';
import CustomSidebarMenu from "@pages/activities/customNavigationDrawer";
import Search from "@pages/activities/search";
import ActivitiesPage from "@pages/activities/index";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import useSignalr from 'src/hooks/useSignalr';
import { resetMeeting, addMeeting, updateMeeting, setConnectionStatus } from 'src/reducers/meeting/actions';
import { resetChannel, addMessages, updateMessages, addChannel, removeChannel } from 'src/reducers/channel/actions';
import RNExitApp from 'react-native-exit-app';
import AwesomeAlert from 'react-native-awesome-alerts';
import { outline, text } from '@styles/color';
import IMeetings from 'src/interfaces/IMeetings';
import IParticipants from 'src/interfaces/IParticipants';
import IRooms from 'src/interfaces/IRooms';
import ActivitiesNavigator from "../../../navigations/activities";

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

const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

export default function TabBar() {


    const user = useSelector((state: RootStateOrAny) => state.user);
    const onHide = () => setShowAlert(false)
    const onShow = () => setShowAlert(true);
    const [showAlert, setShowAlert] = useState(false);
    const [alertData, setAlertData]:any = useState({});
    const [versionChecked, setVersionChecked] = useState(false);
    const {
        connectionStatus,
        initSignalR,
        destroySignalR,
        onConnection,
        checkVersion,
      } = useSignalr();
      
    const {tabBarHeight,  pinnedApplications, notPinnedApplications} = useSelector((state: RootStateOrAny) => state.application)
    const { hasNewChat = false, hasMeet = false } = useSelector((state: RootStateOrAny) => {
        const { channel = {}, meeting = {} } = state;
        const { channelList = [] } = channel;
        const { activeMeetings = [] } = meeting;

        const hasNewChat = lodash.reject(channelList, (ch:IRooms) => ch.hasSeen);
        const hasMeet = lodash.reject(activeMeetings, (mt:IMeetings) => mt.ended);
        return {
            hasNewChat: lodash.size(hasNewChat) > 0,
            hasMeet: lodash.size(hasMeet) > 0,
        }
    })
    const newMeeting = useSelector((state: RootStateOrAny) => {
      const { normalizeActiveMeetings } = state.meeting
      const meetingList = lodash.keys(normalizeActiveMeetings).map((m:string) => normalizeActiveMeetings[m])
      const hasMeet = lodash.reject(meetingList, (mt:IMeetings) => mt.ended);
      const newMeeting = lodash.find(hasMeet, (am:IMeetings) => lodash.find(am.participants, (ap:IParticipants) => ap._id === user._id && ap.hasJoined === false));
      return newMeeting;
    })
    const [pnApplication, setPnApplication] = useState(pinnedApplications)
    const [notPnApplication, setNotPnApplication] = useState(notPinnedApplications)
    const dispatch = useDispatch()
    const soundRef:any = React.useRef(new Audio.Sound());
    const playSound = async () => {
      await soundRef.current?.loadAsync(require('@assets/sound/incoming.wav'), { shouldPlay: true });
      await soundRef.current?.setIsLoopingAsync(true);
    }
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
      checkVersion((err:any, res:any) => {
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
      onConnection('OnChatUpdate', (users:Array<string>, type:string, data:any) => {
        if (data) {
          switch(type) {
            case 'create': {
              dispatch(addMessages(data));
              break;
            }
            case 'update': {
              dispatch(updateMessages(data));
              break;
            }
          }
        }
      });

      onConnection('OnRoomUpdate', (users:Array<string>, type:string, data:any) => {
        if (data) {
          switch(type) {
            case 'create': {
              dispatch(addChannel(data));
              dispatch(addMessages(data.lastMessage));
              break;
            }
            case 'delete': dispatch(removeChannel(data._id)); break;
          }
        }
      });

      onConnection('OnMeetingUpdate', (users:Array<string>, type:string, data:any) => {
        if (data) {
          switch(type) {
            case 'create': {
              const { room } = data;
              const { lastMessage } = room;
              dispatch(addChannel(room));
              dispatch(addMessages(lastMessage));
              dispatch(addMeeting(data));
              break;
            };
            case 'update': {
              const { room = {} } = data;
              const { lastMessage } = room;
              if (lastMessage) dispatch(addChannel(room));
              if (lastMessage) dispatch(addMessages(lastMessage));
              dispatch(updateMeeting(data));
              break;
            }
          }
        }
      });
  
      return () => destroySignalR();
    }, []);

    useEffect(() => {
      if (lodash.size(newMeeting)) {
        playSound();
      }
      return () => {
        soundRef?.current?.unloadAsync();
      }
    }, [newMeeting]);

    useEffect(()=>{

        setPnApplication(pinnedApplications.reduce((n, e) => !e?.dateRead ? n+1 : n, 0) )
        setNotPnApplication(notPinnedApplications.reduce((n, e) => !e?.dateRead ? n+1 : n, 0))

    }, [pinnedApplications, notPinnedApplications, pnApplication, notPnApplication])

    function ActivityTab({state, descriptors, navigation}: any) {


        return (
            <View  onLayout={(event)=>{
                if(tabBarHeight == 0){
                    dispatch(setTabBarHeight(event.nativeEvent.layout.height))
                }

            }} style={{flexDirection: 'row', justifyContent: 'space-around',
                alignItems: 'center',
                paddingHorizontal: 20,
                backgroundColor: 'white',
                paddingBottom: 10,
                paddingTop: 5,
                borderWidth: 1,
                borderColor: '#E5E5E5' }}>
                {state.routes.map((route: any, index: number) => {
                    const {options} = descriptors[route.key];

                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {

                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate({name: route.name, merge: true});
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    const focused = "#2863D6";
                    const unfocused = "#606A80";
                    return (route.name ===  SEARCH || <View key={route.key} style={{ flex: 1 }}>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={isFocused ? {selected: true} : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}>
                                <View style={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {label == ACTIVITIES
                                        ? ( <ActivityTabbar notification={false } width={fontValue(30)} height={fontValue(30)} fill={isFocused ? focused : unfocused}/>) :
                                        label == CHAT
                                            ?
                                            (<ChatIcon notification={hasNewChat} width={fontValue(30)} height={fontValue(30)} fill={isFocused ? focused : unfocused}/>)
                                            : label == MEET
                                                ?
                                                (<MeetIcon notification={hasMeet} width={fontValue(30)} height={fontValue(30)} fill={isFocused ? focused : unfocused}/>)

                                                :
                                                label == SCANQR
                                                    ?
                                                    (<ScanQrIcon notification={false} width={fontValue(30)} height={fontValue(30)} fill={isFocused ? focused : unfocused}/> )
                                                    :
                                                    label == MORE
                                                        ?
                                                        (<MoreTabBarIcon notification={false} width={fontValue(30)} height={fontValue(30)} fill={isFocused ? focused : unfocused}/>)

                                                        :
                                                        <Entypo name="book"></Entypo>}

                                    <Text style={[{
                                        fontSize: fontValue(14),
                                        fontFamily: isFocused ? Bold : Regular,
                                        color: isFocused ? '#2863d6' : '#606a80'
                                    }]}>{label}</Text>
                                </View>

                            </TouchableOpacity>
                        </View>


                    );
                })}
            </View>
        );
    }



    const dimensions = useWindowDimensions();
    return (
            <>
                {isMobile    ?  <Tab.Navigator   tabBar={(props) => <ActivityTab  {...props} />}>
                    <Tab.Screen options={{headerShown: false}} name={ACTIVITIES} component={ActivitiesNavigator}/>
                    <Tab.Screen options={{headerShown: false}} name={CHAT} component={ChatScreen}/>
                    <Tab.Screen options={{headerShown: false}} name={MEET} component={MeetScreen}/>
                    {getRole(user, [CHECKER, EVALUATOR, DIRECTOR]) && <Tab.Screen  options={{headerShown: false}} name={SCANQR} component={QrCodeScanner}/>  }
                </Tab.Navigator> :  <Drawer.Navigator

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

                    drawerContent={(props) => <CustomSidebarMenu {...props} />} initialRouteName={ACTIVITIES}>
                    <Drawer.Screen   options={{ drawerLabel: ACTIVITIES,   headerShown: false }}  name={ACTIVITIES}  component={ActivitiesNavigator} />
                    <Drawer.Screen   options={{ drawerLabel: CHAT,   headerShown: false }}  name={CHAT}  component={ChatScreen} />
                    <Drawer.Screen   options={{ drawerLabel: MEET,   headerShown: false }}  name={MEET}  component={MeetScreen} />

                </Drawer.Navigator> }
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




    );
}