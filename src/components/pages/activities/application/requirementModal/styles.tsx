import {Dimensions , StyleSheet} from "react-native";
import {Bold , Regular , Regular500} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";



const { width , height } = Dimensions.get("screen");
export const styles = StyleSheet.create({
    fileName : {
        fontFamily: Regular,
        
        flexWrap : "wrap" ,
        fontSize : RFValue(16) ,
        color : "#fff" ,
        paddingHorizontal : 30 ,
        position : "absolute" ,
        paddingVertical : 10 ,
        zIndex : 2
    } ,
    imageStyle : {
        height : height ,
        width : width ,
    } ,
    container : {
        flex : 1
    } ,
    group7 : {} ,
    rect2 : {
        zIndex : 3 ,

        width : "100%" ,
        backgroundColor : "rgba(0,0,0,0.5)"
    } ,
    close : {

        fontFamily : Regular500 ,
        color : "rgba(239,231,231,1)" ,
        fontSize : RFValue(18) ,
    } ,
});
export const requirementStyles = StyleSheet.create({
    container : {
        flex : 1
    } ,
    card : {
        padding : 10 ,
        width : "100%" ,

    } ,
    cardContainer : {

        backgroundColor : "rgba(255,255,255,1)" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            width : 0 ,
            height : 0
        } ,
        elevation : 1.5 ,
        shadowOpacity : 0.1 ,
        shadowRadius : 5 ,
        borderRadius : 5
    } ,
    cardLabel : {
        width : "100%" ,
        justifyContent : "space-between" ,
        paddingVertical : 12 ,
        paddingLeft : 12
    } ,
    cardTitle : {
        justifyContent : "space-between" ,
    } ,
    title : {
        fontSize: RFValue(14),
        fontFamily: Bold,
        color : "#37405B"
    } ,

    paymentDescription:{
        fontSize: RFValue(14),
        fontFamily: Regular,
        color: "#37405B"
    },
    description : {
        fontSize: RFValue(14),
        color : "#1F2022",
        justifyContent: "center"
    } ,
    cardDocument : {

        flexDirection : "row" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        margin : 0
    } ,
    text : {
        fontSize: RFValue(14),
        fontFamily: Regular,
        width : "80%" ,
        color : "#606A80"
    } ,
    cardPicture : {

        height : "70%" ,

        backgroundColor : "#E6E6E6"
    }
});