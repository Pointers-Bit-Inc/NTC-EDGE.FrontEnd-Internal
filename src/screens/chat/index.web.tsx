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
//import { useRequestCameraAndAudioPermission } from 'src/hooks/useAgora';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import {ArrowLeftIcon,CheckIcon,NewCallIcon,NewChatIcon,NewMessageIcon,NewVideoIcon,PlusIcon} from '@atoms/icon';
import {Bold,Regular} from "@styles/font";
import {BottomModalRef} from '@components/atoms/modal/bottom-modal';
import NewChat from '@pages/chat/new';
import {fontValue} from "@pages/activities/fontValue";
import MeetIcon from "@assets/svg/meetIcon";
import {getChannelImage,getChannelName,getTimeDifference,getTimeString} from "../../utils/formatting";
import IMeetings from "../../interfaces/IMeetings";
import {removeActiveMeeting,setMeeting} from "../../reducers/meeting/actions";
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
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import NoConversationIcon from "@assets/svg/noConversations";
import {isMobile} from "@pages/activities/isMobile";
import hairlineWidth=StyleSheet.hairlineWidth;

const {width,height}=Dimensions.get('window');

const styles=StyleSheet.create({
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
        backgroundColor:'white',
        borderBottomWidth:hairlineWidth,
        borderBottomColor:"#EFEFEF"
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
});

function Chat(props:{user,navigation,onNewChat?:()=>any,onPress:()=>any,onBackdropPress:()=>void,onSubmit:(res:any)=>void}){
    // useRequestCameraAndAudioPermission();

    const {
        getChatList,
        leaveChannel,
        endMeeting,
        leaveMeeting,
    }=useSignalr();
    const swipeableRef:any=useRef({});
    const {selectedChannel}=useSelector((state:RootStateOrAny)=>state.channel);
    const {chatLayout}=useSelector((state:RootStateOrAny)=>state.layout);

    const modalRef=useRef<BottomModalRef>(null);
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
        dispatch(setSelectedChannel(item.room));
        dispatch(setMeeting(item));
        props.navigation.navigate('Dial',{
            isHost:item.host._id===props.user._id,
            isVoiceCall:item.isVoiceCall,
            options:{
                isMute:false,
                isVideoEnable:true,
            }
        });
    };
    const onClose=(item:IMeetings,leave=false)=>{
        if(leave){
            dispatch(removeActiveMeeting(item._id));
            return leaveMeeting(item._id);
        } else if(item.host._id===props.user._id){
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
            channel.lastMessage.hasSeen= !!lodash.find(channel.lastMessage.seen,s=>s._id===props.user._id);
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
                        <TouchableOpacity>

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
                                style={[styles.headerNewChatIcon,{backgroundColor:isHovered ? "#2863D6" : "#F0F0F0"}]}>
                                <NewChatIcon
                                    hover={isHovered}
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
                                    style={{width}}
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
                <View style={{alignItems:'center'}}>
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
                    data={channelList}
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
                    renderItem={({item}:any)=>(
                        <Swipeable
                            ref={ref=>swipeableRef.current[item._id]=ref}
                            renderRightActions={(progress,dragX)=>renderRightActions(progress,dragX,item)}
                        >
                            <Hoverable>
                                {isHovered=>(
                                    <View style={{
                                        backgroundColor:(
                                                            selectedChannel?._id===item?._id)&& !(
                                            isMobile) ? "#D4D3FF" : isHovered ? "#EEF3F6" : "#fff"
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
                    )}
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

const Tab=createMaterialTopTabNavigator();

const ChatList=({navigation}:any)=>{
    const dimensions=useWindowDimensions();
    const dispatch=useDispatch();
    const {
        sendMessage,
        editMessage,
        endMeeting,
        leaveMeeting,
    }=useSignalR();
    const layout=useWindowDimensions();

    const user=useSelector((state:RootStateOrAny)=>state.user);
    const inputRef:any=useRef(null);
    const [inputText,setInputText]=useState('');
    const [isFocused,setIsFocused]=useState(false);
    const [rendered,setRendered]=useState(false);
    const [showLayout,setShowLayout]=useState(false);
    const [onNewChat,setOnNewChat]=useState(false);
    const {_id,otherParticipants,participants,isGroup,hasRoomName,name,}=useSelector(
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
        dispatch(setSelectedChannel(item.room));
        dispatch(setMeeting(item));
        navigation.navigate('Dial',{
            isHost:item.host._id===user._id,
            isVoiceCall:item.isVoiceCall,
            options:{
                isMute:false,
                isVideoEnable:true,
            }
        });
    };
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
    const {selectedMessage}=useSelector((state:RootStateOrAny)=>state.channel);
    const onSendMessage=useCallback(()=>{
        if(!inputText){
            return;
        }

        if(selectedMessage._id){
            _editMessage(selectedMessage._id,inputText);
            inputRef.current?.blur();
            dispatch(removeSelectedMessage())
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
            if(selectedMessage._id){
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
    return (
        <View style={{flexDirection:"row",flex:1}}>
            <View style={{
                zIndex:1,
                shadowColor:"rgba(0,0,0,0.1)",
                shadowOffset:{
                    width:0,
                    height:4
                },
                elevation:30,
                shadowOpacity:1,
                shadowRadius:10,
                flexBasis:(
                              isMobile||dimensions?.width<768) ? "100%" : 466,
                flexGrow:0,
                flexShrink:0
            }}>
                <Chat
                    user={user}
                    navigation={navigation}
                    onNewChat={()=>{
                        setOnNewChat(true)
                    }}
                    onPress={()=>navigation.navigate('Settings')}
                    onBackdropPress={()=>{

                    }}
                    onSubmit={(res:any)=>{
                        setShowLayout(true)
                    }}/>
            </View>
            <View onLayout={onChatLayout} style={{backgroundColor:"#F8F8F8",flex:1,}}>
                {onNewChat ?
                 <NewChat
                     onClose={()=>{
                         setOnNewChat(false)
                     }}
                     onSubmit={(res:any)=>{
                         res.otherParticipants=lodash.reject(res.participants,p=>p._id===user._id);

                         dispatch(setSelectedChannel(res));
                         dispatch(addChannel(res));

                         //setTimeout(() => props.navigation.navigate('ViewChat', res), 300);
                     }}
                 /> :
                 !(
                     _id&&showLayout)&&<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                         <View>
                             <NoConversationIcon/>
                         </View>

                         <Text style={{color:"#A0A3BD",paddingVertical:30,fontSize:24,fontFamily:Regular,fontWeight:"400"}}>No
                             conversations yet</Text>
                     </View>}
                {_id&&showLayout&&<View style={[styles.header,styles.horizontal]}>
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
                                size={RFValue(26)}
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
                            color={'black'}
                            size={16}
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
                    <TouchableOpacity onPress={()=>{
                    }}>
                        <View style={{paddingRight:5}}>
                            <NewCallIcon
                                color={button.info}
                                height={RFValue(24)}
                                width={RFValue(24)}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{
                    }}>
                        <View style={{paddingLeft:5,paddingTop:5}}>
                            <NewVideoIcon
                                color={button.info}
                                height={RFValue(28)}
                                width={RFValue(28)}
                            />
                        </View>
                    </TouchableOpacity>
                </View>}
                {_id&&showLayout&&<View>
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
                                        style={{width}}
                                        name={getChannelName({...item,otherParticipants:item?.participants})}
                                        host={item.host}
                                        time={item.createdAt}
                                        onJoin={()=>onJoin(item)}
                                        onClose={()=>onClose(item)}
                                        closeText={'Cancel'}
                                    />
                                )}
                            />
                        )
                    }
                </View>}
                {_id&&showLayout&&<Tab.Navigator screenOptions={({route})=>(
                    {
                        tabBarIndicatorContainerStyle:{borderBottomColor:'#DDDDDD',borderBottomWidth:1},
                        tabBarLabelStyle:{textTransform:'none'},
                        tabBarIndicatorStyle:{backgroundColor:outline.info,height:3},
                        tabBarStyle:{backgroundColor:'white'},
                        tabBarActiveTintColor:text.info,
                        tabBarLabel:({tintColor,focused,item})=>{
                            return focused
                                   ? (
                                       <Text
                                           style={{color:text.info,fontSize:14,fontWeight:'bold',}}>{route.name}</Text>)
                                   : (
                                       <Text style={{
                                           color:tintColor,
                                           fontSize:14,
                                           fontWeight:'normal'
                                       }}>{route.name}</Text>)
                        },
                    })}>
                    <Tab.Screen name="Chat" component={List}/>
                    <Tab.Screen name="Files" component={FileList}/>
                </Tab.Navigator>}
                {_id&&showLayout&&<View style={styles.keyboardAvoiding}>

                    <View style={{marginTop:fontValue(-18)}}>
                        <TouchableOpacity disabled={true}>
                            <View style={styles.plus}>
                                <PlusIcon
                                    color="white"
                                    size={fontValue(12)}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,paddingHorizontal:5}}>
                        <InputField
                            ref={inputRef}
                            placeholder={'Type a message'}
                            containerStyle={[styles.containerStyle,{borderColor:isFocused ? '#C1CADC' : 'white'}]}
                            placeholderTextColor={'#C4C4C4'}
                            inputStyle={[styles.input,{backgroundColor:'white'}]}
                            outlineStyle={[styles.outline,{backgroundColor:'white'}]}
                            value={inputText}
                            onChangeText={setInputText}
                            onSubmitEditing={()=>inputText&&onSendMessage()}
                            returnKeyType={'send'}
                            onFocus={()=>setIsFocused(true)}
                            onBlur={()=>setIsFocused(false)}

                        />
                    </View>
                    <View style={{marginTop:RFValue(-18),flexDirection:'row'}}>
                        <TouchableOpacity
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
                                        <NewMessageIcon
                                            color={inputText ? button.info : '#D1D1D6'}
                                            height={fontValue(30)}
                                            width={fontValue(30)}
                                        />
                                    </View>
                                )
                            }
                        </TouchableOpacity>
                    </View>
                </View>
                }


            </View>
        </View>


    )
};

export default ChatList
