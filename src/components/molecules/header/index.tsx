import {Platform,View} from "react-native";
import {styles} from "@pages/activities/styles";
import Text from "@atoms/text";
import {Bold} from "@styles/font";
import React from "react";
import UploadIcon from "@assets/svg/uploadReport";

const  Header =({title}) => {
    return <View style={styles.headerContent}>

            <View style={styles.titleContainer}>
                <Text
                    color={"#113196"}
                    size={24}
                    style={{fontFamily:Bold,marginBottom:Platform.OS==="ios" ? 0 : -5}}
                >
                    {title}
                </Text>
            </View>

        </View>

}

export default Header