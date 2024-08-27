import {Bold} from "@styles/font";
import {primaryColor} from "@styles/color";
import {Platform , StyleSheet} from "react-native";

const button = StyleSheet.create({
    confirmButtonContainer : {
        borderTopWidth: 1,
        borderTopColor: "#EFEFEF",

        ...Platform.select({
            native : {} ,
            default : { alignItems : "flex-end" }
        })
    } ,
    confirm : {
        color : "rgba(255,255,255,1)" ,
        fontFamily : Bold ,
        fontSize : 18 ,
    } ,
    confirmButton : {
        backgroundColor : primaryColor ,
        borderRadius : 12 ,
        ...Platform.select({
            native : {
                padding : 16 ,
            } ,
            default : {
                padding : 10
            }
        }) ,
        
        flexDirection: "row",
        alignItems : 'center' ,
        justifyContent : 'center' ,
    }
});

export default button