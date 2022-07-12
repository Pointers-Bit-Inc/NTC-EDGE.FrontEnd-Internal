import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular,Regular500} from "@styles/font";
import InputField from "@molecules/form-fields/input-field";
import useSafeState from "../../../../hooks/useSafeState";
import CheckIcon from "@assets/svg/check";
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
const Row = (props: { updateApplication?:any, hasChanges?:any, display?:string, showEdit?:boolean, show?:boolean, editable?:boolean, updateForm?:any, stateName?:string, edit:string, label: string, applicant?: any }) => {
    const [edit, setEdit] = useSafeState(false)

    const [cloneValue, setCloneValue] = useSafeState(props.applicant)
    return  (!edit ? (props.show && (props.display || props.applicant) && !props.edit) || (edit) : !edit) ? <TouchableOpacity disabled={!props?.showEdit} onPress={()=>{
        if(props.showEdit)setEdit(true)
    }
    } style={ styles.group2 }>
        <Text style={ styles.detail }>{ props.label }</Text>
        <Text style={ styles.detailInput }>{ props.display || props.applicant }</Text>
    </TouchableOpacity> : <>
        {((props.edit && props.editable && props.showEdit) || edit)? <InputField onClose={()=>{
            props.updateForm(props.stateName, cloneValue)
            setEdit(false)
        }} onCheck={()=>{
            props?.updateApplication()
            setEdit(false)
        }} checkable={true}  onChange={(e) => {
            props.updateForm(props.stateName, e?.nativeEvent?.text)
        }
        }   value={props.applicant} label={props.label} /> : <></>}
    </>};

Row.defaultProps = {
    editable: true,
    show: true,
    showEdit: true
}
export default Row
