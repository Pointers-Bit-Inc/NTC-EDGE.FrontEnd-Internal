import {RFValue} from "react-native-responsive-fontsize";
import {Platform} from "react-native";
import {isMobile} from "@pages/activities/isMobile";
import {isTablet} from "@/src/utils/formatting";
import {px} from "../../../utils/normalized";

export const fontValue = (number) => {
    return  (isMobile && !(Platform?.isPad || isTablet()))  ? RFValue(number) : px(number);
}