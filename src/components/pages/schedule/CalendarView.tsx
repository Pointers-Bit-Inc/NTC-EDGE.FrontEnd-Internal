import {TouchableOpacity, View} from "react-native";
import {input} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import CalendarDateIcon from "@assets/svg/calendarIcon";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import dayjs from "dayjs";
import {px} from "../../../utils/normalized";
import React from "react";
import CloseIcon from "@assets/svg/close";
CalendarView.defaultProps = {
    isCloseable: false
}
function CalendarView(props: {
    onPress: () => void,
    startDate: any,
    endDate: any,
    onPress1: () => void,
    onCloseable: () => void,
    isCloseable: any
}) {
    return <View style={{

        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: input.background?.default,
        borderColor: input.background?.default,
        borderWidth: fontValue(2),
        borderRadius: fontValue(10),
        paddingHorizontal: fontValue(15),
        height: fontValue(50),
    }}>
        <TouchableOpacity
            onPress={props.onPress}
            activeOpacity={0.5}
            style={{
                flex: 1,
                height: (40),
                paddingHorizontal: 1,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
            }}
        >
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <View>
                    <CalendarDateIcon fill={"#6E7191"} width={21} height={21}/>
                </View>

                <Text size={14} style={styles.dateCalendar}>
                    {props.startDate? dayjs(props.startDate).format("YYYY-MM-DD") : ""}
                </Text>
            </View>

        </TouchableOpacity>
        <View style={{marginHorizontal: 2}}>
            <Text>
                ~
            </Text>
        </View>
        <TouchableOpacity
            onPress={props.onPress1}
            activeOpacity={0.5}
            style={{
                flex: 1,
                height: px(40),
                paddingHorizontal: 1,
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
            }}
        >
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <View>
                    <CalendarDateIcon fill={"#6E7191"} width={21} height={21}/>
                </View>

                <Text size={14} style={styles.dateCalendar}>
                    {props.endDate? dayjs(props.endDate).format("YYYY-MM-DD") : ""}
                </Text>
            </View>

        </TouchableOpacity>

        {props.isCloseable ? <TouchableOpacity onPress={props.onCloseable}>
            <CloseIcon/>
        </TouchableOpacity> : <></>}
    </View>;
}


export default CalendarView
