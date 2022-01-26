import {Dimensions, StyleSheet} from "react-native";
const { height, width } = Dimensions.get('window');
export const alertStyle = StyleSheet.create({
    actionContainerStyle: {
        justifyContent: "space-around",
        flexDirection: "row-reverse"
    },
    overlayStyle:{
        width: width,
        height: height,
        position: 'absolute',
        backgroundColor: 'rgba(52,52,52,0.5)'
    },
    titleStyle:{
        fontWeight: '600',
        fontSize: 18,
    } ,
    contentContainerStyle:{
        borderRadius: 14,
    },
    confirmButtonTextStyle:{
        fontSize: 18,
        fontWeight: '500',
        color: "#2863D6"
    },
    cancelButtonTextStyle:{
        fontSize: 18,
        fontWeight: '500',
        color: "#DC2626"
    }
});