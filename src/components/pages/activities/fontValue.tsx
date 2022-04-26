import {RFValue} from "react-native-responsive-fontsize";
import {Platform} from "react-native";
import {isMobile} from "@pages/activities/isMobile";

export const fontValue = (number) => {

    return  (isMobile && !Platform?.isPad)  ? RFValue(number) : number;
}