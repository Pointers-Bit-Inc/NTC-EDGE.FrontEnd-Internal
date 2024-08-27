import {Platform} from "react-native";
import {isLandscapeSync} from "react-native-device-info";

export const isMobile = (
    (Platform?.OS === "ios" || Platform?.OS === "android"))