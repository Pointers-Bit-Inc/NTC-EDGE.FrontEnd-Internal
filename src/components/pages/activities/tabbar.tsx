import * as React from 'react';
import {Image , Platform , Text , TouchableOpacity , useWindowDimensions , View} from 'react-native';
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
import {CASHIER, CHECKER, DIRECTOR, EVALUATOR, VERIFIED, VERIFIER} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {setTabBarHeight} from "../../../reducers/application/actions";
import lodash from 'lodash';
import {fontValue , getRole} from "@pages/activities/script";
import {Bold , Regular} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import CustomSidebarMenu from "@pages/activities/customNavigationDrawer";
import Search from "@pages/activities/search";
import ActivitiesPage from "@pages/activities/index";
const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator();

export default function TabBar() {

    const ACTIVITIES = "Activities",
        CHAT = "Chat",
        MEET = "Meet",
        SCANQR = "QR",
        MORE = "More"
    const user = useSelector((state: RootStateOrAny) => state.user);

    const {tabBarHeight,  pinnedApplications, notPinnedApplications} = useSelector((state: RootStateOrAny) => state.application)
    const { hasNewChat = false, hasMeet = false } = useSelector((state: RootStateOrAny) => {
        const { channel = {}, meeting = {} } = state;
        const { channelList = [] } = channel;
        const { activeMeetings = [] } = meeting;

        const hasNewChat = lodash.reject(channelList, ch => ch.hasSeen);
        const hasMeet = lodash.reject(activeMeetings, mt => mt.ended);
        return {
            hasNewChat: lodash.size(hasNewChat) > 0,
            hasMeet: lodash.size(hasMeet) > 0,
        }
    })
    const [pnApplication, setPnApplication] = useState(pinnedApplications)
    const [notPnApplication, setNotPnApplication] = useState(notPinnedApplications)
   const dispatch = useDispatch()

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
                    const disabled = "#DADFE4"
                    return (<View key={route.key} style={{ flex: 1 }}>
                            <TouchableOpacity
                                disabled={route.name === 'Meet' || route.name === 'Chat'}
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
                                            (<ChatIcon notification={hasNewChat} width={fontValue(30)} height={fontValue(30)} fill={(route.name === 'Meet' || route.name === 'Chat') ? disabled : isFocused ? focused : unfocused}/>)
                                            : label == MEET
                                                ?
                                                (<MeetIcon notification={hasMeet} width={fontValue(30)} height={fontValue(30)} fill={(route.name === 'Meet' || route.name === 'Chat') ? disabled : isFocused ? focused : unfocused}/>)

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
                                        color: (route.name === 'Meet' || route.name === 'Chat') ? disabled : isFocused ? '#2863d6' : '#606a80'
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
                {Platform.OS == "ios" || Platform.OS == "android"   ?  <Tab.Navigator   tabBar={(props) => <ActivityTab  {...props} />}>
                    <Tab.Screen   options={{headerShown: false}} name={ACTIVITIES} component={ActivitiesPage}/>
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

                    drawerContent={(props) => <CustomSidebarMenu {...props} />} initialRouteName="Home">
                    <Drawer.Screen   options={{ drawerLabel: "Activity",   headerShown: false }}  name="activity"  component={ActivitiesPage} />
                    <Drawer.Screen   options={{ drawerLabel: "Chat",   headerShown: false }}  name="chat"  component={ActivitiesPage} />
                    <Drawer.Screen   options={{ drawerLabel: "Meet",   headerShown: false }}  name="meet"  component={ActivitiesPage} />

                    <Drawer.Screen  options={{ drawerItemStyle: {display: "none"}, headerShown: false }}  name="search" component={Search} />

                </Drawer.Navigator> }
            </>




    );
}