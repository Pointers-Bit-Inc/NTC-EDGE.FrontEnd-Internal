import * as React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ActivitiesScreen from "@pages/activities";
import QrCodeScanner from "@organisms/barcode/view";
import {styles} from "@pages/activities/styles";
import {Entypo, Feather, Ionicons, MaterialCommunityIcons, SimpleLineIcons} from "@expo/vector-icons";


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
                    const iconStyle = [styles.icon2, {
                        color: isFocused ? '#2863d6' : '#606a80'
                    }]
                    const icon =
                        label == ACTIVITIES
                            ? <Ionicons
                                name="md-chatbubbles"
                                style={iconStyle}
                            ></Ionicons> :
                            label == CHAT
                                ? <SimpleLineIcons style={iconStyle} name="bubble"></SimpleLineIcons>
                                : label == MEET
                                    ? <Feather style={iconStyle} name="video"></Feather> :
                                    label == SCANQR
                                        ?
                                        <MaterialCommunityIcons style={iconStyle} name="qrcode"></MaterialCommunityIcons> :
                                        label == MORE
                                            ? <Feather style={iconStyle} name="more-horizontal"></Feather> :
                                            <Entypo style={iconStyle} name="book"></Entypo>

                    return (<View key={route.key} style={{paddingLeft: 15, paddingRight: 15}}>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={isFocused ? {selected: true} : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}>
                                {icon}
                                <Text style={[styles.activity, {
                                    fontSize: 14,
                                    fontWeight: isFocused ? 'bold' : 'normal',
                                    color: isFocused ? '#2863d6' : '#606a80'
                                }]}>{label}</Text>
                            </TouchableOpacity>
                        </View>


                    );
                })}
            </View>
        );
    }

    return (

        <Tab.Navigator tabBar={(props ) => {
            return <View style={styles.rect10}>
                <View style={styles.group7Filler}></View>
                <View style={styles.group7}>

                    <ActivityTab  {...props} />
                </View>
            </View>
        }

        }>
            <Tab.Screen options={{headerShown: false}} name={ACTIVITIES} component={ActivitiesScreen}/>
            <Tab.Screen name={CHAT} component={ActivitiesScreen}/>
            <Tab.Screen name={MEET} component={ActivitiesScreen}/>
            <Tab.Screen options={{headerShown: false}} name={SCANQR} component={QrCodeScanner}/>
            <Tab.Screen options={{headerShown: false}} name={MORE} component={ActivitiesScreen}/>

        </Tab.Navigator>

    );
}