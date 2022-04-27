import {RFValue} from "react-native-responsive-fontsize";
import {Platform} from "react-native";
import {isMobile} from "@pages/activities/isMobile";
import {isTablet} from "react-native-device-info";

export const fontValue = (number) => {

    return  (isMobile && !(Platform?.isPad || isTablet()))  ? RFValue(number) : number;
}