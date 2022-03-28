import {RFValue} from "react-native-responsive-fontsize";
import {Platform} from "react-native";

export const fontValue = (number) => {

    return  Platform.OS === "ios" || Platform.OS === "android" ? RFValue(number) : number;
}