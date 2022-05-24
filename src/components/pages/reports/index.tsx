import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {Platform,TextInput,useWindowDimensions,View} from "react-native";
import Text from "@atoms/text"
import {isLandscapeSync,isTablet} from "react-native-device-info";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React,{useState} from "react";
import Header from "@molecules/header";
import UploadIcon from "@assets/svg/uploadReport";
import SearchIcon from "@assets/svg/search";
import FilterIcon from "@assets/svg/filterIcon";
import FilterPressIcon from "@assets/svg/filterPress";
import RefreshWeb from "@assets/svg/refreshWeb";
import RadioButtonOffIcon from "@assets/svg/radioButtonOff";
import TrashIcon from "@assets/svg/trashIcon";


export default function ReportPage(props:any){
    const dimensions=useWindowDimensions();
    const [value, setValue] = useState();
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
                flexShrink:0,
                backgroundColor: "#FFFFFF"
            }]}>
                <View style={styles.header}>
                <Header title={"Reports"}/>
                    <View style={{paddingVertical: 13.5}}>
                        <View style={{paddingVertical: 10, marginHorizontal: 26,alignItems: "center", justifyContent: "center", borderRadius: 8, borderColor: "#D1D1D6", borderWidth: 1}}>
                            <UploadIcon></UploadIcon>
                            <View style={{flexDirection: "row"}}>
                                <Text weight={"600"} size={14} color={"#4E4D8F"}>Click to upload</Text><Text size={14} color={"#4E4D8F"}> or drag and drop</Text>
                            </View>
                            <Text size={14} color={"#4E4D8F"}>docx, pptx, xlsx, pdf or jpeg</Text>
                        </View>
                    </View>

                </View>
                <View style={{ marginHorizontal: 26, }}>

                        <View style={{paddingTop: 14, paddingBottom: 12, alignItems: "center", justifyContent: "space-between", flexDirection: "row", flex: 1}}>
                            <View style={{flex: 1, paddingRight:15}}>
                                <TextInput value={value}  onChangeText={text => {
                                    setValue(text)
                                }} placeholderTextColor={"#6E7191"} placeholder={"Search"} style={styles.search}/>
                                <View style={styles.searchIcon}>
                                    <SearchIcon/>
                                </View>
                            </View>
                            <View>
                                <FilterPressIcon  pressed={false} width={fontValue(32)} height={fontValue(32)}/>
                            </View>
                            <View>
                                <RefreshWeb style={{paddingLeft:15}} width={fontValue(26)}
                                            height={fontValue(24)} fill={"#fff"}/>
                            </View>
                        </View>




                </View>
                <View style={{paddingTop: 10, paddingBottom: 10,   backgroundColor: "#F8F9FD", borderColor: "#D1D1D6", borderTopWidth: 1, }}>
                    <View  style={{ marginHorizontal: 26, flexDirection: "row", justifyContent: "space-between", alignItems: "center"  }} >
                        <RadioButtonOffIcon width={ fontValue(32) }
                                            height={ fontValue(32) }/>
                        <Text weight={"400"} size={14}>File name</Text>
                        <Text weight={"400"} size={14}>Date uploaded</Text>
                        <Text weight={"400"} size={14}>Uploaded by</Text>
                        <View style={{width: 24}}/>
                    </View>

                </View>
                <View style={{borderColor: "#D1D1D6",borderBottomWidth: 1, }}>
                    <View style={{paddingTop: 10, paddingBottom: 10,    borderColor: "#D1D1D6",borderTopWidth: 1, }}>
                        <View  style={{ marginHorizontal: 26, flexDirection: "row", justifyContent: "space-between", alignItems: "center"  }} >
                            <RadioButtonOffIcon width={ fontValue(32) }
                                                height={ fontValue(32) }/>
                            <View>
                                <Text weight={"600"} size={14}>File name</Text>
                                <Text weight={"400"} size={14}>100 KB</Text>
                            </View>

                            <Text weight={"400"} size={14}>Date uploaded</Text>
                            <Text weight={"400"} size={14}>Uploaded by</Text>
                            <TrashIcon/>
                        </View>

                    </View>

                </View>

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