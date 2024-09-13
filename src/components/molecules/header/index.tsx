import {Platform,View} from "react-native";
import {styles} from "@pages/activities/styles";
import Text from "@atoms/text";
import {Bold} from "@styles/font";
import React from "react";
import UploadIcon from "@assets/svg/uploadReport";
import {fontValue} from "@pages/activities/fontValue";

const  Header =({title, size = 24, children}) => {
    return <View style={[styles.headerContent, ]}>

            <View style={styles.titleContainer}>
                <Text
                    color={"#113196"}
                    size={(size) ||24}
                    style={{fontFamily:Bold,marginBottom:Platform.OS==="ios" ? 0 : -5}}
                >
                    {title}
                </Text>
            </View>

        {children}

        </View>

}

export default Header
