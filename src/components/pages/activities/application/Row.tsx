import {Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import React, {memo, useCallback, useMemo, useRef, useState} from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular, Regular500} from "@styles/font";
import InputField from "@molecules/form-fields/input-field";
import useSafeState from "../../../../hooks/useSafeState";

const styles = StyleSheet.create({
    group2: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 8,
        flexWrap: "wrap",
        paddingHorizontal: 10,
        fontSize: fontValue(12)
    }, detail: {
        fontSize: fontValue(14),
        fontFamily: Regular,
        paddingRight: 0,
        textAlign: "left",
        flex: 1,
        alignSelf: "flex-start"
    }, detailInput: {
        fontSize: fontValue(14), fontFamily: Regular500, color: "#121212", flex: 1,
        flexWrap: "wrap",
        textAlign: "left"
    },
})
const Row = (props: { id?: any, visibleText?: string, outlineStyle?: any, containerStyle?:any, inputStyle?: any, multiline?: boolean, updateApplication?: any, hasChanges?: any, display?: string, showEdit?: boolean, show?: boolean, editable?: boolean, updateForm?: any, stateName?: string, edit: string, label: string, applicant?: any }) => {

    const [edit, setEdit] = useSafeState(false)
    const [value, setValue] = useState()
    const [prevId, setPrevId] = useState(true)
    const applicantMemo = useMemo(()=>{

            if(props.id != prevId){
                setValue( props.display || props.applicant)
                setPrevId(props.id)
            }

        return props.display || props.applicant
    }, [props?.id, value, prevId])



    const [cloneValue, setCloneValue] = useSafeState(props.applicant)
    const SUPPORTED_FORMATS = ["jpg", "jpeg", "png"];
    function get_url_extension(url: string) {
        return url?.split?.(/[#?]/)?.[0]?.split?.('.')?.pop()?.trim();
    }



    const textInput = useRef();
    const getOnChange =((e) => {
        if(Platform.OS != "web"){
            props.updateForm(props.stateName, e?.nativeEvent?.text)
        }
        setValue(e?.nativeEvent?.text)
    })
    return ((!edit ? (props.show && (props.display || props.applicant) && !props.edit) || (edit) : !edit) )  ?
        <View style={styles.group2}>
            {props.label ? <Text style={styles.detail}>{props.label}</Text> : <></>}
            <View style={{flex: 1, }}>
                {SUPPORTED_FORMATS.indexOf(get_url_extension(applicantMemo)) !== -1 ? <Image source={applicantMemo} style={{width: "100%", height: 100}}/> : <Text style={styles.detailInput}>{props.display || props.applicant || applicantMemo || props.visibleText || ""}</Text>}
            </View>
             </View> : <>
            {((props.edit && props.editable && props.showEdit) || edit) ? <InputField mainContainerStyle={{...{marginBottom: 10}}}   ref={textInput}  containerStyle={props.containerStyle} outlineStyle={props?.outlineStyle} inputStyle={props?.inputStyle} multiline={props.multiline} onSubmitEditing={(event) => {
                props.updateForm(props.stateName, value)
                setEdit(false)
            }}  onBlur={(event) => {
                props.updateForm(props.stateName, value)
            }} onChange={getOnChange} value={value} label={props.label} /> : <></>}
        </>
};

Row.defaultProps = {
    editable: true, show: true, showEdit: true, multiline: false, inputStyle: {}, containerStyle :{}, outlineStyle: {}, visibleText: ""
}
export default memo(Row)
