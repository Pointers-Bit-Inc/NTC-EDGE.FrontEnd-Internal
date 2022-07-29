import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";
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
const RowText = (props: { display?: string, label: string, applicant?: any }) => {

    return  <>{(props.display || props.applicant )? <View style={styles.group2}>
            <Text style={styles.detail}>{props.label}</Text>
            <Text style={styles.detailInput}>{props.display || props.applicant}</Text>
        </View> : <></>}</>
};

RowText.defaultProps = {
    editable: true, show: true, showEdit: true
}
export default RowText
