import * as React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ActivitiesScreen from "@pages/activities";
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
const Tab = createBottomTabNavigator();

function getRole(user, arr ) {
    return arr.indexOf(user?.role?.key) != -1;
}

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

            }} style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'white', paddingBottom: 15, paddingTop: 5, borderWidth: 1, borderColor: '#E5E5E5' }}>
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
                    return (<View key={route.key} style={{ flex: 1 }}>
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
                                        ? ( <ActivityTabbar notification={false } width={30} height={30} fill={isFocused ? focused : unfocused}/>) :
                                        label == CHAT
                                            ?
                                            (<ChatIcon notification={hasNewChat} width={30} height={30} fill={isFocused ? focused : unfocused}/>)
                                            : label == MEET
                                                ?
                                                (<MeetIcon notification={hasMeet} width={30} height={30} fill={isFocused ? focused : unfocused}/>)

                                                :
                                                label == SCANQR
                                                    ?
                                                    (<ScanQrIcon notification={false} width={30} height={30} fill={isFocused ? focused : unfocused}/> )
                                                    :
                                                    label == MORE
                                                        ?
                                                        (<MoreTabBarIcon notification={false} width={30} height={30} fill={isFocused ? focused : unfocused}/>)

                                                        :
                                                        <Entypo name="book"></Entypo>}

                                    <Text style={[{
                                        fontSize: 14,
                                        fontWeight: isFocused ? 'bold' : 'normal',
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
    return (

            <Tab.Navigator   tabBar={(props) => <ActivityTab application={notPnApplication}  {...props} />}>
                <Tab.Screen   options={{headerShown: false}} name={ACTIVITIES} component={ActivitiesScreen}/>
                <Tab.Screen options={{headerShown: false}} name={CHAT} component={ChatScreen}/>
                <Tab.Screen options={{headerShown: false}} name={MEET} component={MeetScreen}/>
                {getRole(user, [CHECKER, EVALUATOR, DIRECTOR]) && <Tab.Screen  options={{headerShown: false}} name={SCANQR} component={QrCodeScanner}/>  }
            </Tab.Navigator>



    );
}