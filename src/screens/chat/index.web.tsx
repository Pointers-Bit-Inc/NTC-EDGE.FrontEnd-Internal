import React,{useCallback,useEffect,useRef,useState} from 'react'
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    FlatList,
    InteractionManager,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native'
import {RootStateOrAny,useDispatch,useSelector} from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import {
    addChannel,
    addPendingMessage,
    addToChannelList,
    removeSelectedMessage,
    setChannelList,
    setMeetings,
    setSelectedChannel
} from 'src/reducers/channel/actions';
import {InputField,SearchField} from '@components/molecules/form-fields';
import {button,outline,primaryColor,text} from '@styles/color';
import useSignalr from 'src/hooks/useSignalr';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import {ArrowLeftIcon,CheckIcon,NewCallIcon,NewChatIcon,NewVideoIcon} from '@atoms/icon';
import {Bold,Regular} from "@styles/font";
import NewChat from '@components/pages/chat-modal/new';
import {fontValue} from "@pages/activities/fontValue";
import MeetIcon from "@assets/svg/meetIcon";
import {getChannelImage,getChannelName,getTimeDifference,getTimeString} from "../../utils/formatting";
import IMeetings from "../../interfaces/IMeetings";
import {
    removeActiveMeeting ,
    resetCurrentMeeting,
    setMeeting, 
    setOptions,
} from 'src/reducers/meeting/actions';
import {ChatItem,ListFooter,MeetingNotif} from "@molecules/list-item";
import Swipeable from "react-native-gesture-handler/Swipeable";
import NewDeleteIcon from "@atoms/icon/new-delete";
import List from "@screens/chat/chat-list";
import {RFValue} from "react-native-responsive-fontsize";
import useSignalR from "../../hooks/useSignalr";
import {useComponentLayout} from "../../hooks/useComponentLayout";
import {setChatLayout} from "../../reducers/layout/actions";
import {Hoverable} from "react-native-web-hooks";
import GroupImage from "@molecules/image/group";
import FileList from "@screens/chat/file-list";
//import FileList from '@components/organisms/chat/files';
import {isMobile} from "@pages/activities/isMobile";
import {ViewPaged} from 'react-scroll-paged-view'
import TabBar from 'react-underline-tabbar'
import CreateChatIcon from "@assets/svg/addParticipantOutline";
import {TabView} from "react-native-tab-view";
import AttachIcon from "@assets/svg/AttachIcon";
import EmojiIcon from "@assets/svg/EmojiIcon";
import GifIcon from "@assets/svg/GifIcon";
import SendIcon from "@assets/svg/SendIcon";
import useAttachmentPicker from "../../hooks/useAttachment";
import Modal from "react-native-modal";
import Info from "@screens/chat/info";
import {MenuProvider} from "react-native-popup-menu";

const profPic=require('@assets/newMessageProfilePicture.png');
const draftProfPic=require('@assets/draftNewMessageProfilePicture.png');
import hairlineWidth=StyleSheet.hairlineWidth;
import {MEET} from "../../reducers/activity/initialstate";
import {NoContent} from "@screens/meet/index.web";
import {configs} from "@typescript-eslint/eslint-plugin";
import { openUrl } from 'src/utils/web-actions';

const {width,height}=Dimensions.get('window');

const styles=StyleSheet.create({

    chatContainer:{
        zIndex:1,
        shadowColor:"rgba(0,0,0,0.1)",
        shadowOffset:{
            width:0,
            height:4
        },
        elevation:30,
        shadowOpacity:1,
        shadowRadius:10,

    },
    keyboardAvoiding:{

        paddingHorizontal:15,
        paddingVertical:10,
        paddingBottom:0,
        flexDirection:'row',
        alignItems:'center',
        borderTopColor:'#E5E5E5',
        borderTopWidth:1,
    },
    container:{
        flex:1,

        backgroundColor:'white',
    },
    header:{
        borderBottomWidth:hairlineWidth,
        borderBottomColor:"#EFEFEF"
    },
    headerContent:{
        justifyContent:"center",
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:"#fff",
        paddingTop:15,
        paddingHorizontal:26
    },
    titleContainer:{
        flex:1,
    },
    input:{
        fontSize:fontValue(14),
        fontFamily:Regular,
        color:'black',
        flex:1,
    },
    outline:{
        borderWidth:0,
        backgroundColor:'#EFF0F6',
        borderRadius:10,
    },
    icon:{
        paddingHorizontal:5,
        color:text.default,
        fontSize:fontValue(18),
    },

    separator:{
        height:StyleSheet.hairlineWidth,
        width:width-70,
        alignSelf:'flex-end',
        backgroundColor:outline.default,
    },
    horizontal:{

        flexDirection:'row',
        alignItems:'center',
    },
    shadow:{
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:2,
        },
        shadowOpacity:0.25,
        shadowRadius:3.84,
        elevation:5,
    },
    floating:{
        position:'absolute',
        bottom:60,
        right:20,
    },
    button:{
        height:65,
        width:65,
        borderRadius:65,
        backgroundColor:primaryColor,
        alignItems:'center',
        justifyContent:'center',
    },
    delete:{
        flexDirection:'row',
        alignItems:'center',
        padding:15,
    },
    bar:{
        height:15,
        width:35,
        borderRadius:4,
    },
    cancelText:{
        fontSize:fontValue(18),
        color:'#DC2626',
    },
    confirmText:{
        fontSize:fontValue(18),
        color:text.info,
    },
    title:{
        textAlign:'center',
        fontSize:fontValue(16),
        fontFamily:Regular,
        color:'#1F2022'
    },
    message:{
        textAlign:'center',
        fontSize:14,
        marginHorizontal:15,
        marginBottom:15,
    },
    content:{
        borderBottomColor:outline.default,
        borderBottomWidth:1,
    },
    headerNewChatIcon:{
        borderWidth:1,borderColor:"#E5E5E5",marginHorizontal:10,
        padding:11,

        borderRadius:100
    },
    plus:{
        backgroundColor:'#D1D1D6',
        borderRadius:RFValue(24),
        width:RFValue(24),
        height:RFValue(24),
        marginRight:10,
        justifyContent:'center',
        alignItems:'center',
    },
    info:{
        flex:1,
        paddingHorizontal:10,
        justifyContent:'center',
        paddingLeft:5,
    },
    sideMenuStyle:{
        justifyContent: "flex-end",
        maxWidth:350,
        width:width*0.432,
        position:'absolute',margin:0,top:0,right:0,bottom:0
    }
});

function Chat(props:{participants:any,newChat:boolean,user,navigation,onNewChat?:()=>any,onPress:()=>any,onBackdropPress:()=>void,onSubmit:(res:any)=>void}){

    const {
        getChatList,
        endMeeting,
        leaveMeeting,
    }=useSignalr();
    const swipeableRef:any=useRef({});
    const {selectedChannel}=useSelector((state:RootStateOrAny)=>state.channel);
    const dispatch=useDispatch();
    const meetingList=useSelector((state:RootStateOrAny)=>{
        const {normalizeActiveMeetings}=state.meeting;
        const meetingList=lodash.keys(normalizeActiveMeetings).map(m=>normalizeActiveMeetings[m]);
        return lodash.orderBy(meetingList,'updatedAt','desc');
    });
    const [searchText,setSearchText]=useState('');
    const [searchValue,setSearchValue]=useState('');
    const [loading,setLoading]=useState(false);
    const [sendRequest,setSendRequest]=useState(0);
    const [pageIndex,setPageIndex]=useState(1);
    const [fetching,setFetching]=useState(false);
    const [hasMore,setHasMore]=useState(false);
    const [hasError,setHasError]=useState(false);
    const [showAlert,setShowAlert]=useState(false);
    const [selectedItem,setSelectedItem]:any=useState({});

    const onJoin=(item:IMeetings)=>{
        openUrl(`/VideoCall?meetingId=${item._id}`);
    };
    const onClose=(item:IMeetings,leave=false)=>{
        if(leave && item.isGroup){
            dispatch(removeActiveMeeting(item._id));
            return leaveMeeting(item._id, 'busy');
        } else if(item.host._id===props.user._id || !item.isGroup){
            return endMeeting(item._id);
        } else{
            return dispatch(removeActiveMeeting(item._id));
        }
    };
    const channelList=useSelector((state:RootStateOrAny)=>{
        const {normalizedChannelList}=state.channel;
        const channelList=lodash.keys(normalizedChannelList).map(ch=>{
            const channel=normalizedChannelList[ch];
            channel.otherParticipants=lodash.reject(channel.participants,p=>p._id===props.user._id);
            if (channel.lastMessage) {
                channel.lastMessage.hasSeen= !!lodash.find(channel.lastMessage.seen || [],s=>s._id===props.user._id);
            }
            return channel;
        });
        return lodash.orderBy(channelList,'lastMessage.createdAt','desc');
    });
    const onRequestData=()=>setSendRequest(request=>request+1);
    const fetchMoreChat=(isPressed=false)=>{
        if((
            !hasMore||fetching||hasError||loading)&& !isPressed) return;
        setFetching(true);
        setHasError(false);
        const payload=searchValue ? {pageIndex,keyword:searchValue} : {pageIndex};

        getChatList(payload,(err:any,res:any)=>{
            if(res){
                if(res.list) dispatch(addToChannelList(res.list));
                setPageIndex(current=>current+1);
                setHasMore(res.hasMore);
            }
            if(err){
                console.log('ERR',err);
                setHasError(true);
            }
            setFetching(false);
        });
    };
    useEffect(()=>{
        setLoading(true);
        setPageIndex(1);
        setHasMore(false);
        setHasError(false);
        let unMount=false;
        const payload=searchValue ? {pageIndex:1,keyword:searchValue} : {pageIndex:1};

        getChatList(payload,(err:any,res:any)=>{
            if(!unMount){
                if(res){
                    dispatch(setChannelList(res.list));
                    setPageIndex(current=>current+1);
                    setHasMore(res.hasMore);
                }
                if(err){
                    console.log('ERR',err);
                }
                setLoading(false);
            }
        });

        return ()=>{
            unMount=true;
        }
    },[sendRequest,searchValue]);
    const emptyComponent=()=>(
        <View
            style={{
                justifyContent:'center',
                alignItems:'center',
                padding:30,
            }}>
            <Text
                color={text.default}
                size={14}
            >
                No chat found
            </Text>
        </View>
    );

    const renderRightActions=(progress,dragX,item)=>{
        const trans=dragX.interpolate({
            inputRange:[-50,100],
            outputRange:[10,100],
        });
        return (
            <TouchableOpacity onPress={()=>{
                setSelectedItem(item);
                setShowAlert(true)
            }}>
                <Animated.View
                    style={{
                        paddingHorizontal:15,
                        marginLeft:10,
                        backgroundColor:'#CF0327',
                        flex:1,
                        transform:[{translateX:trans}],
                        alignItems:'center',
                        justifyContent:'center',
                    }}>
                    <NewDeleteIcon
                        color={'white'}
                    />
                    <Text
                        color='white'
                        size={12}
                    >
                        Delete
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        );
    };
    const ListFooterComponent=()=>{
        return (
            <ListFooter
                hasError={hasError}
                fetching={fetching}
                loadingText="Loading more chat..."
                errorText="Unable to load chats"
                refreshText="Refresh"
                onRefresh={()=>fetchMoreChat(true)}
            />
        );
    };

    return <View style={styles.container}>
        <StatusBar barStyle={"light-content"}/>
        <View style={styles.header}>

            <View style={styles.headerContent}>

                <View style={styles.titleContainer}>
                    <Text
                        color={"#113196"}
                        size={20}
                        style={{fontFamily:Bold,marginBottom:Platform.OS==="ios" ? 0 : -5}}
                    >
                        Chat
                    </Text>
                </View>

                <View style={{width:25}}/>
                <Hoverable>
                    {isHovered=>(
                        <TouchableOpacity onPress={() => props.navigation.navigate(MEET)}>

                            <View
                                style={[styles.headerNewChatIcon,{backgroundColor:isHovered ? "#2863D6" : "#F0F0F0"}]}>
                                <MeetIcon
                                    hover={isHovered}
                                    width={fontValue(20)}
                                    height={fontValue(20)}
                                />
                            </View>

                        </TouchableOpacity>)}
                </Hoverable>
                <Hoverable>
                    {isHovered=>(
                        <TouchableOpacity onPress={()=>{
                            props.onNewChat()
                        }}>

                            <View
                                style={[styles.headerNewChatIcon,{backgroundColor:props.newChat ? "#2863D6" : isHovered ? "#2863D6" : "#F0F0F0"}]}>
                                <NewChatIcon
                                    color={!isMobile ? props.newChat ? "white" : isHovered ? "white" : "#606A80" : "white"}
                                    width={fontValue(20)}
                                    height={fontValue(20)}
                                />
                            </View>

                        </TouchableOpacity>
                    )}
                </Hoverable>
            </View>

            <View>

                {
                    !!lodash.size(meetingList)&&(
                        <FlatList
                            data={meetingList}
                            bounces={false}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={width}
                            decelerationRate={0}
                            keyExtractor={(item:any)=>item._id}
                            renderItem={({item})=>(
                                <MeetingNotif
                                    style={{
                                        ...Platform.select({
                                            native:{
                                                width:width
                                            },
                                            default:{
                                                width:466
                                            }
                                        })
                                    }}
                                    name={getChannelName({...item,otherParticipants:item?.participants})}
                                    time={item.createdAt}
                                    host={item.host}
                                    onJoin={()=>onJoin(item)}
                                    onClose={(leave:boolean)=>onClose(item,leave)}
                                    closeText={'Cancel'}
                                />
                            )}
                        />
                    )
                }
            </View>

            <SearchField
                containerStyle={{paddingHorizontal:20,paddingVertical:20,paddingBottom:10}}
                inputStyle={[InputStyles.text,styles.input]}
                iconStyle={styles.icon}
                placeholder="Search"
                placeholderTextColor="#6E7191"
                outlineStyle={[InputStyles.outlineStyle,styles.outline]}
                value={searchText}
                onChangeText={setSearchText}
                onChangeTextDebounce={setSearchValue}
                onSubmitEditing={(event:any)=>setSearchText(event.nativeEvent.text)}

            />
        </View>
        <View style={styles.shadow}/>
        {
            loading ? (
                <View style={{alignItems:'center',paddingTop:10}}>
                    <ActivityIndicator size={'small'} color={text.default}/>
                    <Text
                        style={{marginTop:10}}
                        size={14}
                        color={text.default}
                    >
                        Fetching chat...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={[
                        {
                            id:-1,
                            image:profPic,
                            name:"New Chat",
                            hasRoomName:true,
                            lastMessage:{hasSeen:true}
                        },
                        props.participants.filter(p=>p.firstName).map(p=>p.firstName).length&&{
                            id:-2,
                            image:draftProfPic,
                            name:props.participants.filter(p=>p.firstName).map(p=>p.firstName).toString(),
                            hasRoomName:true,
                            lastMessage:{message:"Draft",hasSeen:true}
                        },...channelList]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            tintColor={primaryColor} // ios
                            progressBackgroundColor={primaryColor} // android
                            colors={['white']} // android
                            refreshing={loading}
                            onRefresh={onRequestData}
                        />
                    }
                    renderItem={({item}:any)=>{
                        return item!=0&&<View style={(
                            !props.newChat&& !item._id)&&{display:"none"}}>
                            <Swipeable
                                ref={ref=>swipeableRef.current[item._id]=ref}
                                renderRightActions={(progress,dragX)=>renderRightActions(progress,dragX,item)}
                            >
                                <Hoverable>
                                    {isHovered=>(
                                        <View style={{
                                            backgroundColor:(
                                                                (
                                                                    item.id== -1||item.id== -2)&&item?._id==undefined&&item.name=="New Chat" ? "#D4D3FF" :
                                                                !props.newChat&&selectedChannel?._id===item?._id)&& !(
                                                isMobile) ? "#D4D3FF" : isHovered ? "#F0F0FF" : "#fff"
                                        }}>
                                            <ChatItem
                                                image={getChannelImage(item)}
                                                imageSize={50}
                                                textSize={18}
                                                name={getChannelName(item)}
                                                user={props.user}
                                                participants={item.otherParticipants}
                                                message={item?.lastMessage}
                                                isGroup={item.isGroup}
                                                seen={item?.lastMessage?.hasSeen}
                                                time={getTimeString(item?.lastMessage?.createdAt)}
                                                onPress={()=>{
                                                    if(selectedChannel._id!=item._id){
                                                        dispatch(setSelectedChannel(item));
                                                    }
                                                    dispatch(setMeetings([]));
                                                    props.onSubmit()

                                                    /*if (selectedMessage && selectedMessage.channelId !== item._id) {
                                                        dispatch(removeSelectedMessage());
                                                    }*/
                                                    //props.navigation.navigate('ViewChat', item)
                                                }}
                                            />
                                        </View>
                                    )}
                                </Hoverable>
                            </Swipeable>
                        </View>
                    }}
                    keyExtractor={(item:any)=>item._id}
                    ListEmptyComponent={emptyComponent}
                    ListFooterComponent={ListFooterComponent}
                    onEndReached={()=>fetchMoreChat()}
                    onEndReachedThreshold={0.5}
                />


            )
        }

        <AwesomeAlert
            overlayStyle={{flex:1}}
            showProgress={false}
            contentContainerStyle={{borderRadius:15,maxWidth:width*0.7}}
            titleStyle={styles.title}
            message={"Are you sure you want to permanently delete this conversation?"}
            messageStyle={styles.title}
            contentStyle={styles.content}
            closeOnTouchOutside={false}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelButtonColor={"white"}
            confirmButtonColor={"white"}
            cancelButtonTextStyle={styles.cancelText}
            confirmButtonTextStyle={styles.confirmText}
            actionContainerStyle={{justifyContent:"space-around"}}
            cancelText="Cancel"
            confirmText="Yes"

        />
    </View>;
}

const ChatList=({navigation}:any)=>{


    const [index,setIndex]=React.useState(0);
    const [routes]=React.useState([
        {key:'list',title:'Chat'},
        {key:'fileList',title:'Files'},
    ]);
    const initialLayout={width:Dimensions.get('window').width};
    const dimensions=useWindowDimensions();
    const dispatch=useDispatch();
    const {
        sendMessage,
        editMessage,
        endMeeting,
        leaveMeeting,
    }=useSignalR();
    const layout=useWindowDimensions();
    const onClose=(item:IMeetings,leave=false)=>{
        if(leave && item.isGroup){
            dispatch(removeActiveMeeting(item._id));
            return leaveMeeting(item._id, 'busy');
        } else if(item.host._id===user._id || !item.isGroup){
            return endMeeting(item._id);
        } else{
            return dispatch(removeActiveMeeting(item._id));
        }
    };
    const user=useSelector((state:RootStateOrAny)=>state.user);
    const inputRef:any=useRef(null);
    const [inputText,setInputText]=useState('');
    const [isFocused,setIsFocused]=useState(false);
    const [rendered,setRendered]=useState(false);
    const [showLayout,setShowLayout]=useState(false);
    const [onNewChat,setOnNewChat]=useState(false);
    const [isSideMenuVisible,setIsSideMenuVisible]=useState(false);
    const toggleSideMenu=()=>setIsSideMenuVisible((isSideMenuVisible)=>!isSideMenuVisible);

    const {_id,otherParticipants , participants, isGroup,hasRoomName,name,}=useSelector(
        (state:RootStateOrAny)=>{
            const {selectedChannel}=state.channel;
            selectedChannel.otherParticipants=lodash.reject(selectedChannel.participants,p=>p._id===user._id);
            return selectedChannel;
        }
    );

    const meetingList=useSelector((state:RootStateOrAny)=>{
        const {normalizeActiveMeetings}=state.meeting;
        let meetingList=lodash.keys(normalizeActiveMeetings).map(m=>normalizeActiveMeetings[m]);
        meetingList=lodash.filter(meetingList,m=>m.roomId===_id);
        return lodash.orderBy(meetingList,'updatedAt','desc');
    });

    const onJoin=(item:IMeetings)=>{
        openUrl(`/VideoCall?meetingId=${item._id}`);
    };

    const onVideoCall = (isVoiceCall:boolean) => {
        openUrl(`/VideoCall?roomId=${_id}&isVoiceCall=${isVoiceCall}`);
    }

    const _editMessage=(messageId:string,message:string)=>{
        editMessage({
            messageId,
            message,
        },(err:any,result:any)=>{
            if(err){
                console.log('ERR',err);
            }
        })
    };
    const channelId=_id;
    const selectedMessage=useSelector((state:RootStateOrAny)=>{
        const {selectedMessage}=state.channel;
        return selectedMessage[channelId];
    });
    const onSendMessage=useCallback(()=>{
        if(!inputText){
            return;
        }

        if(selectedMessage?._id){
            _editMessage(selectedMessage?._id,inputText);
            inputRef.current?.blur();
            dispatch(removeSelectedMessage(channelId))
        } else{
            _sendMessage(channelId,inputText);
            inputRef.current?.blur();
            setInputText('');
        }
    },[channelId,inputText]);

    const _sendMessage=(channelId:string,inputText:string)=>{
        dispatch(addPendingMessage({
            channelId:channelId,
            message:inputText,
            messageType:'text',
        }));
    };

    useEffect(()=>{
        InteractionManager.runAfterInteractions(()=>{
            setRendered(true);
        });

        return ()=>{
            dispatch(setSelectedChannel({}));
        }
    },[]);

    useEffect(()=>{
        if(rendered){
            setInputText(selectedMessage?.message||'');
            if(selectedMessage?._id){
                setTimeout(()=>inputRef.current?.focus(),500);
            } else{
                inputRef.current?.blur();
            }
        }
    },[selectedMessage,rendered,_id]);

    const [chatSize,onChatLayout]=useComponentLayout();
    useEffect(()=>{
        dispatch(setChatLayout(chatSize))
    },[chatSize]);
    const [activeTab,setActiveTab]=useState(0);
    const [activeRoute,setActiveRoute]=useState("list");
    const renderScene=({route,jumpTo})=>{
        const sceneIndex=index==0 ? "list" : "fileList";
        if(route.key!=activeRoute&&sceneIndex){
            jumpTo(activeRoute)
        }

        switch(route.key){
            case 'list':
                return <List/>;
            case 'fileList':
                return <FileList/>;
            default:
                return null;
        }


    };
    const {
        selectedFile,
        pickImage,
        pickDocument,
    }=useAttachmentPicker();

    const _sendFile=(channelId:string,attachment:any,groupName='',participants:any=[])=>{
        dispatch(addPendingMessage({
            attachment,
            channelId,
            groupName,
            participants,
            messageType:'file'
        }));
    };
    useEffect(()=>{
        if(lodash.size(selectedFile)){
            _sendFile(
                channelId,
                selectedFile,
                name||"",
                participants
            )
        }
    },[selectedFile]);
    const [participant,setParticipant]:any=useState([]);
    return (
        <View style={{flexDirection:"row",flex:1}}>
            <View style={[styles.chatContainer,{
                flexBasis:(
                              isMobile||dimensions?.width<768) ? "100%" : 466,
                flexGrow:0,
                flexShrink:0
            }]}>
              
                <Chat
                    participants={participant}
                    newChat={onNewChat}
                    user={user}
                    navigation={navigation}
                    onNewChat={()=>{
                        setOnNewChat(true)
                    }}
                    onPress={()=>navigation.navigate('Settings')}
                    onBackdropPress={()=>{

                    }}
                    onSubmit={(res:any)=>{
                        setParticipant([]);
                        setOnNewChat(false);
                        setShowLayout(true)
                    }}/>
            </View>
            <View onLayout={onChatLayout} style={{backgroundColor:"#F8F8F8",flex:1,}}>

                {onNewChat ?

                 <NewChat
                     participants={participant}
                     setParticipants={(event)=>setParticipant(event)}
                     onClose={()=>{
                         setOnNewChat(false)
                     }}

                     onSubmit={(res:any)=>{

                         res.otherParticipants=lodash.reject(res.participants,p=>p._id===user._id);

                         dispatch(setSelectedChannel(res));
                         dispatch(addChannel(res));

                         setOnNewChat(false);
                         setShowLayout(true);
                         setParticipant([])
                         //setTimeout(() => props.navigation.navigate('ViewChat', res), 300);
                     }}
                 />
                           :
                 !(
                     _id&&showLayout&& !onNewChat)&&<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                         <View>
                            <NoContent/>
                         </View>

                         <Text style={{color:"#A0A3BD",paddingVertical:30,fontSize:24,fontFamily:Regular,fontWeight:"400"}}>No
                             conversations yet</Text>
                     </View>}
                {_id&&showLayout&& !onNewChat&&<View style={[styles.header,styles.horizontal]}>
                    <ViewPaged

                        isMovingRender
                        render
                        vertical={false}
                        renderPosition='top'
                        renderHeader={(params)=>{

                            setActiveTab(params.activeTab);
                            if(params.activeTab==0){
                                setActiveRoute("list");
                                params.goToPage(0);
                            } else if(params.activeTab==1){
                                setActiveRoute("fileList");
                                params.goToPage(1);
                            }

                            function renderTab({isTabActive,onPress,onLayout,tab:{label}}){
                                return (
                                    <TouchableOpacity onPress={onPress}>
                                        <Hoverable>
                                            {isHovered=>(
                                                <View style={{
                                                    backgroundColor:isHovered ? "#DFE5F1" : undefined,
                                                    paddingVertical:20
                                                }}>
                                                    <Text style={{
                                                        color:isTabActive ? "#565961" : "#808196",
                                                        fontSize:20
                                                    }}>{label}</Text>
                                                </View>
                                            )}
                                        </Hoverable>
                                    </TouchableOpacity>
                                )
                            }

                            return (
                                <View style={{

                                    borderBottomWidth:hairlineWidth,
                                    borderBottomColor:"#d2d2d2",
                                    paddingHorizontal:25,
                                    flexDirection:"row",
                                    alignItems:"center",
                                    justifyContent:"center",
                                    backgroundColor:"#fff"
                                }}>
                                    <TouchableOpacity onPress={()=>{
                                        {
                                            dispatch(setSelectedChannel([]));

                                            dispatch(setMeetings([]));
                                            setShowLayout(false)
                                        }
                                    }}>
                                        <View style={{paddingRight:5}}>
                                            <ArrowLeftIcon
                                                type='chevron-left'
                                                color={'#111827'}
                                                size={fontValue(26)}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                    <View>
                                        <GroupImage
                                            participants={otherParticipants}
                                            size={isGroup ? 45 : 30}
                                            textSize={isGroup ? 24 : 16}
                                            inline={true}
                                        />
                                    </View>
                                    <View style={styles.info}>
                                        <Text
                                            family={Bold}
                                            color={'black'}
                                            size={20}
                                            numberOfLines={1}
                                        >
                                            {getChannelName({otherParticipants,isGroup,hasRoomName,name})}
                                        </Text>
                                        {
                                            !isGroup&& !!otherParticipants[0]?.lastOnline&&(
                                                <Text
                                                    color={'#606A80'}
                                                    size={10}
                                                    numberOfLines={1}
                                                    style={{marginTop:-5}}
                                                >
                                                    {otherParticipants[0]?.isOnline ? 'Active now' : getTimeDifference(otherParticipants[0]?.lastOnline)}
                                                </Text>
                                            )
                                        }
                                    </View>
                                    <View style={{flexDirection:"row"}}>
                                        <View style={{paddingRight:85}}>
                                            <TabBar
                                                style={{
                                                    borderBottomWidth:0,
                                                    borderBottomColor:"transparent",
                                                    width:"100%"
                                                }}
                                                renderTab={renderTab}
                                                scrollViewStyle={{
                                                    paddingLeft:60,
                                                    flex:1,
                                                    justifyContent:"flex-start",
                                                    gap:35
                                                }}
                                                underlineStyle={{
                                                    backgroundColor:"#2863D6",
                                                    paddingHorizontal:20,
                                                    height:4
                                                }}
                                                tabs={[{label:"Chat"},{label:'Files'}]}
                                                {...params}
                                                vertical={false}
                                            />
                                        </View>

                                        <View style={{flexDirection:"row",alignItems:"center"}}>
                                            <View style={{flexDirection:"row",paddingRight:42}}>
                                                <TouchableOpacity onPress={()=>{
                                                    onVideoCall(false);
                                                }}>
                                                    <View style={{paddingRight:24}}>
                                                        <NewCallIcon
                                                            color={button.info}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={()=>{
                                                    onVideoCall(false);
                                                }}>
                                                    <View>
                                                        <NewVideoIcon
                                                            color={button.info}
                                                            height={28}
                                                            width={28}
                                                        />
                                                    </View>

                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity onPress={()=>{
                                                toggleSideMenu()
                                            }}>
                                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                                    <CreateChatIcon
                                                        color={"#565961"}
                                                        height={fontValue(21)}
                                                        width={fontValue(22)}
                                                    />
                                                    <View style={{paddingLeft:2 }}>
                                                        <Text style={{
                                                            color: "#565961",
                                                            fontSize:12,
                                                            fontFamily:Bold
                                                        }}>{participants.length}</Text>
                                                    </View>


                                                </View>

                                            </TouchableOpacity>
                                        </View>

                                    </View>


                                </View>

                            )
                        }}
                    >

                        <></>
                        <></>
                    </ViewPaged>


                </View>}

                {_id&&showLayout&& !onNewChat&&<TabView
                    swipeEnabled={false}
                    renderTabBar={()=><></>}
                    navigationState={{index,routes}}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={initialLayout}
                    style={[styles.container,{backgroundColor:"#f8f8f8"}]}
                />}
                {_id&&showLayout&& !onNewChat&&<View>
                    {
                        !!lodash.size(meetingList)&&(
                            <FlatList
                                data={meetingList}
                                bounces={false}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={width}
                                decelerationRate={0}
                                keyExtractor={(item:any)=>item._id}
                                renderItem={({item})=>(
                                    <MeetingNotif
                                        style={{
                                            ...Platform.select({
                                                native:{
                                                    width:width
                                                },
                                                default:{
                                                    width:"100%"
                                                }
                                            })
                                        }}
                                        name={getChannelName({...item,otherParticipants:item?.participants})}
                                        host={item.host}
                                        time={item.createdAt}
                                        onJoin={()=>onJoin(item)}
                                        onClose={(leave:boolean)=>onClose(item, leave)}
                                        closeText={'Cancel'}
                                    />
                                )}
                            />
                        )
                    }
                </View>}

                {_id&&showLayout&& !onNewChat&&activeTab==0&&<View style={[{
                    borderTopWidth:2,
                    paddingHorizontal:32,
                    paddingTop:42,
                    borderTopColor:"#efefef",
                    backgroundColor:"#f8f8f8"
                }]}>


                    <InputField
                        ref={inputRef}
                        placeholder={'Type a message'}
                        placeholderTextColor={'#C4C4C4'}
                        containerStyle={{backgroundColor:"white",}}
                        value={inputText}
                        onChangeText={setInputText}
                        onSubmitEditing={()=>inputText&&onSendMessage()}
                        returnKeyType={'send'}
                        onFocus={()=>setIsFocused(true)}
                        onBlur={()=>setIsFocused(false)}

                    />

                    <View style={{flexDirection:"row",justifyContent:"space-between",paddingBottom:40}}>
                        <View style={{gap:25,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                            <TouchableOpacity onPress={pickDocument}>
                                <AttachIcon/>
                            </TouchableOpacity>
                            <EmojiIcon/>
                            <TouchableOpacity onPress={pickImage}>
                                <GifIcon/>
                            </TouchableOpacity>

                        </View>
                        <TouchableOpacity
                            disabled={!inputText}
                            onPress={onSendMessage}
                        >
                            {
                                selectedMessage?._id ? (
                                    <View
                                        style={[styles.plus,{marginRight:0,marginLeft:10,backgroundColor:button.info}]}>
                                        <CheckIcon
                                            type='check1'
                                            size={14}
                                            color={'white'}
                                        />
                                    </View>
                                ) : (
                                    <View style={{marginLeft:10}}>
                                        <SendIcon/>
                                    </View>
                                )
                            }

                        </TouchableOpacity>
                    </View>
                </View>
                }


            </View>
            <Modal
                backdropOpacity={0}
                isVisible={isSideMenuVisible}
                onBackdropPress={toggleSideMenu} // Android back press
                onSwipeComplete={toggleSideMenu} // Swipe to discard
                animationIn="slideInRight" // Has others, we want slide in from the left
                animationOut="slideOutRight" // When discarding the drawer
                swipeDirection="right" // Discard the drawer with swipe to left
                useNativeDriver // Faster animation
                hideModalContentWhileAnimating // Better performance, try with/without
                propagateSwipe // Allows swipe events to propagate to children components (eg a ScrollView inside a modal)
                style={styles.sideMenuStyle} // Needs to contain the width, 75% of screen width in our case
            >
                <MenuProvider style={{flex: 1, justifyContent: "flex-end"}}>
                <Info otherParticipants={participants} close={toggleSideMenu}/>
            </MenuProvider>

            </Modal>
        </View>


    )
};

export default ChatList
