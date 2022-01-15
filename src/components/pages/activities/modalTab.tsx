import {RootStateOrAny, useSelector} from "react-redux";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirement";
import Payment from "@pages/activities/application/payment";
import React, {useState} from "react";
import {CASHIER, DIRECTOR, EVALUATOR} from "../../../reducers/activity/initialstate";
import {defaultColor, primaryColor, text} from "@styles/color";
import {TouchableOpacity, View, Animated, Text, StyleSheet} from "react-native";
function MyTabBar({ state, descriptors, navigation, position }) {
    return (
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
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
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                const inputRange = state.routes.map((_, i) => i);

                const opacity = position.interpolate({
                    inputRange,
                    outputRange: inputRange.map((i) => (i === index ? 1 : 0)),
                });
                return (
                    <View style={[styles.group5]}>
                    <TouchableOpacity
                        key={index}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{ flex: 1 }}
                    >

                            <Text
                                style={{color: isFocused ? primaryColor : text.default}}>{label}</Text>
                            <Animated.View
                                style={[styles.rect6,  {opacity, backgroundColor: isFocused ? primaryColor : 'transparent'}]}/>

                    </TouchableOpacity>
                    </View>
                );
            })}
        </View>
    );
}
export function ModalTab(props) {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const Tab = createMaterialTopTabNavigator();
    const [tabs, setTabs] = useState([
        {
            id: 1,
            name: 'Basic Info',
            active: true,
            isShow: [CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 2,
            name: 'Application Details',
            active: false,
            isShow: [CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 3,
            name: 'Requirements',
            active: false,
            isShow: [DIRECTOR, EVALUATOR]
        },
        {
            id: 4,
            name: 'SOA & Payment',
            active: false,
            isShow: [CASHIER]
        },
    ])
    const applicant = props?.details?.applicant,
        selectedTypes = props?.details?.selectedTypes,
        applicationType = props?.details?.applicationType,
        service = props?.details?.service,
        soa = props?.details?.soa,
        totalFee = props?.details?.totalFee,
        requirements = props?.details?.requirements
    return <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />} >

    {

        tabs.map((tab, index) => {
            const isShow = tab.isShow.indexOf(user?.role?.key) != -1
            if (isShow && tab.id == 1) {
                return <Tab.Screen
                    name={tab.name}
                    options={{tabBarLabel: tab.name}}
                >
                    {() => <BasicInfo
                        applicant={applicant}
                        key={index}/>}
                </Tab.Screen>
            } else if (isShow && tab.id == 2) {
                return <Tab.Screen
                    name={tab.name}
                    options={{tabBarLabel: tab.name}}
                >
                    {() => <ApplicationDetails
                        service={service}
                        selectedType={selectedTypes}
                        applicantType={applicationType}
                        key={index}/>}
                </Tab.Screen>
            } else if (isShow && tab.id == 3) {
                return <Tab.Screen
                    name={tab.name}
                    options={{tabBarLabel: tab.name}}
                >
                    {() => <Requirement requirements={requirements} key={index}/>}
                </Tab.Screen>
            } else if (isShow && tab.id == 4) {
                return <Tab.Screen
                    name={tab.name}
                    options={{tabBarLabel: tab.name}}
                >
                    {() => <Payment totalFee={totalFee}
                                    soa={soa} key={index}/>}
                </Tab.Screen>
            }
        })
    }
        </Tab.Navigator>
    }

const styles = StyleSheet.create({
    group5: {
        height: 28
    },
    rect6: {
        height: 3,
        marginTop: 8
    },
})