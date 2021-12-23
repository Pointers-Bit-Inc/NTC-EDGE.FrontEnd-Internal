import * as React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ActivitiesScreen from "@pages/activities";
import QrCodeScanner from "@pages/barcode/view";
import {styles} from "@pages/activities/styles";
import {Entypo} from "@expo/vector-icons";
import ActivityTabbar from "@assets/svg/activitytabbar";
import ChatIcon from "@assets/svg/chattabbar";
import MeetIcon from "@assets/svg/meettabbar";
import ScanQrIcon from "@assets/svg/scanqrtabbar";
import MoreTabBarIcon from "@assets/svg/moretabbar";


const Tab = createBottomTabNavigator();

export default function TabBar() {
    const ACTIVITIES = "Activities",
        CHAT = "Chat",
        MEET = "Meet",
        SCANQR = "ScanQr",
        MORE = "More"

    function ActivityTab({state, descriptors, navigation}: any) {


        return (
            <View style={{flexDirection: 'row'}}>
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


                    return (<View key={route.key} style={{ paddingLeft: 15, paddingRight: 15}}>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={isFocused ? {selected: true} : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}>
                                <View style={{
                                    marginTop: 10,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    {label == ACTIVITIES
                                        ? ( <ActivityTabbar width={30} height={30} fill={isFocused ? "#2863D6" : "#606A80"}/>) :
                                        label == CHAT
                                            ?
                                            (<ChatIcon width={30} height={30} fill={isFocused ? "#2863D6" : "#606A80"}/>)
                                            : label == MEET
                                                ?
                                                (<MeetIcon width={30} height={30} fill={isFocused ? "#2863D6" : "#606A80"}/>)

                                                :
                                                label == SCANQR
                                                    ?
                                                    (<ScanQrIcon width={30} height={30} fill={isFocused ? "#2863D6" : "#606A80"}/> )
                                                    :
                                                    label == MORE
                                                        ?
                                                        (<MoreTabBarIcon width={30} height={30} fill={isFocused ? "#2863D6" : "#606A80"}/>)

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

        <Tab.Navigator  tabBar={(props) => {
            return <View style={styles.rect10}>
                <View style={styles.group7Filler}></View>
                <View style={styles.group27}>

                    <ActivityTab  {...props} />
                </View>
            </View>
        }

        }>
            <Tab.Screen  options={{headerShown: false}} name={ACTIVITIES} component={ActivitiesScreen}/>
            <Tab.Screen name={CHAT} component={ActivitiesScreen}/>
            <Tab.Screen name={MEET} component={ActivitiesScreen}/>
            <Tab.Screen options={{headerShown: false}} name={SCANQR} component={QrCodeScanner}/>
            <Tab.Screen options={{headerShown: false}} name={MORE} component={ActivitiesScreen}/>

        </Tab.Navigator>

    );
}