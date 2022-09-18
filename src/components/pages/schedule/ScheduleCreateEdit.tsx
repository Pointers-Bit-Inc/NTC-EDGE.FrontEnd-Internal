import {Animated, TouchableOpacity, View} from "react-native";
import FormField from "@organisms/forms/form";
import {infoColor, input} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import CalendarDateIcon from "@assets/svg/calendarIcon";
import Text from "@atoms/text";
import {styles} from "@pages/activities/styles";
import dayjs from "dayjs";
import {px} from "../../../utils/normalized";
import CloseIcon from "@assets/svg/close";
import React from "react";
import CalendarPicker from 'react-native-calendar-picker';
import {isMobile} from "@pages/activities/isMobile";
function ScheduleCreateEdit(props: {
    formElements: ({ stateName: string; id: number; label: string; error: boolean; type: string; value: any } | { data: ({ label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string })[]; stateName: string; id: number; label: string; error: boolean; type: string; value: any } | { stateName: string; id: number; label: string; error: boolean; type: string; value: any } | { stateName: string; id: number; label: string; error: boolean; type: string; value: any })[], onChange: (id: number, text: any, element?: string, _key?: string) => void, onPress: () => void, onPress1: () => void, backgroundColor: Animated.AnimatedInterpolation, scale: Animated.AnimatedInterpolation, translateY: Animated.AnimatedInterpolation, onPress2: () => void, dimensions: ScaledSize, onDateChange: (date, type) => void
}) {
    return <>
        <View style={{paddingHorizontal: 26, flex: 1}}>

            <FormField
                formElements={props.formElements}
                onChange={props.onChange}

                // editable={editable}
            />



                <View

                    style={{

                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        backgroundColor: input.background?.default,
                        borderColor: input.background?.default,
                        borderWidth: fontValue(2),
                        borderRadius: fontValue(10),
                        paddingHorizontal: fontValue(15),
                        height: fontValue(50),
                    }}
                >
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
                                {props.formElements?.[2]?.value ? dayjs(props.formElements?.[2]?.value).format("YYYY-MM-DD") : ""}
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
                                {props.formElements?.[3]?.value ? dayjs(props.formElements?.[3].value).format("YYYY-MM-DD") : ""}
                            </Text>
                        </View>

                    </TouchableOpacity>
                </View>


            </View>


        <Animated.View
            pointerEvents="box-none"
            style={[
                styles.background,
                {
                    backgroundColor: props.backgroundColor,
                },
            ]}>
            <Animated.View
                style={[
                    styles.background,
                    {
                        transform: [{scale: props.scale}, {translateY: props.translateY}],
                    },
                ]}>
                <View style={styles.wrap}>
                    <View style={styles.modalHeader}/>
                    <View style={{
                        padding: 20,
                        flexDirection: "row",
                        justifyContent: "flex-end"
                    }}>
                        <View>
                            <TouchableOpacity

                                onPress={props.onPress2}>
                                <CloseIcon/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <CalendarPicker

                        width={props.dimensions.width * 0.5}
                        height={props.dimensions.height * 0.8}
                        headerWrapperStyle={!isMobile ? {width: "100%"} : {}}
                        startFromMonday={true}
                        allowRangeSelection={true}
                        todayBackgroundColor="#f2e6ff"
                        selectedDayColor={infoColor}
                        selectedDayTextColor="#FFFFFF"
                        onDateChange={props.onDateChange}
                    />

                </View>
            </Animated.View>
        </Animated.View>
    </>;
}
export default ScheduleCreateEdit
