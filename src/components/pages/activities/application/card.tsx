import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular,Regular500} from "@styles/font";
import InputField from "@molecules/form-fields/input-field";
import useSafeState from "../../../../hooks/useSafeState";
import CheckIcon from "@assets/svg/check";
import Moment from "moment";
import {cleanNonNumericChars, currency, toFixedTrunc} from "../../../../utils/ntc";
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
const Card = (_props: {description?:any, error?:any, inputFieldStyle?:any, keyboardType?:string, touchableStyle?:any, descriptionStyle?:any, style?:any,   updateApplication?:any, hasChanges?:any, display?:string, showEdit?:boolean, show?:boolean, editable?:boolean, updateForm?:any, stateName?:string, edit:string, label: string, applicant?: any }) => {
   const props = useMemo(()=> _props, [_props] )
    const isNum = props.keyboardType == 'number-pad' ||props.keyboardType == 'decimal-pad' || props.keyboardType == 'numeric'
    const [cloneValue, setCloneValue] = useSafeState(props.applicant)

    return  ((props.show && (props.display || props.applicant) && !props.edit)) ? <TouchableOpacity style={props.touchableStyle} onPress={()=>{

    }
    }>
        <Text style={[props.style,]}>{isNum ? toFixedTrunc(currency(props.display || props.applicant), 2): (props.display || props.applicant)}</Text>
        {props.description ? <Text style={[props.descriptionStyle]}>{`  ${props.description}`}</Text> : <View style={[props.descriptionStyle]}></View>}
    </TouchableOpacity> : <>
        {((props.edit && props.editable && props.showEdit) )? <InputField description={"Duplicate Entry"} error={props.error} hasValidation={props.error} keyboardType={props.keyboardType}  onSubmitEditing = {(event) => {
            if(!props.edit) props?.updateApplication()
           // setEdit(false)
        }}

                                                                                 onBlur={()=>{
                                                                                     if(!props.edit) props.updateForm(props.stateName, cloneValue)
                                                                                     //setEdit(false)
                                                                                 }
                                                                                 }
                                                                                 mainContainerStyle={[props.inputFieldStyle, {marginVertical: 10}]} onClose={()=>{
            props.updateForm(props.stateName, cloneValue)
            //setEdit(false)
        }}  onChangeText={(e) => {
            if(isNum){


                    props.updateForm(props.stateName, cleanNonNumericChars(e))




            }else{
                props.updateForm(props.stateName,e )
            }

        }
        }   value={props.applicant} label={props.label} /> : <></>}
    </>};

Card.defaultProps = {
    editable: true,
    show: true,
    error: false,
    showEdit: true
}
export default Card
