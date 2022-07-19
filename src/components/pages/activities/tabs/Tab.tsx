import {Animated, TouchableOpacity, View} from "react-native";
import {infoColor, primaryColor} from "@styles/color";
import {Bold , Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import React, {memo} from "react";
const Tab = ({ tab , page , isTabActive , onPressHandler , onTabLayout , styles }) => {
    const { label , icon } = tab;
    const style = {
        marginLeft : 20 ,
        paddingBottom : 10 ,
    };

    return (
        <TouchableOpacity style={ style } onPress={ onPressHandler } onLayout={ onTabLayout } key={ page }>
            <View >
                <Animated.Text style={ {
                    color : isTabActive ? infoColor : "#606A80" ,
                    fontFamily : isTabActive ? Bold : Regular ,
                    fontSize : fontValue(12)
                } }>{ label }</Animated.Text>
            </View>
        </TouchableOpacity>
    );
};
export default memo(Tab)
