import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {Platform, Text, TextInput, useWindowDimensions, View} from "react-native";
import {isTablet} from "react-native-device-info";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React, {useState} from "react";
import LeftSideWeb from "@atoms/left-side-web";
import Header from "@molecules/header";
import SearchIcon from "@assets/svg/search";

export default function GroupPage(props:any){
    const dimensions=useWindowDimensions();
    const [value,setValue]=useState();
    return (
        <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
            <LeftSideWeb>
                <View style={styles.header}>
                    <Header title={"Group"}/>
                    <View style={{marginHorizontal:26,}}>

                        <View style={{
                            paddingTop:14,
                            paddingBottom:12,
                            alignItems:"center",
                            justifyContent:"space-between",
                            flexDirection:"row",
                            flex:1
                        }}>
                            <View style={{flex:1,paddingRight:15}}>
                                <TextInput value={value} onChangeText={text=>{
                                    setValue(text)
                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>
                        </View>


                    </View>
                </View>
            </LeftSideWeb>
            {
                !(
                    (
                        isMobile && !(
                            Platform?.isPad || isTablet()))) && dimensions?.width > 768 &&
                <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                    <NoActivity/>
                    <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                        selected</Text>


                </View>
            }

        </View>
    )
}