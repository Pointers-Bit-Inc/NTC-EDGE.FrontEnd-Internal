import {StyleSheet, Text} from "react-native";
import React from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular, Regular500} from "@styles/font";

const styles = StyleSheet.create({
    group2: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginTop: 8,
        flexWrap: "wrap",
        paddingHorizontal: 10,
        fontSize: fontValue(12)
    },
    detail: {
        fontSize: fontValue(14),
        fontFamily: Regular,
        paddingRight: 0,
        textAlign: "left",
        flex: 1,
        alignSelf: "flex-start"
    },
    detailInput: {
        fontSize: fontValue(14),
        fontFamily: Regular500,
        color: "#121212",
        flex: 1,

        textAlign: "left"
    },
})
const ApplicationCard = (props: { style?: any, display?: string, label: string, applicant?: any }) => {

    return <Text style={[props.style,]}>{props.display || props.applicant}</Text>;
}
ApplicationCard.defaultProps = {
    editable: true,
    show: true,
    showEdit: true
}
export default ApplicationCard
