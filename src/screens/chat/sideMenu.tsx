import React from "react";
import {FlatList,RefreshControl,SafeAreaView,StyleSheet,Text,TouchableOpacity,View} from "react-native";
import CloseIcon from "@assets/svg/close";
import {Bold,Regular} from "@styles/font";
import AddParticipantsIcon from "@atoms/icon/new-add-participants";
import CreateChatIcon from "@assets/svg/createChat";
import {button,primaryColor} from "@styles/color";
import {fontValue} from "@pages/activities/fontValue";
import OptionIcon from "@assets/svg/optionIcon";
import {ChatItem} from "@molecules/list-item";
import {getChannelImage,getChannelName,getTimeString} from "../../utils/formatting";
import {setMeetings,setSelectedChannel} from "../../reducers/channel/actions";
import Swipeable from "react-native-gesture-handler/Swipeable";
import {Hoverable} from "react-native-web-hooks";
import {isMobile} from "@pages/activities/isMobile";
import ProfileImage from "@atoms/image/profile";

const styles=StyleSheet.create({
    safeAreaView:{
        flex:1,
        top:65,
        backgroundColor:"#fff"
    },

    container:{
        margin:12,
        flex:1
    },
    header:{
        justifyContent:"space-around",
        flexDirection:"row",
        borderBottomWidth:2,
        borderBottomColor:"#efefef",
        paddingVertical:20
    },
    headerText:{
        fontSize:14,
        color:"#1F2022",
        textAlign:"center",
        fontWeight:"bold",
        fontFamily:Bold
    },
    text: {
        fontFamily: Regular, fontSize: 15, fontWeight: '400', lineHeight:22.5
    }
});

export default class SideMenu extends React.Component{
    state={
        toggle_option_one:false
    };


    render(){
        return (
            <SafeAreaView style={styles.safeAreaView}>

                <View style={styles.header}>
                    <TouchableOpacity onPress={()=>this.props.close()}>
                        <CloseIcon/>
                    </TouchableOpacity>

                    <Text style={styles.headerText}>Meeting Participant</Text>
                    <View/>
                </View>
                <View style={{gap: 25,paddingVertical: 20, paddingHorizontal: 20}}>
                     <View style={{flexDirection:  "row", alignItems: "center"}}>
                         <CreateChatIcon
                             color={"#212121"}
                             height={fontValue(21)}
                             width={fontValue(22)}
                         /><View style={{paddingLeft: 10}}>
                         <Text style={{ fontFamily: Regular, fontSize: 15, fontWeight: '400', lineHeight:22.5}}>
                             Add Participant
                         </Text>
                     </View>

                     </View>
                    <View style={{paddingBottom: 20, flexDirection:  "row", alignItems: "center"}}>
                        <OptionIcon
                            color={"#212121"}
                            height={fontValue(21)}
                            width={fontValue(22)}
                        /><View style={{paddingLeft: 10}}>
                        <Text style={styles.text}>
                            Meeting Options
                        </Text>
                    </View>
                    </View>
                    <View>
                        <Text style={styles.text}>{`Participant (${this?.props?.otherParticipants.length})`}</Text>
                    </View>
                    <View>

                        <FlatList
                            data={this?.props?.otherParticipants}
                            showsVerticalScrollIndicator={false}

                            renderItem={({item}:any)=>{
                                return <View style={{flexDirection: "row", paddingBottom: 10}}>
                                    <ProfileImage
                                        image={item?.profilePicture?.small}
                                        name={item.name}
                                        size={40}
                                        textSize={40}
                                        isOnline={item?.isOnline}
                                    />
                                    <View>
                                        <Text style={styles.text}>{item?.name}</Text>
                                    </View>
                                </View>


                            }}
                            keyExtractor={(item:any)=>item._id}
                            onEndReachedThreshold={0.5}
                        />
                    </View>
                </View>

            </SafeAreaView>
        );
    }
}

