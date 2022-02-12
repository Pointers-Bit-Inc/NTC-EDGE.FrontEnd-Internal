import {Dimensions, StyleSheet} from "react-native";
import {Poppins_500Medium} from "@expo-google-fonts/poppins";
import {Bold} from "@styles/font";
const { height, width } = Dimensions.get('window');
export const alertStyle = StyleSheet.create({
    actionContainerStyle: {
        justifyContent: "space-around",
        flexDirection: "row-reverse"
    },
    overlayStyle:{
        width: "100%",
        height: "100%",
        position: 'absolute',
        backgroundColor: 'rgba(52,52,52,0.5)'
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
        fontFamily: 'Poppins_500Medium' ,
        color: "#2863D6"
    },
    cancelButtonTextStyle:{
        fontSize: 18,
        fontFamily: 'Poppins_500Medium' ,
        color: "#DC2626"
    }
});