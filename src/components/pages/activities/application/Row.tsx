import {StyleSheet,Text,View} from "react-native";
import React from "react";
import {fontValue} from "@pages/activities/fontValue";
import {Regular,Regular500} from "@styles/font";
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
const Row = (props: { label: string, applicant: any }) => {
    return props.applicant ? <View style={ styles.group2 }>
        <Text style={ styles.detail }>{ props.label }</Text>
        <Text style={ styles.detailInput }>{ props.applicant }</Text>
    </View> : <></>};


export default Row
