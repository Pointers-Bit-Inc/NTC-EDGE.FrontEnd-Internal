import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular,Regular500} from "@styles/font";
import InputField from "@molecules/form-fields/input-field";
import useSafeState from "../../../../hooks/useSafeState";
import CheckIcon from "@assets/svg/check";
import Moment from "moment";
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
const Card = (props: {inputFieldStyle?:any, keyboardType?:string, touchableStyle?:any, style?:any,   updateApplication?:any, hasChanges?:any, display?:string, showEdit?:boolean, show?:boolean, editable?:boolean, updateForm?:any, stateName?:string, edit:string, label: string, applicant?: any }) => {
    return <Text style={[props.style,]}>{props.display || props.applicant}</Text>};

Card.defaultProps = {
    editable: true,
    show: true,
    showEdit: true
}
export default Card
