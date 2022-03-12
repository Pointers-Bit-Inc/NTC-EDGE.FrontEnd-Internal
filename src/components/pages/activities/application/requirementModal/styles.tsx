import {Dimensions , StyleSheet} from "react-native";
import {Bold , Regular , Regular500} from "@styles/font";
import {RFValue} from "react-native-responsive-fontsize";
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";



const { width , height } = Dimensions.get("screen");
export const styles = StyleSheet.create({
    fileName : {
        fontFamily: Regular,
        
        flexWrap : "wrap" ,
        fontSize : fontValue(16) ,
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
        flex : 1 ,


    } ,
    group7 : {} ,
    rect2 : {
        zIndex : 3 ,

        backgroundColor : "rgba(0,0,0,0.5)"
    } ,
    close : {

        fontFamily : Regular500 ,
        color : "rgba(239,231,231,1)" ,
        fontSize : fontValue(18) ,
    } ,
});
export const requirementStyles = StyleSheet.create({
    container : {
        flex : 1 ,
    } ,
    card : {

        width : "100%" ,

    } ,
    cardContainer : {
        paddingVertical: 20,
        backgroundColor : "rgba(255,255,255,1)" ,
         borderWidth: 1,
        borderColor:"#E5E5E5",
        borderRadius : 5
    } ,
    cardLabel : {
        width : "100%" ,
        justifyContent : "space-between" ,
        paddingLeft : 12
    } ,
    cardTitle : {
        justifyContent : "space-between" ,
    } ,
    title : {
        fontSize: fontValue(14),
        fontFamily: Bold,
        color : "#37405B"
    } ,

    paymentDescription:{
        fontSize: fontValue(14),
        fontFamily: Regular,
        color: "#37405B"
    },
    description : {
        
        fontSize: fontValue(14),
        color : "#1F2022",
        justifyContent: "center"
    } ,
    cardDocument : {
            paddingVertical: 10,
        flexDirection : "row" ,
        justifyContent : "flex-start" ,
        alignItems : "center" ,
        margin : 0
    } ,
    text : {
        fontSize: fontValue(14),
        fontFamily: Regular,
        color : "#606A80"
    } ,
    cardPicture : {

        backgroundColor : "#E6E6E6"
    }
});