import {Animated, View} from "react-native";
import FormField from "@organisms/forms/form";
import Text from "@atoms/text";
import React, {useEffect, useMemo} from "react";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import {ampmArray, datesArray, formatAMPM, hoursArray, toIsoFormat} from "../../../utils/ntc";
import useSafeState from "../../../hooks/useSafeState";
import Moment from "moment";
import CalendarView from "@pages/schedule/CalendarView";
import CalendarModal from "@pages/schedule/CalendarModal";
import _ from "lodash";

function ScheduleTime(props: { scheduleId: any, value: any, id: string, onChange: any }) {

    const dates = useMemo(() => {

        return (props?.value ? props?.value : ((props?.value || new Date())?.toISOString()))?.split?.('T')?.[0]?.split?.('-')

    }, [props?.value])
    const year = dates?.[0]
    const month = dates?.[1]
    const day = dates?.[2]
    let _year = year || Moment().get('year');
    let _month = month || '00';
    const [hourValue, setHourValue] = useSafeState(12)
    const [minuteValue, setMinuteValue] = useSafeState("00")
    const [ampmValue, setAmpmValue] = useSafeState("am")
    const [monthValue, setMonthValue] = useSafeState(_month)
    const [dayValue, setDayValue] = useSafeState(parseInt(day).toString())
    const [yearValue, setYearValue] = useSafeState(_year)
    const [initializeValue, setInitializeValue] = useSafeState(false)
    const [prevScheduleId, setPrevScheduleId] = useSafeState("")
    const [prevValue, setPrevValue] = useSafeState("")
    const time = useMemo(() => {

        if (!props.value) return
        const format = formatAMPM(new Date(props?.value?.replace?.(/\.\d+/, "")))

        if ((prevScheduleId != props.scheduleId) && (prevValue != props.value)) {
            setHourValue(format?.[0])
            setMinuteValue(  format?.[1] ? "00": format?.[1])
            setAmpmValue(format?.[2])
            setInitializeValue(false)
            setPrevScheduleId(props.scheduleId)
            setPrevValue(props.value)
        }
        return format

    }, [hourValue, minuteValue, ampmValue, props.scheduleId, props.value, prevScheduleId, prevValue])


    useEffect(() => {
        props.onChange(props.id, toIsoFormat(Moment(`${dates?.[0]}-${dates?.[1]}-${dates?.[2]} ${hourValue}:${minuteValue} ${ampmValue}`, 'YYYY-MM-DD HH:mm a')))
    }, [minuteValue, hourValue, ampmValue, yearValue, monthValue, dayValue])

    return <>
        <View style={{flex: 0.9}}>
            <CustomDropdown value={hourValue}
                            label="Hour"
                            data={hoursArray}
                            onSelect={({value}) => {
                                if (value) setHourValue(value)
                            }}/>
        </View>
        <View style={{flex: 0.7, paddingHorizontal: 5}}>
            <CustomDropdown value={minuteValue}
                            label="Minute"
                            data={datesArray}
                            onSelect={({value}) => {
                                if (value) setMinuteValue(value)
                            }}/>
        </View>
        <View style={{flex: 0.7}}>
            <CustomDropdown value={ampmValue}
                            label="AM/PM"
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
    formElements: ({ stateName: string; id: number; label: string; error: boolean; type: string; value: any } | { data: ({ label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string } | { label: string; value: string })[]; stateName: string; id: number; label: string; error: boolean; type: string; value: any } | { stateName: string; id: number; label: string; error: boolean; type: string; value: any } | { stateName: string; id: number; label: string; error: boolean; type: string; value: any })[],
    onChange: (id: number, text: any, element?: string, _key?: string) => void,
    onPress: () => void,
    onPress1: () => void,
    id: any,
    backgroundColor: Animated.AnimatedInterpolation,
    scale: Animated.AnimatedInterpolation,
    translateY: Animated.AnimatedInterpolation,
    onPress2: () => void, dimensions: ScaledSize, onDateChange: (date, type) => void
}) {

    return <>
        <View style={{flex: 1, paddingHorizontal: 26, flex: 1}}>

            <FormField
                formElements={props.formElements}
                onChange={props.onChange}
            />

            <View style={{paddingBottom: 10}}><View>
                <View style={{padding: 3}}>
                    <Text size={12}>Start Time</Text>
                </View>
                <View style={{padding: 3, flexDirection: "row", justifyContent: "space-between"}}>
                    <ScheduleTime scheduleId={props.id} onChange={props.onChange} id={3}
                                  value={props.formElements?.[2]?.value}/>

                </View>
            </View></View>
            <View style={{paddingBottom: 10}}><View>
                <View style={{padding: 3}}>
                    <Text size={12}>End Time</Text>
                </View>
                <View style={{padding: 3, flexDirection: "row", justifyContent: "space-between"}}>
                    <ScheduleTime scheduleId={props.id} onChange={props.onChange} id={4}
                                  value={props.formElements?.[3]?.value}/>
                </View>
            </View></View>
            <CalendarView onPress={props.onPress}
                          startDate={props.formElements?.[2]?.value}
                          endDate={props.formElements?.[3]?.value}
                          onPress1={props.onPress1}/>


        </View>


        <CalendarModal backgroundColor={props.backgroundColor}
                       scale={props.scale}
                       translateY={props.translateY}
                       onPress={props.onPress2}
                       dimensions={props.dimensions}
                       formElements={props.formElements}
                       onDateChange={props.onDateChange}/>
    </>;
}

export default ScheduleCreateEdit
