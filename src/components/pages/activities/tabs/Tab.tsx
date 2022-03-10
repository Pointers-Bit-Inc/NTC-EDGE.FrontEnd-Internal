import {Animated , TouchableOpacity} from "react-native";
import {primaryColor} from "@styles/color";
import {Bold , Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import React from "react";
const Tab = ({ tab , page , isTabActive , onPressHandler , onTabLayout , styles }) => {
    const { label , icon } = tab;
    const style = {
        marginLeft : 20 ,
        paddingBottom : 10 ,
    };
    const containerStyle = {
        transform : [{ scale : styles.scale }] ,
    };
    return (
        <TouchableOpacity style={ style } onPress={ onPressHandler } onLayout={ onTabLayout } key={ page }>
            <Animated.View style={ containerStyle }>
                <Animated.Text style={ {
                    color : isTabActive ? primaryColor : "#606A80" ,
                    fontFamily : isTabActive ? Bold : Regular ,
                    fontSize : fontValue(12)
                } }>{ label }</Animated.Text>
            </Animated.View>
        </TouchableOpacity>
    );
};
export default Tab