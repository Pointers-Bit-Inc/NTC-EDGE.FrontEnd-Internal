import {Dimensions, StyleSheet} from "react-native";
import {Poppins_500Medium} from "@expo-google-fonts/poppins";
import {Bold , Regular500} from "@styles/font";
import {disabledColor} from "@styles/color";
const { height, width } = Dimensions.get('window');
export const alertStyle = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',

    },
    overlay: {
        width: "100%",
        height: "100%",
        position: 'absolute',
        backgroundColor: 'rgba(52,52,52,0.5)'
    },
    contentContainer: {

    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    action: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginTop: 5
    },
    title: {
        paddingVertical: 5,
        paddingHorizontal: 15,
        color: '#626262',
        fontSize: 18
    },
    message: {
        paddingTop: 5,
        color: '#7b7b7b',
        fontSize: 14
    },
    button: {
        paddingHorizontal: 10,
        paddingVertical: 7,
        margin: 5,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        fontSize: 13
    },
    actionContainerStyle: {
        justifyContent: "space-around",
        flexDirection: "row-reverse"
    },
    overlayStyle:{
        width: "100%",
        height: "100%",
        position: 'absolute',

        //backgroundColor: 'rgba(52,52,52,0.5)'
    },
    titleStyle:{
        fontFamily: Bold,
        fontSize: 18,
    } ,
    contentContainerStyle:{
        borderRadius: 14,
    },
    confirmButtonTextStyle:{
        fontSize: 18,
        fontFamily: Regular500 ,
        color: "#2863D6"
    },
    cancelButtonTextStyle:{
        fontSize: 18,
        fontFamily: Regular500  ,
        color: "#DC2626"
    },
    disableButtonTextStyle:{
        fontSize: 18,
        fontFamily: Regular500  ,
        color: disabledColor
    }
});
