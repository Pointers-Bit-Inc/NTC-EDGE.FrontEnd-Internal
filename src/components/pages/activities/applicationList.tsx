import React, {useEffect, useRef, useState} from "react";
import {Animated , FlatList , Text , TouchableOpacity , TouchableWithoutFeedback , View} from "react-native";
import {styles} from "@pages/activities/styles";
import ChevronDownIcon from "@assets/svg/chevron-down";
import Collapsible from "react-native-collapsible";
import {checkFormatIso , formatDate} from "@pages/activities/script";
import moment from "moment";
import {useAlert} from "../../../hooks/useAlert";

import DotVertical from "@assets/svg/dotsVertical";
import ChevronUpIcon from "@assets/svg/chevron-up";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
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



    return <View   style={[styles.group26,  ]}>
        <TouchableWithoutFeedback onPress={() => {
            props.onPress()
            chevronAnimate()
        }

        }>
            <View style={styles.group25}>

                <View style={styles.rect34}>

                    <View>

                        <View style={styles.date}>
                            <Text style={styles.dateText}>{`${readableToHuman()} • ${checkFormatIso(props.item.date, "-")}`} </Text>
                        </View>
                    </View>
                    <View style={{flexDirection: "row",  justifyContent: "space-between", alignItems: "center", }}>
                        <View style={{flex: 0.1, alignItems: "center"}} >

                            <TouchableWithoutFeedback onPress={() => setIsOpen(open => !open)}>
                                <View>

                                    {isOpen ? <ChevronUpIcon width={fontValue(24)} height={fontValue(24)} color={"#000"}/> : <ChevronDownIcon  width={fontValue(24)} height={fontValue(24)} color={"#000"}/>}


                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                        {/*<View style={{alignItems: "center"}}>
                            <TouchableOpacity>
                                <DotVertical  width={fontValue(4)} height={fontValue(18)}  />
                            </TouchableOpacity>

                        </View>*/}


                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

        <Collapsible collapsed={!isOpen}>
            {props.item.activity.map(props.element)}
            <View style={{height: 30, backgroundColor: "white"}}/>
        </Collapsible>

    </View>;
};


export default ApplicationList;