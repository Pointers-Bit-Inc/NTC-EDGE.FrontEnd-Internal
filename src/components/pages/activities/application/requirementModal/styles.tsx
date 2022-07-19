import {Dimensions , Platform , StyleSheet} from "react-native";
import {Bold , Regular , Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";



const { width , height } = Dimensions.get("screen");
export const styles = StyleSheet.create({
    pictureContainer: {
        ...Platform.select({
            native: {
                width : width/1.2 ,
            },
            default: {
               width: 200,
            }
        }),

        height : 200 ,
        borderRadius : 5 ,
        borderWidth : 4 ,
        borderColor : "#fff"
    },
    containers:{
        width : "100%" ,
        ...Platform.select({
            native:{
                paddingHorizontal : 20 ,
            },
            default:{
                paddingHorizontal : 64 ,
            }
        }),
        paddingTop : 34 ,
        paddingBottom : 45
    },
    statement:  {
        borderRadius : 10 ,
        borderBottomStartRadius : 0 ,
        borderBottomEndRadius : 0 ,
        paddingHorizontal : 17 ,
        paddingVertical : 36 ,
        borderBottomWidth : 0 ,
        backgroundColor : "#fff" ,
        borderWidth : 1 ,
        borderColor : "#E5E5E5" ,
    } ,
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
        ...Platform.select({
            native: {
                backgroundColor:"rgba(0, 0, 0, 0.5)"
            },
            default: {
               
            }
        }),

    } ,
    group7 : {} ,
    rect2 : {
        zIndex : 3 ,
        ...Platform.select({
            native: {

            },
            default: {
               
            }
        }),
        alignSelf:'flex-end',
        position: "absolute"

    } ,
    close : {
         fontWeight: "bold",
        fontFamily : Regular500 ,
        color : "rgba(239,231,231,1)" ,
        fontSize : fontValue(18) ,
    } ,
});
export const requirementStyles = StyleSheet.create({
    pdf:{
        zIndex: 1,
        marginTop: 20,
        width : Dimensions.get('window').width ,
        height : Dimensions.get('window').height ,
    },
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
    cardTitle : {
        justifyContent : "space-between" ,
    } ,
    title : {
        paddingHorizontal: 15,
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
