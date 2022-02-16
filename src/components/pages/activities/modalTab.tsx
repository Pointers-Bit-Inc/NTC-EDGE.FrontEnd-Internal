import {RootStateOrAny, useSelector} from "react-redux";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirementModal/requirement";
import Payment from "@pages/activities/application/paymentModal/payment";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ACCOUNTANT, CASHIER, CHECKER, DIRECTOR, EVALUATOR} from "../../../reducers/activity/initialstate";
import {primaryColor, text} from "@styles/color";
import {Animated, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Poppins_400Regular , Poppins_500Medium} from "@expo-google-fonts/poppins";
import {Bold , Regular , Regular500} from "@styles/font";

let initial = {};

const MyTabBar = ({state, descriptors, navigation, position}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tabCurrent, setTabCurrent] = useState([]);
    const [translateValue] = useState(new Animated.Value(0));
    const ref = useRef([]);
    const containerRef = useRef(null);


    useEffect(() => {
        if (tabCurrent[currentIndex]?.x) {
            Animated.spring(translateValue, {
                toValue: tabCurrent[currentIndex]?.x - 5,
                velocity: 10,
                useNativeDriver: true,
            }).start();
        } else {
            ref?.current[0].measureLayout(containerRef.current, (x, y, width, height) => {
                initial = {x, y, width, height};
                Animated.spring(translateValue, {
                    toValue: x,
                    velocity: 10,
                    useNativeDriver: true,
                }).start();
            })
        }
    }, [tabCurrent, currentIndex, translateValue]);

    return (
        <View style={
            {
                paddingTop: 14,
                paddingBottom: 1,
                borderColor: "#f0f0f0",
                borderTopWidth: 1,
                borderBottomWidth: 1,
            }
        }>

            <View ref={containerRef} style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>

                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                  
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    useEffect(() => {
                        if (state.index === index) {
                            setCurrentIndex(() => {
                                return tabCurrent.findIndex(tab => tab?.index === state.index)
                            })
                        }

                    }, [position]);
                    const onPress = async () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                        const _tab = tabCurrent.findIndex(tab => tab.index === state.index);

                        setCurrentIndex(() => {
                            return _tab
                        })

                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };
                    const onLayout = useCallback(
                        ({
                             nativeEvent: {
                                 layout: {width, x, y}
                             }
                         }) => {
                            let newArr = [...tabCurrent];
                            newArr[index] = {index, width, x, y};
                            setTabCurrent(newArr)
                        },
                        [tabCurrent]
                    );

                    return (
                        <View ref={e => ref.current[index] = e}
                              onLayout={onLayout} key={index}
                              style={[styles.group5,]}>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={isFocused ? {selected: true} : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={() => onPress()}
                                onLongPress={() => onLongPress()}
                                style={{flex: 1}}
                            >
                                <Text style={{
                                    alignSelf: "center",
                                    fontFamily: isFocused ? Regular500 : Regular,
                                    color: isFocused ? primaryColor : text.default
                                }}>
                                    {label}
                                </Text>
                            </TouchableOpacity>

                        </View>
                    );
                })}

            </View>
            {tabCurrent[currentIndex]?.x ? <Animated.View

                style={[styles.rect6, {
                    transform: [{
                        translateX: translateValue
                    }
                    ],

                    width: tabCurrent[currentIndex]?.width + 7,
                    backgroundColor: primaryColor
                }]}/> : initial && translateValue && <Animated.View

                style={[styles.rect6, {
                    transform: [{
                        translateX: translateValue
                    }
                    ],
                    width: initial?.width || 63,
                    backgroundColor: primaryColor
                }]}/>
            }


        </View>

    );
};

export const ModalTab = props => {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const Tab = createMaterialTopTabNavigator();
    const [tabs, setTabs] = useState([
        {
            id: 1,
            name: 'Basic Info',
            active: true,
            isShow: [CHECKER, ACCOUNTANT, CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 2,
            name: 'Application Details',
            active: false,
            isShow: [CHECKER, ACCOUNTANT, CASHIER, DIRECTOR, EVALUATOR]
        },
        {
            id: 3,
            name: 'Requirements',
            active: false,
            isShow: [CHECKER, DIRECTOR, EVALUATOR]
        },
        {
            id: 4,
            name: 'SOA & Payment',
            active: false,
            isShow: [CASHIER, ACCOUNTANT]
        },
    ]);
    const applicant = props?.details?.applicant,
        selectedTypes = props?.details?.selectedTypes,
        applicationType = props?.details?.applicationType,
        service = props?.details?.service,
        soa = props?.details?.soa,
        totalFee = props?.details?.totalFee,
        paymentMethod = props?.details?.paymentMethod,
        requirements = props?.details?.requirements,
        updatedAt = props?.details?.updatedAt,
        approvalHistory = props?.details?.approvalHistory,
        assignedPersonnel = props?.details?.assignedPersonnel,
        createdAt = props?.details?.createdAt,
        proofOfPayment = props?.details?.proofOfPayment;
    return <Tab.Navigator  tabBar={(props) => <MyTabBar {...props} />}>

        {

            tabs.map((tab, index) => {
                const isShow = tab.isShow.indexOf(user?.role?.key) !== -1;
                if (isShow && tab.id === 1) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <BasicInfo
                            paymentMethod={paymentMethod}
                            assignedPersonnel={assignedPersonnel}
                            approvalHistory={approvalHistory}
                            status={props.details.status}
                            paymentHistory={props?.details?.paymentHistory}
                            paymentStatus={props?.details?.paymentStatus}
                            detailsStatus={props?.details?.status}
                            user={user}
                            createdAt={createdAt}
                            applicant={applicant}
                            key={index}/>}
                    </Tab.Screen>
                } else if (isShow && tab.id === 2) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <ApplicationDetails
                            service={service}
                            selectedType={selectedTypes}
                            applicantType={applicationType}
                            key={index}/>}
                    </Tab.Screen>
                } else if (isShow && tab.id === 3) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <Requirement requirements={requirements} key={index}/>}
                    </Tab.Screen>
                } else if (isShow && tab.id === 4) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <Payment proofOfPayment={proofOfPayment}
                                        updatedAt={updatedAt}
                                        paymentMethod={paymentMethod}
                                        applicant={applicant}
                                        totalFee={totalFee}
                                        soa={soa}
                                        key={index}/>}
                    </Tab.Screen>
                }
            })
        }
    </Tab.Navigator>
};

const styles = StyleSheet.create({
    group5: {
        height: 28
    },
    rect6: {
        height: 3,
        marginTop: -5
    },
});