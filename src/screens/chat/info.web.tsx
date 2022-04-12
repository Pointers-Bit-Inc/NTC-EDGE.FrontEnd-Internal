import React,{useRef,useState} from "react";
import {Alert,Dimensions,SafeAreaView,ScrollView,StyleSheet,TouchableOpacity,View} from "react-native";
import CloseIcon from "@assets/svg/close";
import Text from '@components/atoms/text'
import {Bold,Regular,Regular500} from "@styles/font";
import CreateChatIcon from "@assets/svg/createChat";
import {fontValue} from "@pages/activities/fontValue";
import OptionIcon from "@assets/svg/optionIcon";
import {getChannelName} from "../../utils/formatting";
import {removeSelectedMessage,setMessages,updateChannel} from "../../reducers/channel/actions";
import {InputField} from "@molecules/form-fields";
import {RootStateOrAny,useDispatch,useSelector} from "react-redux";
import useSignalr from "../../hooks/useSignalr";
import useApi from "../../services/api";
import IParticipants from "../../interfaces/IParticipants";
import {BottomModalRef} from "@atoms/modal/bottom-modal";
import lodash from 'lodash';
import {ContactItem} from "@molecules/list-item";
import {NewPenIcon,ToggleIcon} from "@atoms/icon";
import AddParticipants from "@pages/chat-modal/add-participants";
import {text} from "@styles/color";
import {Hoverable} from "react-native-web-hooks";
import DotHorizontalIcon from "@assets/svg/dotHorizontal";
import {Menu,MenuOption,MenuOptions,MenuProvider,MenuTrigger} from "react-native-popup-menu";
import MoreCircle from "@assets/svg/moreCircle";
import UnseeIcon from "@assets/svg/unsee";
import PinToTopIcon from "@assets/svg/pintotop";
import BellMuteIcon from "@assets/svg/bellMute";
import ArchiveIcon from "@assets/svg/archive";
import DeleteIcon from "@assets/svg/delete";

const {height,width}=Dimensions.get('window');

const styles=StyleSheet.create({
    safeAreaView:{
        flex:0.9,

        backgroundColor:"#fff"
    },

    container:{
        margin:12,
        flex:1
    },
    header:{

        gap:10,
        justifyContent:"space-between",
        flexDirection:"row",
        alignItems:"center",
        borderBottomWidth:2,
        borderBottomColor:"#efefef",
        paddingVertical:20,
        paddingHorizontal:20
    },
    headerText:{
        width:"90%",
        fontSize:14,
        color:"#1F2022",
        textAlign:"center",
        fontWeight:"bold",
        fontFamily:Bold
    },
    text:{
        fontFamily:Regular,fontSize:15,fontWeight:'400',lineHeight:22.5
    },
    muteChatContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'white',
    },
    groupName:{
        height:undefined,
        borderWidth:1,
        borderColor:'white',
        marginBottom:-25,
        marginTop:-5,
        paddingHorizontal:0
    },
    menuItemText : {
        fontSize : 14 ,
        paddingVertical : 3 ,
        paddingHorizontal : 10 ,
    } ,
    menuItem : {
        flexDirection : "row" ,
        paddingHorizontal : 10 ,
        alignItems : "center"
    } ,
    toggleDefault: {
        transform: [{ scaleX: -1 }],
        color: '#A0A3BD',
    },
    toggleActive: {
        color: '#610BEF',
    },
});
export const InfoWeb=(props)=>{
    const dispatch=useDispatch();
    const {
        leaveChannel,
    }=useSignalr();
    const user=useSelector((state:RootStateOrAny)=>state.user);
    const api=useApi(user.sessionToken);
    const {_id,otherParticipants=[],participants=[],hasRoomName=false,name='',isGroup=false,muted=false}=useSelector(
        (state:RootStateOrAny)=>{
            const {selectedChannel}=state.channel;
            selectedChannel.otherParticipants=lodash.reject(selectedChannel.participants,(p:IParticipants)=>p._id===user._id);
            selectedChannel.muted= !!lodash.find(selectedChannel.participants,(p:IParticipants)=>p._id===user._id&&p.muted);
            return selectedChannel;
        }
    );
    const [isVideoEnable,setIsVideoEnable]=useState(false);
    const [muteChat,setMuteChat]=useState(muted);
    const [showDeleteOption,setShowDeleteOption]=useState(false);
    const [showAlert,setShowAlert]=useState(false);
    const [loading,setLoading]=useState(false);
    const [alertData,setAlertData]=useState({
        title:'',
        message:'',
        cancel:'',
        confirm:'',
        type:'',
    });
    const [selectedMoreCircle , setSelectedMoreCircle] = useState(false);
    const onMoreCircle = () => {

        setSelectedMoreCircle(value => !value)

    };
    const [selectedParticipant,setSelectedParticipant]=useState<any>({});
    const [groupName,setGroupName]=useState(name||'');
    const [editName,setEditName]=useState(false);
    const modalRef=useRef<BottomModalRef>(null);
    const participantModal=useRef<BottomModalRef>(null);
    const optionModalRef=useRef<BottomModalRef>(null);
    const newMessageModalRef=useRef<BottomModalRef>(null);
    const meetingModalRef=useRef<BottomModalRef>(null);
    const groupNameRef:any=useRef(null);
    const renderChannelName=()=>{
        return getChannelName({
            otherParticipants,
            hasRoomName,
            name,
            isGroup
        });
    };
    const muteChatRoom=(mute=false)=>{
        setShowAlert(false);
        setLoading(true);
        api.post(`/rooms/${_id}/mute-chat?muted=${mute}`)
        .then((res)=>{
            setLoading(false);
            setMuteChat(mute);
            if(res.data){
                dispatch(updateChannel(res.data));
            }
        })
        .catch(e=>{
            setLoading(false);
            Alert.alert('Alert',e?.message||'Something went wrong.')
        });
    };
    const clearChat=()=>{
        setShowAlert(false);
        setLoading(true);
        api.post(`/rooms/${_id}/clear-chat`)
        .then((res)=>{
            setLoading(false);
            if(res.data){
                dispatch(setMessages(res.data._id,{}));
                dispatch(removeSelectedMessage(res.data._id));
                dispatch(updateChannel(res.data));
            }
        })
        .catch(e=>{
            setLoading(false);
            Alert.alert('Alert',e?.message||'Something went wrong.')
        });
    };

    const onBack=()=>props.close();

    const onInitiateCall=(isVideoEnable=false)=>{
        setIsVideoEnable(isVideoEnable);
        modalRef.current?.open();
    };

    const onClearChat=()=>{
        setAlertData({
            title:'Clear Chat',
            message:'Are you sure you want to clear chat content?',
            cancel:'Cancel',
            confirm:'Yes',
            type:'clear',
        });
        setShowAlert(true);
    };
    const onDeleteChat=()=>{
        setAlertData({
            title:'Delete Chat',
            message:'Are you sure you want to permanently delete this conversation?',
            cancel:'Cancel',
            confirm:'Yes',
            type:'delete',
        });
        setShowAlert(true);
    };

    const addMembers=(addedMembers:any)=>{
        setShowAlert(false);
        setLoading(true);
        api.post(`/rooms/${_id}/add-members`,{
            participants:addedMembers
        })
        .then((res)=>{
            setLoading(false);
            if(res.data){
                dispatch(updateChannel(res.data));
            }
        })
        .catch(e=>{
            setLoading(false);
            Alert.alert('Alert',e?.message||'Something went wrong.')
        });
    };
    const editRoomName=()=>{
        if(!groupName){
            setEditName(n=>!n);
            return;
        }

        setShowAlert(false);
        setLoading(true);
        api.post(`/rooms/${_id}/edit-name?roomname=${groupName}`)
        .then((res)=>{
            setLoading(false);
            setEditName(n=>!n);
            if(res.data){
                dispatch(updateChannel(res.data));
            }
        })
        .catch(e=>{
            setLoading(false);
            Alert.alert('Alert',e?.message||'Something went wrong.')
        });
    };
    const renderParticipants=()=>{
        return participants.map((item:IParticipants)=>(
            <ContactItem
                key={item._id}
                style={{marginLeft:-15}}
                image={item?.profilePicture?.thumb}
                imageSize={30}
                textSize={16}
                data={item}
                name={item.name}
                isOnline={item.isOnline}
                contact={item.email||''}
                rightIcon={
                    item.isAdmin ? (
                        <Hoverable>
                            {isHovered=>(
                                <View style={{marginRight:-15}}>

                                    {
                                        isHovered ?
                                        <TouchableOpacity onPress={() => {}}>
                                            <DotHorizontalIcon/>
                                        </TouchableOpacity>
                                   :
                                     <Text
                                         color='#606A80'
                                         size={12}
                                     >
                                         Admin
                                     </Text>
                                    }

                                </View>

                            )}
                        </Hoverable>
                    ) : <Menu onClose={ () => {
                        setSelectedMoreCircle(false)
                    } } onSelect={ value => setSelectedMoreCircle(true) }>

                        <MenuTrigger onPress={ onMoreCircle } text={<DotHorizontalIcon/> }>

                        </MenuTrigger>

                        <MenuOptions optionsContainerStyle={ {
                            shadowColor : "rgba(0,0,0,1)",
                            borderRadius : 8 ,
                            shadowOffset : {
                                width : 0 ,
                                height : 0
                            } ,
                            elevation : 45 ,
                            shadowOpacity : 0.1 ,
                            shadowRadius : 15 ,
                        } }>
                            <MenuOption value={ "Unread" }>
                                <View style={ styles.menuItem }>
                                    <UnseeIcon color={ "#000" }/>
                                    <Text style={ styles.menuItemText }>Unread</Text>
                                </View>
                            </MenuOption>
                            <MenuOption value={ "Pin to top" }>
                                <View style={ styles.menuItem }>
                                    <PinToTopIcon width={ 16.67 } height={ 16.67 }/>
                                    <Text style={ styles.menuItemText }>Pin to top</Text>
                                </View>
                            </MenuOption>
                            <MenuOption value={ "Archive" }>
                                <View style={ styles.menuItem }>
                                    <BellMuteIcon width={ 16.67 } height={ 16.67 }/>
                                    <Text style={ styles.menuItemText }>Mute</Text>
                                </View>
                            </MenuOption>
                            <MenuOption
                                style={ { borderBottomWidth : 1 , borderBottomColor : "#E5E5E5" } }
                                value={ "Archive" }>
                                <View style={ styles.menuItem }>
                                    <ArchiveIcon width={ 16.67 } height={ 16.67 }/>
                                    <Text style={ styles.menuItemText }>Archive</Text>
                                </View>
                            </MenuOption>

                            <MenuOption value={ "Archive" }>
                                <View style={ styles.menuItem }>
                                    <DeleteIcon width={ 16.67 } height={ 16.67 }/>
                                    <Text
                                        style={ [styles.menuItemText , { color : "#CF0327" }] }>Delete</Text>
                                </View>
                            </MenuOption>
                        </MenuOptions>

                    </Menu>
                }
                onPress={()=>{
                    if(isGroup&&item._id!=user._id){
                        //showOption(item);
                    }
                }}
            />
        ))
    };
    const [onAddParticipant,setOnAddParticipant]=useState(false);
    return  <SafeAreaView style={styles.safeAreaView}>

            {!onAddParticipant&&<View style={styles.header}>
                <View>
                    <TouchableOpacity onPress={()=>props.close()}>
                        <CloseIcon/>
                    </TouchableOpacity>
                </View>

                <View style={{alignContent:'center',flex:1,paddingHorizontal:10}}>
                    {
                        editName ? (
                            <InputField
                                ref={groupNameRef}
                                placeholder={isGroup ? 'Group name' : 'Chat Name'}
                                containerStyle={styles.groupName}
                                placeholderTextColor={'#C4C4C4'}
                                inputStyle={[styles.inputText,{backgroundColor:'white'}]}
                                outlineStyle={[styles.outlineText,{backgroundColor:'white'}]}
                                value={groupName}
                                onChangeText={setGroupName}
                                returnKeyType={'done'}
                                clearable={false}
                                onBlur={()=>setEditName(false)}
                            />
                        ) : (
                            <View style={{alignItems:"center"}}>
                                <Text
                                    numberOfLines={1}
                                    style={styles.headerText}
                                    size={16}
                                >
                                    {renderChannelName()}
                                </Text>
                            </View>

                        )
                    }
                    {
                        isGroup&&(
                            <View style={{alignItems:"center"}}>
                                <Text
                                    style={styles.subtitle}
                                    color={'#606A80'}
                                    size={10}
                                >
                                    {`${lodash.size(participants)} participants`}
                                </Text>
                            </View>

                        )
                    }
                </View>
                {
                    editName ? (
                        <View>
                            <TouchableOpacity onPress={editRoomName}>
                                <Text
                                    color={text.info}
                                    size={14}
                                    style={{fontFamily:Regular500}}
                                >
                                    Save
                                </Text>
                            </TouchableOpacity>
                        </View>

                    ) : (
                        <View>
                            <TouchableOpacity onPress={()=>setEditName(n=>!n)}>
                                <View style={{paddingHorizontal:5,paddingTop:5}}>
                                    <NewPenIcon color={'#2863D6'}/>
                                </View>
                            </TouchableOpacity>
                        </View>

                    )
                }
            </View>}
        <MenuProvider>
            <ScrollView>

                {!onAddParticipant&&
                <View style={{gap:25,paddingVertical:20,paddingHorizontal:20}}>
                    <TouchableOpacity onPress={()=>setOnAddParticipant(true)}>
                        <View style={{flexDirection:"row",alignItems:"center"}}>

                            <CreateChatIcon
                                color={"#212121"}
                                height={fontValue(21)}
                                width={fontValue(22)}
                            /><View style={{paddingLeft:10}}>
                            <Text style={{fontFamily:Regular,fontSize:15,fontWeight:'400',lineHeight:22.5}}>
                                Add Participant
                            </Text>
                        </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.muteChatContainer}>
                        <Text size={14}>
                            Mute Chat
                        </Text>
                        <TouchableOpacity onPress={()=>muteChatRoom(!muteChat)}>
                            <ToggleIcon
                                style={muteChat ? styles.toggleActive : styles.toggleDefault}
                                size={(
                                    32)}
                            />
                        </TouchableOpacity>
                    </View>
                    {/*<View style={{paddingBottom:20,flexDirection:"row",alignItems:"center"}}>
                        <OptionIcon
                            color={"#212121"}
                            height={fontValue(21)}
                            width={fontValue(22)}
                        /><View style={{paddingLeft:10}}>
                        <Text style={styles.text}>
                            Meeting Options
                        </Text>
                    </View>
                    </View>*/}
                    <View>
                        {
                            (
                                isGroup||lodash.size(participants))&&(
                                <Text
                                    size={14}
                                >
                                    {`Participants (${lodash.size(participants)})`}
                                </Text>
                            )
                        }
                    </View>

                    <View>

                        {renderParticipants()}


                    </View>

                </View>
                }


                {onAddParticipant&&<AddParticipants
                    members={participants}
                    onClose={()=>setOnAddParticipant(false)}
                    onSubmit={(members:any)=>{
                        setOnAddParticipant(false);
                        setTimeout(()=>addMembers(members),300);
                    }}
                />}


            </ScrollView>
        </MenuProvider>

            <View>
                <View style={{borderTopWidth:1,borderTopColor:"#E5E5E5",alignItems:"center",padding:20}}>

                    <TouchableOpacity onPress={onClearChat}>
                        <View style={{marginVertical:10}}>
                            <Text
                                size={14}
                                color={'#CF0327'}
                            >
                                Clear Chat Content
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {
                        isGroup&&(
                            <TouchableOpacity onPress={onDeleteChat}>
                                <View style={{marginVertical:10}}>
                                    <Text
                                        size={14}
                                        color={'#CF0327'}
                                    >
                                        Leave and Delete
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )
                    }
                </View>
            </View>

        </SafeAreaView>


};


