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
import React, {useEffect, useMemo} from "react";
import CalendarPicker from 'react-native-calendar-picker';
import {isMobile} from "@pages/activities/isMobile";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import {ampmArray, datesArray, formatAMPM, hoursArray, toIsoFormat} from "../../../utils/ntc";
import useSafeState from "../../../hooks/useSafeState";
import Moment from "moment";

function ScheduleTime(props: { value: any, id: string, onChange: any}) {

    const dates = useMemo(() =>{
        console.log(props?.value, "dates")
        return (typeof props!.value == "string" ? (props?.value) : (props?.value?.toISOString()))?.split?.('T')?.[0]?.split?.('-')
    }, [props?.value])
    const year = dates?.[0]
    const month = dates?.[1]
    const day = dates?.[2]
    let _year = year || Moment().get('year');
    let _month = month || '00';
    const [hourValue, setHourValue] = useSafeState()
    const [minuteValue, setMinuteValue] = useSafeState(0)
    const [ampmValue, setAmpmValue] = useSafeState(0)
    const [monthValue, setMonthValue] = useSafeState(_month)
    const [dayValue, setDayValue] = useSafeState(parseInt(day).toString())
    const [yearValue, setYearValue] = useSafeState(_year)
    const time = useMemo(() => {
        const format = formatAMPM(new Date(props?.value))
        setHourValue(format?.[0])
        setMinuteValue(format?.[1])
        setAmpmValue(format?.[2])
        return format
    }, [])


    useEffect(()=>{


        props.onChange(props.id, toIsoFormat(Moment(`${dates?.[0]}-${dates?.[1]}-${dates?.[2]} ${hourValue}:${minuteValue} ${ampmValue}`,'YYYY-MM-DD HH:mm a')))
    }, [minuteValue, hourValue, ampmValue, yearValue, monthValue, dayValue])

    return <>
        <View style={{flex: 0.9}}>
            <CustomDropdown value={hourValue}
                            label="Select Hour"
                            data={hoursArray}
                            onSelect={({value}) => {
                                if (value) setHourValue(value)
                            }}/>
        </View>
        <View style={{flex: 0.7, paddingHorizontal: 5}}>
            <CustomDropdown value={minuteValue}
                            label="Select Minute"
                            data={datesArray}
                            onSelect={({value}) => {
                                if (value) setMinuteValue(value)
                            }}/>
        </View>
        <View style={{flex: 0.7}}>
            <CustomDropdown value={ampmValue}
                            label="Select AM/PM"
                            data={ampmArray}
                            onSelect={({value}) => {
                                if (value) {
                                    setAmpmValue(value)

                                }
                            }}/>
        </View>
    </>;
}

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

            <View style={{paddingBottom: 10}}><View>
                <View style={{padding: 3}}>
                    <Text size={12}>Start Time</Text>
                </View>
                <View style={{padding: 3, flexDirection: "row", justifyContent: "space-between"}}>
                    <ScheduleTime onChange={props.onChange} id={3} value={props.formElements?.[2]?.value}/>

                </View>
            </View></View>
            <View style={{paddingBottom: 10}}><View>
                <View style={{padding: 3}}>
                    <Text size={12}>End Time</Text>
                </View>
                <View style={{padding: 3, flexDirection: "row", justifyContent: "space-between"}}>
                    <ScheduleTime onChange={props.onChange} id={4} value={props.formElements?.[3]?.value}/>

                </View>
            </View></View>
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
