import {styles} from "@pages/activities/styles";
import {isMobile} from "@pages/activities/isMobile";
import {
    Platform,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View,
    StyleSheet,
    ScrollView,
    Image,
    FlatList
} from "react-native";
import Text from "@atoms/text"
import {isLandscapeSync,isTablet} from "react-native-device-info";
import NoActivity from "@assets/svg/noActivity";
import {fontValue} from "@pages/activities/fontValue";
import React,{useState} from "react";
import Header from "@molecules/header";
import UploadIcon from "@assets/svg/uploadReport";
import SearchIcon from "@assets/svg/search";
import FilterPressIcon from "@assets/svg/filterPress";
import RefreshWeb from "@assets/svg/refreshWeb";
import RadioButtonOffIcon from "@assets/svg/radioButtonOff";
import TrashIcon from "@assets/svg/trashIcon";
import * as ImagePicker from "expo-image-picker";
import {BASE_URL_NODE} from "../../../services/config";
import {errorColor,successColor,warningColor} from "@styles/color";
import {setUser} from "../../../reducers/user/actions";
import _ from "lodash";
import {DownloadIcon} from "@atoms/icon";

 const style = StyleSheet.create({
     header: {borderBottomWidth: 1, borderBottomColor: "#D1D1D6", backgroundColor: "#fff", alignItems: "center", paddingHorizontal: 61, paddingVertical: 15, justifyContent: "space-between", flexDirection: "row" }
 })
export default function ReportPage(props:any){

    const dimensions=useWindowDimensions();
    const [value,setValue]=useState();
    const [alert,setAlert]=useState();
    const [showAlert,setShowAlert]=useState();
    const [base64Value,setBase64Value]=useState();
    const [reports,setReports]=useState([]);

    const onPress=async(id?:number,type?:string|number)=>{

        let picker=await ImagePicker.launchImageLibraryAsync({
            presentationStyle:0,

        });
        if(!picker.cancelled){
            
            let uri=picker?.uri;
            let split=uri?.split('/');
            let name=split?.[split?.length-1];
            let mimeType=name?.split('.')?.[1]||picker?.type;
            let _file={
                name,
                mimeType,
                uri,
            };
                let base64=_file?.uri;
                let mime=isMobile ? _file?.mimeType : base64?.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
                let mimeResult:any=null;
                if(mime&&mime.length){
                    mimeResult=isMobile ? mime : mime[1];
                }
                mimeType=isMobile ? mime : mimeResult?.split("/")?.[1];
                await fetch(base64)
                .then(res=>{

                    return res?.blob()
                })
                .then(blob=>{

                    const fd=new FormData();
                    const file=isMobile ? {
                        name:_file?.name,
                        type:'application/octet-stream',
                        uri:_file?.uri,
                    } : new File([blob],(
                        _file?.name+"."+mimeType||_file?.mimeType));

                       setBase64Value(uri)
                    setReports(oldArray => [...oldArray,_file])
                    fd.append('profilePicture',file,(
                        _file?.name+"."+mimeType||_file?.mimeType));

                }).catch((err:any)=>{

                    err=JSON.parse(JSON.stringify(err));
                    if(err?.status===413){
                        setAlert({
                            title:'File Too Large',
                            message:'File size must be lesser than 2 MB.',
                            color:warningColor
                        });
                    } else{
                        setAlert({
                            title:err?.title||'Failure',
                            message:err?.message||'Your profile was not edited.',
                            color:errorColor
                        });
                    }
                    setShowAlert(true);
                });


        }

    };

    const renderItem = ({item}) => {
        return  <TouchableOpacity onPress={()=> setBase64Value(item.uri)}>
                <View style={{paddingTop:10,paddingBottom:10,borderColor:"#D1D1D6",borderTopWidth:1,}}>
                    <View style={{
                        marginHorizontal:26,
                        flexDirection:"row",
                        justifyContent:"space-between",
                        alignItems:"center"
                    }}>
                        <RadioButtonOffIcon width={fontValue(32)}
                                            height={fontValue(32)}/>
                        <View>
                            <Text weight={"600"} size={14}>File name</Text>
                            <Text weight={"400"} size={14}>100 KB</Text>
                        </View>

                        <Text weight={"400"} size={14}>Date uploaded</Text>
                        <Text weight={"400"} size={14}>Uploaded by</Text>
                        <TrashIcon/>
                    </View>

                </View>
            </TouchableOpacity>



    }
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
                backgroundColor:"#FFFFFF"
            }]}>
                <View style={styles.header}>
                    <Header title={"Reports"}/>
                    <View style={{paddingVertical:13.5}}>
                        <TouchableOpacity onPress={onPress}>
                            <View style={{
                                paddingVertical:10,
                                marginHorizontal:26,
                                alignItems:"center",
                                justifyContent:"center",
                                borderRadius:8,
                                borderColor:"#D1D1D6",
                                borderWidth:1
                            }}>
                                <UploadIcon></UploadIcon>
                                <View style={{flexDirection:"row"}}>
                                    <Text weight={"600"} size={14} color={"#4E4D8F"}>Click to upload</Text><Text
                                    size={14} color={"#4E4D8F"}> or drag and drop</Text>
                                </View>
                                <Text size={14} color={"#4E4D8F"}>docx, pptx, xlsx, pdf or jpeg</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                </View>
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
                        <View>
                            <FilterPressIcon pressed={false} width={fontValue(32)} height={fontValue(32)}/>
                        </View>
                        <View>
                            <RefreshWeb style={{paddingLeft:15}} width={fontValue(26)}
                                        height={fontValue(24)} fill={"#fff"}/>
                        </View>
                    </View>


                </View>
                <View style={{
                    paddingTop:10,
                    paddingBottom:10,
                    backgroundColor:"#F8F9FD",
                    borderColor:"#D1D1D6",
                    borderTopWidth:1,
                }}>
                    <View style={{
                        marginHorizontal:26,
                        flexDirection:"row",
                        justifyContent:"space-between",
                        alignItems:"center"
                    }}>
                        <RadioButtonOffIcon width={fontValue(32)}
                                            height={fontValue(32)}/>
                        <Text weight={"400"} size={14}>File name</Text>
                        <Text weight={"400"} size={14}>Date uploaded</Text>
                        <Text weight={"400"} size={14}>Uploaded by</Text>
                        <View style={{width:24}}/>
                    </View>

                </View>
                <View style={{borderColor:"#D1D1D6",borderBottomWidth:1,}}>
                <FlatList
                    data={reports}
                    renderItem={renderItem}
                />
                </View>

            </View>
           {
                !(
                    (
                        isMobile&& !(
                            Platform?.isPad||isTablet())))&& _.isEmpty(base64Value)&&dimensions?.width>768&&
                <View style={[{flex:1,justifyContent:"center",alignItems:"center"}]}>

                    <NoActivity/>
                    <Text style={{color:"#A0A3BD",fontSize:fontValue(24)}}>No activity
                        selected</Text>


                </View>
            }

            {   !_.isEmpty(base64Value)&&
                <View style={[{flex:1}]}>
                    <View style={style.header}>
                        <Text size={24}>Preview</Text>
                        <View style={{flexDirection: "row"}}>
                            <View style={{paddingRight: 10}}>
                                <DownloadIcon color={"#111827"}/>
                            </View>


                            <Text size={14}>Download</Text>
                        </View>

                    </View>

                        <View style={{overflow: "scroll", flex: 1,  paddingHorizontal: 61, paddingVertical: 50, }}>
                            <View style={{shadowColor: "rgba(0,0,0,0.1)",
                                shadowOffset: {
                                    width: 0,
                                    height: 4
                                },
                                elevation: 30,
                                shadowOpacity: 1,
                                shadowRadius: 10,  backgroundColor: "#fff"}} >
                                {base64Value && <Image resizeMode={"center"}   source={{ uri: base64Value }} style={{ width: "100%", height: dimensions?.height }} />}

                            </View>
                        </View>




                </View>
            }



        </View>
    )
}