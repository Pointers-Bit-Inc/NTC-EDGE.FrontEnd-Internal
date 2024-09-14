import {Platform, useWindowDimensions, View} from "react-native";
import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {isTablet} from "@/src/utils/formatting";
import React from "react";

function LeftSideWeb(props) {
    const dimensions=useWindowDimensions();
    return <View style={[styles.container, styles.shadow, {
        flexBasis: (
            (
                isMobile && !(
                    Platform?.isPad || isTablet())) || dimensions?.width < 768 || (
                (
                    Platform?.isPad || isTablet()) && !isLandscapeSync)) ? "100%" : 466,
        flexGrow: 0,
        flexShrink: 0,
        backgroundColor: "#FFFFFF"
    }]}>
        {props.children}
    </View>;
}


export default LeftSideWeb