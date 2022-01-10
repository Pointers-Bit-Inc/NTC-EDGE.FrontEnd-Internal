import React, {useRef, useState} from "react";
import {Animated, FlatList, Text, TouchableWithoutFeedback, View} from "react-native";
import {styles} from "@pages/activities/styles";
import ChevronDownIcon from "@assets/svg/chevron-down";
import Collapsible from "react-native-collapsible";
function ApplicationList(props: { onPress: () => void, item: any, numbers: { parentIndex: number, child: number[]}[], index: number, element: (activity: any, i: number) => JSX.Element }) {
    const chevronValue = useRef(new Animated.Value(0)).current
    const [isOpen, setIsOpen] = useState(true)
    const chevronAnimate = () => {
        Animated.timing(
            chevronValue,
            {
                useNativeDriver: true,
                toValue: isOpen ? 1 : 0,
                duration: 200,
            }
        ).start((o) => {

            if (o.finished) {
                setIsOpen(open => !open)

            }

        });
    }
    return <View style={styles.group26}>
        <TouchableWithoutFeedback onPress={() => {
            props.onPress()
            chevronAnimate()
        }

        }>
            <View style={styles.group25}>
                <View style={styles.rect34}>
                    <View style={styles.group24}>
                        <View style={styles.date}>

                            <Text style={styles.dateText}>{props.item.readableHuman} </Text>
                            <View style={styles.dot}/>
                            <Text style={styles.dateText}> {props.item.date}</Text>
                        </View>
                        <View style={styles.rect36}></View>
                    </View>
                    <View style={styles.group24Filler}></View>
                    <View style={styles.group23}>
                        <View style={styles.stackFiller}></View>
                        <View style={styles.icon4Stack}>
                            <Animated.View style={[styles.icon4, {
                                transform: [
                                    {
                                        rotate: chevronValue.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ["0deg", "-90deg"]
                                        })
                                    }
                                ]
                            }]}>
                                <ChevronDownIcon

                                />
                            </Animated.View>

                            <View style={styles.rect35}></View>
                        </View>

                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>

        <Collapsible collapsed={!isOpen}>
            {props.item.activity.map(props.element)}
            <View style={{height: 30, backgroundColor: "white", marginTop: -1}}/>
        </Collapsible>

    </View>;
}


export default ApplicationList;