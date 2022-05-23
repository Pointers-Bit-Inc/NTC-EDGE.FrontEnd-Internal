import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {Platform,Text,useWindowDimensions,View} from "react-native";
import {isLandscapeSync,isTablet} from "react-native-device-info";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React from "react";
export default function GroupPage(props:any){
    const dimensions=useWindowDimensions();
    return (
        <View style={{backgroundColor:"#F8F8F8",flex:1,flexDirection:"row"}}>
            <View style={[styles.container,styles.shadow,{
                flexBasis:(
                              (
                                  isMobile&& !(
                                      Platform?.isPad||isTablet()))||dimensions?.width<768||(
                                  (
                                      Platform?.isPad||isTablet())&& !isLandscapeSync())) ? "100%" : 466,
                flexGrow:0,
                flexShrink:0
            }]}>
            </View>
            {
                !(
                    (
                        isMobile&& !(
                            Platform?.isPad||isTablet())))&&dimensions?.width>768&&
                <View style={[{flex:1,justifyContent:"center",alignItems:"center"}]}>

                    <NoActivity/>
                    <Text style={{color:"#A0A3BD",fontSize:fontValue(24)}}>No activity
                        selected</Text>


                </View>
            }

        </View>
    )
}