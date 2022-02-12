import React, {useEffect, useRef, useState} from "react";
import {Animated , FlatList , Text , TouchableOpacity , TouchableWithoutFeedback , View} from "react-native";
import {styles} from "@pages/activities/styles";
import ChevronDownIcon from "@assets/svg/chevron-down";
import Collapsible from "react-native-collapsible";
import {checkFormatIso, formatDate} from "@pages/activities/script";
import moment from "moment";
import {useAlert} from "@pages/activities/hooks/useAlert";
import * as Animatable from 'react-native-animatable'
import DotVertical from "@assets/svg/dotsVertical";
const ApplicationList = (props: { onPress: () => void, item: any, numbers: { parentIndex: number, child: number[]}[], index: number, element: (activity: any, i: number) => JSX.Element }) => {
    const chevronValue = useRef(new Animated.Value(0)).current
    const [isOpen, setIsOpen] = useState(true)
    const {springValue, _springHide} = useAlert(true,()=>{});
    const chevronAnimate = () => {
        Animated.timing(
            chevronValue,
            {
                useNativeDriver: true,
                toValue: isOpen ? 1 : 0,
                duration: 200,
            }
        ).start((o) => {
            if (o?.finished) {
                setIsOpen(open => !open)
            }
        });
    }





    const readableToHuman = () =>{
        let date = moment(props.item.date);
        if (moment().diff(date, 'days') >= 1 ) {
            return date.fromNow();
        }
        return date.calendar().split(' ')[0];
    }



    return <Animatable.View   animation={'fadeIn'}   style={[styles.group26,  ]}>
        <TouchableWithoutFeedback onPress={() => {
            props.onPress()
            chevronAnimate()
        }

        }>
            <View style={styles.group25}>

                <View style={styles.rect34}>

                    <View>

                        <View style={styles.date}>

                            <Text style={styles.dateText}>{readableToHuman()} </Text>
                            <View style={styles.dot}/>
                            <Text style={styles.dateText}> {checkFormatIso(props.item.date, "-")}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row",  justifyContent: "space-between", alignItems: "center", }}>
                        <View style={{flex: 0.1, alignItems: "center"}} >
                            <Animated.View style={[ {
                                transform: [
                                    {
                                        rotate: chevronValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ["0deg", "-90deg"]
                                        })
                                    }
                                ]
                            }]}>
                                <ChevronDownIcon color={"#000"}/>
                            </Animated.View>
                        </View>
                        <View style={{alignItems: "center"}}>
                            <TouchableOpacity>
                                <DotVertical />
                            </TouchableOpacity>

                        </View>


                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

        <Collapsible collapsed={!isOpen}>
            {props.item.activity.map(props.element)}
            <View style={{height: 30, backgroundColor: "white", marginTop: -1}}/>
        </Collapsible>

    </Animatable.View>;
};


export default ApplicationList;