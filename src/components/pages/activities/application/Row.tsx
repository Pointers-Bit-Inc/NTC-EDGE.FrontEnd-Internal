import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React, {memo, useMemo} from "react";
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

        textAlign: "left"
    },
})
const Row = (props: { outlineStyle?: any, containerStyle?:any, inputStyle?: any, multiline?: boolean, updateApplication?: any, hasChanges?: any, display?: string, showEdit?: boolean, show?: boolean, editable?: boolean, updateForm?: any, stateName?: string, edit: string, label: string, applicant?: any }) => {
    const [edit, setEdit] = useSafeState(false)
    const applicantMemo = useMemo(()=>props.display || props.applicant, [props.display,  props.applicant])
    const [cloneValue, setCloneValue] = useSafeState(props.applicant)
    const SUPPORTED_FORMATS = ["jpg", "jpeg", "png"];
    function get_url_extension(url: string) {
        return url?.split(/[#?]/)?.[0]?.split('.')?.pop()?.trim();
    }
    return (!edit ? (props.show && (props.display || props.applicant) && !props.edit) || (edit) : !edit) ?
        <View style={styles.group2}>
            <Text style={styles.detail}>{props.label}</Text>
            {SUPPORTED_FORMATS.indexOf(get_url_extension(applicantMemo)) !== -1 ? <Image source={applicantMemo} style={{width: "100%", height: 100}}/> : <Text style={styles.detailInput}>{applicantMemo} </Text>}
        </View> : <>
            {((props.edit && props.editable && props.showEdit) || edit) ? <InputField containerStyle={props.containerStyle} outlineStyle={props?.outlineStyle} inputStyle={props?.inputStyle} multiline={props.multiline}   onSubmitEditing={(event) => {
                props.updateForm(props.stateName, event?.nativeEvent?.text)
                setEdit(false)
            }}

                                                                                       onChange={(e) => {
                props.updateForm(props.stateName, e?.nativeEvent?.text)
            }} value={props.applicant } label={props.label}/> : <></>}
        </>
};

Row.defaultProps = {
    editable: true, show: true, showEdit: true, multiline: false, inputStyle: {}, containerStyle :{}, outlineStyle: {}
}
export default memo(Row)
