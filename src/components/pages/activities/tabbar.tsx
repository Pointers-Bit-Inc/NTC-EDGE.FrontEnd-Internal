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
import {CASHIER, DIRECTOR, EVALUATOR, VERIFIED, VERIFIER} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";
const Tab = createBottomTabNavigator();

export default function TabBar() {
    const ACTIVITIES = "Activities",
        CHAT = "Chat",
        MEET = "Meet",
        SCANQR = "ScanQr",
        MORE = "More"
    const user = useSelector((state: RootStateOrAny) => state.user);
    const verifier = [VERIFIER].indexOf(user?.role?.key) != -1
    function ActivityTab({state, descriptors, navigation}: any) {


        return (
            <View style={{flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingHorizontal: 20, backgroundColor: 'white', paddingBottom: 15, paddingTop: 5, borderWidth: 1, borderColor: '#E5E5E5' }}>
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
                                        ? ( <ActivityTabbar width={30} height={30} fill={isFocused ? focused : unfocused}/>) :
                                        label == CHAT
                                            ?
                                            (<ChatIcon width={30} height={30} fill={isFocused ? focused : unfocused}/>)
                                            : label == MEET
                                                ?
                                                (<MeetIcon width={30} height={30} fill={isFocused ? focused : unfocused}/>)

                                                :
                                                label == SCANQR
                                                    ?
                                                    (<ScanQrIcon width={30} height={30} fill={isFocused ? focused : unfocused}/> )
                                                    :
                                                    label == MORE
                                                        ?
                                                        (<MoreTabBarIcon width={30} height={30} fill={isFocused ? focused : unfocused}/>)

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

            <Tab.Navigator  tabBar={(props) => <ActivityTab  {...props} />}>
                <Tab.Screen  options={{headerShown: false}} name={ACTIVITIES} component={ActivitiesScreen}/>
                <Tab.Screen options={{headerShown: false}} name={CHAT} component={ChatScreen}/>
                <Tab.Screen options={{headerShown: false}} name={MEET} component={MeetScreen}/>
                {verifier && <Tab.Screen  options={{headerShown: false}} name={SCANQR} component={QrCodeScanner}/>  }
            </Tab.Navigator>



    );
}