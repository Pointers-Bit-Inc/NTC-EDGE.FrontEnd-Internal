import {RootStateOrAny, useSelector} from "react-redux";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import BasicInfo from "@pages/activities/application/basicInfo";
import ApplicationDetails from "@pages/activities/application/applicationDetails";
import Requirement from "@pages/activities/application/requirement";
import Payment from "@pages/activities/application/payment";
import React, {createRef, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {CASHIER, DIRECTOR, EVALUATOR} from "../../../reducers/activity/initialstate";
import {primaryColor, text} from "@styles/color";
import {Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View} from "react-native";
  let initial = {}
function MyTabBar({state, descriptors, navigation, position}) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [tabCurrent, setTabCurrent] = useState([])
    const [translateValue] = useState(new Animated.Value(0));
    const ref = useRef([])
    const [_initialAnimation, set_initialAnimation] = useState<{x: number, y:number, width:number, height: number}>()
    const containerRef = useRef(null)


    const animateSlider = (index: number) => {


        if(tabCurrent[currentIndex]?.x)   {
            Animated.spring(translateValue, {
                toValue: tabCurrent[currentIndex]?.x,
                velocity: 10,
                useNativeDriver: true,
            }).start();
        } else{
            ref.current[0].measureLayout(containerRef.current, (x, y, width, height) => {
                initial = {x, y, width, height}
                Animated.spring(translateValue, {
                    toValue: x,
                    velocity: 10,
                    useNativeDriver: true,
                }).start();
            })
        }

    };

    return (
        <>

            <View ref={containerRef}   style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>

                {state.routes.map((route, index) => {
                    const {options} = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;
                    useEffect(()=>{
                        animateSlider(currentIndex);
                    }, [currentIndex, state.index])

                    useEffect(() =>{
                        if(state.index === index){
                            ref.current[index].measureLayout(containerRef.current, (x, y, width, height) => {
                                const _tabCurrent = tabCurrent.findIndex(tab => tab.width == width)
                                setCurrentIndex(_tabCurrent )
                            })
                        }

                    }, [position])
                    const onPress =  () => {
                        ref.current[index].measureLayout(containerRef.current, (x, y, width, height) => {
                            const _tabCurrent = tabCurrent.findIndex(tab => tab.width == width)
                            setCurrentIndex(_tabCurrent )
                        })
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
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
                    const onLayout = useCallback(
                        ({
                             nativeEvent: {
                                 layout: { width, x, y }
                             }
                         }) => {
                            let newArr = [...tabCurrent]
                            newArr.push({width, x, y})
                            setTabCurrent(newArr)

                        },
                        [tabCurrent]
                    );

                    return (
                        <View ref={e => ref.current[index] = e} onLayout={onLayout} key={index} style={[styles.group5,]}>
                            <TouchableOpacity

                                accessibilityRole="button"
                                accessibilityState={isFocused ? {selected: true} : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={() => onPress()}
                                onLongPress={() =>onLongPress()}
                                style={{flex: 1}}
                            >

                                <Text
                                    style={{alignSelf: "center", color: isFocused ? primaryColor : text.default}}>{label}</Text>


                            </TouchableOpacity>
                        </View>
                    );
                })}

            </View>
            {tabCurrent[currentIndex]?.x ? <Animated.View

                style={[styles.rect6, {
                    transform: [{
                        translateX:  translateValue
                    }
                    ],

                    width: tabCurrent[currentIndex]?.width,
                    backgroundColor:  primaryColor
                }]}/> : initial && <Animated.View

                    style={[styles.rect6, {
                        transform: [{
                            translateX:  translateValue
                        }
                        ],

                        width: initial.width,
                        backgroundColor:  primaryColor
                    }]}/>
            }


        </>

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
    return <Tab.Navigator tabBar={(props) => <MyTabBar {...props} />}>

        {

            tabs.map((tab, index) => {
                const isShow = tab.isShow.indexOf(user?.role?.key) != -1
                if (isShow && tab.id == 1) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <BasicInfo
                            applicant={applicant}
                            key={index}/>}
                    </Tab.Screen>
                } else if (isShow && tab.id == 2) {
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
                } else if (isShow && tab.id == 3) {
                    return <Tab.Screen
                        key={tab.id}
                        name={tab.name}
                        options={{tabBarLabel: tab.name}}
                    >
                        {() => <Requirement requirements={requirements} key={index}/>}
                    </Tab.Screen>
                } else if (isShow && tab.id == 4) {
                    return <Tab.Screen
                        key={tab.id}
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
        height: 5,
        marginTop: 5
    },
})