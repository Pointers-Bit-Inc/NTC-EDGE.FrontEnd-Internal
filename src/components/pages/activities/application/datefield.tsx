import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular,Regular500} from "@styles/font";
import InputField from "@molecules/form-fields/input-field";
import useSafeState from "../../../../hooks/useSafeState";
import CheckIcon from "@assets/svg/check";
import CustomDropdown from "@pages/activities/dropdown/customdropdown";
import Moment from "moment";
import {monthsArray, yearList} from "../../../../utils/ntc";
import {disabledColor} from "@styles/color";
import CloseIcon from "@assets/svg/close";
const styles = StyleSheet.create({
    group2 : {
        flexDirection : "row" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        marginTop : 8 ,
        flexWrap: "wrap",
        paddingHorizontal : 10  ,
        fontSize: fontValue(12)
    } ,
    detail : {
        fontSize: fontValue(14),
        fontFamily : Regular ,
        paddingRight : 0 ,
        textAlign : "left" ,
        flex : 1 ,
        alignSelf : "flex-start"
    } ,
    detailInput : {
        fontSize: fontValue(14),
        fontFamily : Regular500 ,
        color : "#121212" ,
        flex : 1 ,

        textAlign : "left"
    } ,
})
const DateField = (props: { updateApplication?:any, hasChanges?:any, display?:string, showEdit?:boolean, show?:boolean, editable?:boolean, updateForm?:any, stateName?:string, edit:string, label: string, applicant?: any }) => {

    const [dates, setDates] = useSafeState(typeof props?.applicant == 'string' ?
        props?.applicant?.split('T')?.[0]?.split('-') : (Moment?.isMoment( props?.applicant) ? props?.applicant?.toISOString()?.split?.('T')?.[0]?.split?.('-') :  [(props?.applicant?.year || 1), (props?.applicant?.month || 1), (props?.applicant?.day || 1)]))
    const [time, setTime]= useSafeState(typeof props?.applicant == 'string' ? props?.applicant?.split('T')?.[1] : null)




    const year = dates?.[0]
    const month = dates?.[1]
    const day = dates?.[2]



   let _year = year || Moment().get('year');
    let _month = month || '00';
    const datesArray = Array.from(Array(Moment(new Date()).set({year: _year, month: _month}).daysInMonth()), (_, i) => {
        return {
            label: (i+1).toString().length == 1 ? "0" +(i+1).toString() : (i+1).toString(),
            value: (i+1).toString().length == 1 ? "0" +(i+1).toString() : (i+1).toString(),
        }
    });
    const [edit, setEdit] = useSafeState(false)
    const [monthValue, setMonthValue] = useSafeState(_month)
    const [dayValue, setDayValue] = useSafeState(parseInt(day).toString())
    const [yearValue, setYearValue] = useSafeState(_year)
    const [cloneValue, setCloneValue] = useSafeState(props.applicant)

    useEffect(()=>{
        let _day = dayValue.length == 1 ? "0" + dayValue : dayValue
        props.updateForm(props.stateName, `${yearValue}-${monthValue}-${_day}` + (time ? `T${time}` : ""))
    }, [monthValue, dayValue, yearValue])
    const date = useMemo(() =>{

        const _dates = typeof props?.applicant == 'string' ?  props?.applicant?.split('T')?.[0]?.split('-') : [(props?.applicant?.year || 1), (props?.applicant?.month || 1), (props?.applicant?.day || 1)]
        console.log(_dates)
        setYearValue(_dates?.[0])
        setMonthValue(_dates?.[1])
        setDayValue(_dates?.[2])
        return _dates
    }, [props?.applicant])
    return (!edit ? (props.show && (props.display || props.applicant) && !props.edit) || edit : !edit) ? <View style={ styles.group2 }>
        <Text style={ styles.detail }>{ props.label }</Text>
        <Text style={ styles.detailInput }>{ props.display || props.applicant }</Text>
    </View> : <>
        {((props.edit && props.editable && props.showEdit) || edit)? <View style={{paddingBottom: 10}}>

                <View style={{padding: 3,flexDirection: "row", justifyContent: "space-between"}}>
                    <View style={{flex: 0.9}}>
                        <CustomDropdown value={monthValue}
                                        label="Select Item"
                                        data={monthsArray}
                                        onSelect={({value}) => {
                                            if (value) {
                                                setMonthValue(value)
                                            }
                                        }}/>
                    </View>
                    <View style={{flex:0.7, paddingHorizontal: 5}}>
                        <CustomDropdown value={dayValue}
                                        label="Select Item"
                                        data={datesArray}
                                        onSelect={({value}) => {
                                            if (value) setDayValue(value)
                                        }}/>
                    </View>
                    <View style={{flex:0.8}}>
                        <CustomDropdown value={yearValue}
                                        label="Select Item"
                                        data={yearList()}
                                        onSelect={({value}) => {
                                            if (value) {
                                                setYearValue(value)

                                            }
                                        }}/>
                    </View>

                </View>
                {/*<View style={{ flexDirection: "row", justifyContent: "space-around" , borderRadius: 1, borderTopWidth: 1, borderColor: disabledColor}}>
                    <TouchableOpacity onPress={()=>{
                        //year, month, day, hour, minute, second, and millisecond

                        props?.updateApplication()
                        //setEdit(false)
                    }
                    } style={{alignSelf: "center", padding: 3}}>
                        <CheckIcon color={"rgba(0, 0, 0, 0.5)"}/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                        props.updateForm(props.stateName, cloneValue)
                        //setEdit(false)

                    }
                    } style={{alignSelf: "center", padding: 3}}>
                        <CloseIcon color={"rgba(0, 0, 0, 0.5)"}/>
                    </TouchableOpacity>
                </View>*/}
        </View>: <></>}
        </>

}

DateField.defaultProps = {
    editable: true,
    show: true,
    showEdit: true
}
export default DateField
