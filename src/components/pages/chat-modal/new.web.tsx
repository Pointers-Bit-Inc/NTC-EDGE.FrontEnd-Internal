import React,{useEffect,useRef,useState} from 'react'
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    InteractionManager,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    TouchableOpacity,TouchableWithoutFeedback,
    View
} from 'react-native'
import lodash from 'lodash';
import {button,header,outline,primaryColor,text} from '@styles/color';
import Text from '@atoms/text';
import {ContactItem,ListFooter} from '@components/molecules/list-item';
import ChatView from "@components/pages/chat-modal/view"
import {ArrowDownIcon,ArrowRightIcon,NewGroupIcon,PlusIcon} from '@components/atoms/icon'
import {InputField,InputTags} from '@components/molecules/form-fields'
import {Bold,Regular,Regular500} from '@styles/font';
import useSignalr from 'src/hooks/useSignalr';
import {RootStateOrAny,useDispatch,useSelector} from 'react-redux';
import {setSelectedChannel} from 'src/reducers/channel/actions';
import AwesomeAlert from 'react-native-awesome-alerts';
import IParticipants from 'src/interfaces/IParticipants';
import EditIcon from "@assets/svg/editIcon";
import {isMobile} from "@pages/activities/isMobile";
import {fontValue} from "@pages/activities/fontValue";
import {useComponentLayout} from "../../../hooks/useComponentLayout";
import {Hoverable} from "react-native-web-hooks";
import CloseIcon from "@assets/svg/close";

const {width,height}=Dimensions.get('window');
const styles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#E5E5E5',
    },
    header:{
        zIndex:999,
        backgroundColor:'white'
    },
    horizontal:{
        flexDirection:'row',
        alignItems:'center',
    },
    titleContainer:{
        flex:1,
        paddingHorizontal:20,
        alignItems:'center',
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
        fontSize:fontValue(16),
        color:'#6E7191'
    },
    separator:{
        // height: StyleSheet.hairlineWidth,
        // width: width - 60,
        // alignSelf: 'flex-end',
        // backgroundColor: outline.default,
    },
    notSelected:{
        height:fontValue(20),
        width:fontValue(20),
        borderRadius:fontValue(20),
        borderWidth:1,
        borderColor:button.default,
        alignItems:'center',
        justifyContent:'center',
    },
    selected:{
        height:fontValue(20),
        width:fontValue(20),
        borderRadius:fontValue(20),
        borderWidth:1,
        borderColor:button.info,
        backgroundColor:button.info,
        alignItems:'center',
        justifyContent:'center',
    },
    contactTitle:{
        paddingHorizontal:15,
        flexDirection:'row',
        alignItems:'center',
    },
    outlineBorder:{
        paddingHorizontal:10,
        paddingBottom:10,
        borderBottomColor:'#E5E5E5',
        borderBottomWidth:1,
    },
    newGroupContainer:{
        flexDirection:'row',
        paddingHorizontal:15,
        paddingVertical:10,
        backgroundColor:'#EAEAF4',
        alignContent:'center',
        justifyContent:'space-between',
    },
    outlineText:{
        borderRadius:10,
    },
    inputText:{
        fontSize:fontValue(16),
        fontWeight: "400"
    },
    groupName:{
        borderWidth:1,
        borderColor:'white',
        backgroundColor:'white',

    },
    plus:{
        backgroundColor:button.info,
        borderRadius:fontValue(20),
        width:fontValue(20),
        height:fontValue(20),
        justifyContent:'center',
        alignItems:'center',
        marginLeft:5,
        paddingLeft:Platform.OS==='ios' ? 1 : 0,
        paddingTop:Platform.OS==='ios' ? 1 : 0,
    },
    cancelText:{
        fontSize:fontValue(16),
        color:text.info,
        fontFamily:Regular500,
    },
    confirmText:{
        fontSize:fontValue(16),
        color:text.error,
        fontFamily:Regular500,
    },
    title:{
        color:'#14142B',
        textAlign:'center',
        fontSize:fontValue(16),
        fontFamily:Regular500,
    },
    message:{
        color:'#4E4B66',
        textAlign:'center',
        fontSize:fontValue(14),
        marginHorizontal:15,
        marginBottom:15,
        fontFamily:Regular,
    },
    content:{
        borderBottomColor:outline.default,
        borderBottomWidth:1,
    },

});

const tagStyles=StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:'#D6D6D6',
    },
    container:{

        borderRadius:10,
        backgroundColor:'#FFFFFF',
        justifyContent:'flex-start',
    },
    tag:{
        borderRadius:10,
    },
    textTag:{
        color:header.default,
        fontFamily:Bold,
        fontSize:fontValue(14),
    },
    input:{
        backgroundColor:'#FFFFFF',
        color:header.default,
        fontSize:fontValue(14),
        fontFamily:Bold,
        paddingLeft:0,
        paddingRight:0,
        paddingTop:1,
        marginTop:Platform.OS==='ios'||Platform.OS==="web" ? 0 : -2
    },

});

const NewChat=({
                   participants,setParticipants,onClose=()=>{
    },onSubmit=()=>{
    }
               }:any)=>{
    const {
        getParticipantList,
        createChannel,
        getChannelByParticipants,
    }=useSignalr();
    const dispatch=useDispatch();
    const inputRef:any=useRef(null);
    const inputTagRef:any=useRef(null);
    const groupNameRef:any=useRef(null);
    const [loading,setLoading]=useState(false);
    const [nextLoading,setNextLoading]=useState(false);
    const [sendRequest,setSendRequest]=useState(0);
    const [contacts,setContacts]:any=useState([]);
    const [searchText,setSearchText]=useState('');
    const [searchValue,setSearchValue]=useState('');
    const [pageIndex,setPageIndex]=useState(1);
    const [fetching,setFetching]=useState(false);
    const [hasMore,setHasMore]=useState(false);
    const [hasError,setHasError]=useState(false);
    const [groupName,setGroupName]=useState('');
    const [isGroup,setIsGroup]=useState(false);
    const [isFocused,setIsFocused]=useState(false);
    const [showAlert,setShowAlert]=useState(false);
    const [inputTagsLayout,onLayoutInputTags]=useComponentLayout();
    const [formTagsLayout,onLayoutFormTags]=useComponentLayout();
    const {selectedChannel}=useSelector((state:RootStateOrAny)=>state.channel);
    const user=useSelector((state:RootStateOrAny)=>state.user);

    const onRequestData=()=>setSendRequest(request=>request+1);

    const fetchMoreParticipants=(isPressed=false)=>{
        if((
            !hasMore||fetching||hasError||loading)&& !isPressed) return;
        setFetching(true);
        setHasError(false);
        const payload=searchValue ? {pageIndex,keyword:searchValue} : {pageIndex};

        getParticipantList(payload,(err:any,res:any)=>{
            if(res){
                setContacts([...contacts,...res.list]);
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
        let unmount=false;
        setLoading(true);
        setPageIndex(1);
        setHasMore(false);
        setHasError(false);
        const payload=searchValue ? {pageIndex:1,keyword:searchValue} : {pageIndex:1};

        if(!lodash.size(participants)||searchValue||isGroup||isFocused){
            InteractionManager.runAfterInteractions(()=>{
                getParticipantList(payload,(err:any,res:any)=>{
                    if(!unmount){
                        if(res){
                            let resultList=res.list;

                            if(resultList&&participants){
                                resultList=lodash.reject(resultList,r=>lodash.find(participants,p=>p._id===r._id));
                            }

                            setContacts(resultList);
                            setPageIndex(current=>current+1);
                            setHasMore(res.hasMore);
                        }
                        if(err){
                            console.log('ERR',err);
                        }
                        setLoading(false);
                    }
                });
            });
        } else{
            setLoading(false);
        }

        return ()=>{
            unmount=true;
        }
    },[sendRequest,searchValue,isGroup,participants,isFocused]);

    useEffect(()=>{
        let unmount=false;
        dispatch(setSelectedChannel({}));
        if(participants){
            getChannelByParticipants({participants},(err:any,res:any)=>{
                if(!unmount){
                    if(res){
                        dispatch(setSelectedChannel(res));
                    }
                    if(err){
                        console.log('ERROR',err);
                    }
                }
            });
        }

        return ()=>{
            unmount=true;
        }
    },[participants]);

    const onNext=(message:string,channelData=null)=>{
        if(channelData){
            onSubmit(channelData);
        } else{
            if(participants){
                setNextLoading(true);
                const formData=new FormData();
                formData.append('name',groupName);
                formData.append('message',message);
                formData.append('participants',JSON.stringify(participants));

                createChannel(formData,(err:any,res:any)=>{
                    setNextLoading(false);
                    if(res){
                        onSubmit(res);
                    }
                    if(err){
                        console.log('ERROR',err);
                    }
                });
            }
        }
    };

    const onBeforeClose=()=>{
        if(isGroup){
            setGroupName('');
            setIsGroup(false);
            setParticipants([]);
            inputRef.current?.focus();
        } else{
            if(lodash.size(participants)>1){
                setShowAlert(true);
            } else{
                onClose();
            }
        }
    };

    const onConfirmPressed=()=>{
        setShowAlert(false);
        onClose();
    };

    const onSelectParticipants=(selectedId:string)=>{
        const selected=lodash.find(contacts,c=>c._id===selectedId);
        setParticipants(p=>(
            [...p,selected]));

        inputTagRef?.current?.addTag(selected);
        inputTagRef?.current?.blur();
        setSearchValue('');
        setSelected(false)
    };

    const onRemoveParticipants=(selectedId:string)=>{
        const result=lodash.reject(participants,c=>c._id===selectedId);
        setParticipants(result);
    };
    const [selected,setSelected]=useState(true);
    const onTapCheck=(selectedId:string)=>{
        setSelected(true);
        const isSelected=checkIfSelected(selectedId);
        if(isSelected){
            onRemoveParticipants(selectedId);
        } else{
            onSelectParticipants(selectedId);
        }
    };

    const checkIfSelected=(contactId:string)=>{
        const selected=lodash.find(participants,c=>c._id===contactId);
        return !!selected;
    };

    const onChangeTags=(tags:any)=>{
        setParticipants(tags);
    };

    const renderTag=({tag,index,onPress,deleteTagOnPress,readonly}:any)=>{
        return (
            <TouchableOpacity
                key={`${tag?._id}-${index}`}
                onPress={onPress}
                style={tagStyles.tag}>
                <Text style={tagStyles.textTag}>{tag?.firstName},</Text>
            </TouchableOpacity>
        );
    };

    const headerComponent=()=>(
        <>

            <View style={[styles.contactTitle,!!lodash.size(participants)&&{paddingTop:15}]}>
                <ArrowDownIcon
                    style={{marginTop:2,marginRight:3}}
                    color={text.default}
                    size={24}
                />
                <Text
                    size={14}
                    color={'#606A80'}
                    style={{fontFamily:Regular500}}
                >
                    My contacts
                </Text>
            </View>
        </>
    );

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
                No matches found
            </Text>
        </View>
    );

    const ListFooterComponent=()=>{
        return (
            <ListFooter
                hasError={hasError}
                fetching={fetching}
                loadingText="Loading more users..."
                errorText="Unable to load users"
                refreshText="Refresh"
                onRefresh={()=>fetchMoreParticipants(true)}
            />
        );
    };

    const renderContactItem=({item}:any)=>{

        return (
            <Hoverable>
                {isHovered=>{
                    return <View style={{backgroundColor:isHovered ? "#F0F0FF" : "white"}}>
                        <ContactItem
                            image={item?.profilePicture?.thumb}
                            data={item}
                            name={item.name}
                            onPress={()=>onTapCheck(item._id)}
                            rightIcon={
                                <TouchableOpacity
                                    onPress={()=>onTapCheck(item._id)}
                                >

                                </TouchableOpacity>
                            }
                            contact={item.email||''}
                        />
                    </View>
                }

                }
            </Hoverable>
        );
    };

    const renderList=()=>{
        if(selected){
            return (
                <View style={{
                    backgroundColor:"#fff",
                    top:formTagsLayout?.height,
                    left:inputTagsLayout?.y,
                    width:inputTagsLayout?.width,
                    height:376,
                    maxWidth: 678,
                    zIndex:1,
                    position:"absolute"
                }}>

                    <FlatList
                        data={contacts}
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
                        renderItem={renderContactItem}
                        keyExtractor={(item)=>item._id}
                        ItemSeparatorComponent={
                            ()=><View style={styles.separator}/>
                        }
                        ListHeaderComponent={headerComponent}
                        ListEmptyComponent={emptyComponent}
                        ListFooterComponent={ListFooterComponent}
                        onEndReached={()=>fetchMoreParticipants()}
                        onEndReachedThreshold={0.5}
                        keyboardShouldPersistTaps={'handled'}
                    />

                </View>

            );
        }

    };

    const onGroup=()=>{
        setIsGroup(true);
        setIsFocused(false);
        setSearchValue('');
        setSearchText('');
        setContacts([]);
    };
    return (

        <View style={styles.container}>
            {selected && <TouchableWithoutFeedback onPress={()=> setSelected((selected)=> !selected )}>
                <View   style={{ zIndex: 1, width : "100%" ,
                    height : "100%" ,
                    alignItems : "center" ,
                    justifyContent : "flex-end" ,
                    position : "absolute" ,
                    backgroundColor : "rgba(255, 255, 255, 0)"}}/>
            </TouchableWithoutFeedback>}

            <StatusBar barStyle={'light-content'}/>

            <View onLayout={onLayoutFormTags} style={styles.header}>
                {
                    (
                        <View style={{paddingHorizontal:33, borderBottomColor:"#EFEFEF",borderBottomWidth:2}}>
                            <View>
                                {isGroup&&<View style={{
                                    justifyContent:"space-between",
                                    borderBottomWidth:2,
                                    borderBottomColor:"#2863D6",
                                    flexDirection:"row"
                                }}>
                                    <View style={{flexDirection:'row',alignItems:'center'}}>

                                        <Text
                                            color={text.default}
                                            size={14}
                                            style={{fontFamily:Regular}}
                                        >
                                            Group name:
                                        </Text>
                                        <InputField
                                            clearable={false}
                                            style={{marginBottom:-20}}
                                            ref={groupNameRef}
                                            placeholder={'Group name'}
                                            containerStyle={styles.groupName}
                                            placeholderTextColor={'#C4C4C4'}
                                            inputStyle={[styles.inputText,{backgroundColor:'white' }]}
                                            outlineStyle={[styles.outlineText,{backgroundColor:'white'}]}
                                            value={groupName}
                                            onChangeText={setGroupName}
                                            returnKeyType={'done'}
                                        />
                                    </View>
                                    {
                                        lodash.size(participants)>1&&isGroup&&(
                                            <View style={{alignSelf:"center"}}>
                                                <TouchableOpacity
                                                    disabled={!lodash.size(participants)||nextLoading}
                                                    onPress={()=>onNext("")}
                                                >
                                                    {
                                                        nextLoading ? (
                                                            <ActivityIndicator color={text.default} size={'small'}/>
                                                        ) : (
                                                            <Text
                                                                color={text.default}
                                                                size={14}
                                                                style={{fontFamily:Regular500}}
                                                            >
                                                                Create
                                                            </Text>
                                                        )
                                                    }
                                                </TouchableOpacity>
                                            </View>
                                        )

                                    }
                                    {
                                        lodash.size(participants)<1&& isGroup&&
                                        <View style={{alignSelf:"center"}}>
                                            <TouchableOpacity onPress={()=>{
                                                setIsGroup((isGroup) => !isGroup)
                                                setGroupName("")
                                            }}>
                                                <CloseIcon/>
                                            </TouchableOpacity>
                                        </View>

                                    }
                                </View>}
                                <View style={{
                                    paddingVertical:14,
                                    flexDirection:'row',
                                    justifyContent:'center'
                                }}>
                                    <View style={{alignSelf:"center"}}>
                                        <Text
                                            color={text.default}
                                            size={14}
                                            style={{fontFamily:Regular}}
                                        >
                                            To:
                                        </Text>
                                    </View>


                                    <View onLayout={onLayoutInputTags} style={{
                                        flexDirection:"row",
                                        justifyContent:"space-between",
                                        alignSelf:"center",
                                        flex:1,
                                        paddingLeft:5,
                                        marginTop:Platform.OS==='ios' ? 0 : -2
                                    }}>

                                        <InputTags

                                            placeholder={"Enter Name"}
                                            ref={inputTagRef}
                                            placeholderTextColor={'#C4C4C4'}
                                            containerStyle={tagStyles.container}
                                            initialTags={participants}
                                            initialText={searchValue}

                                            inputStyle={[tagStyles.input,{fontFamily:searchValue ? Bold : Regular, backgroundColor:'white'}]}
                                            outlineStyle={[styles.outlineText,{backgroundColor:'white'}]}
                                            onChangeTags={onChangeTags}
                                            renderTag={renderTag}
                                            onChangeTextDebounce={setSearchValue}
                                            onSubmitEditing={(event:any)=>setSearchText(event.nativeEvent.text)}
                                            onFocus={()=>{
                                                setSelected(true);
                                                setIsFocused(true)
                                            }}
                                            onBlur={()=>{

                                                setIsFocused(false)
                                            }}
                                        />

                                        {
                                            !searchValue&&(
                                                <View style={{alignSelf:"center"}}>
                                                    <TouchableOpacity onPress={()=>inputTagRef?.current?.focus()}>
                                                        <View style={styles.plus}>
                                                            <PlusIcon
                                                                color="white"
                                                                size={fontValue(12)}
                                                            />
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>

                                            )
                                        }
                                    </View>
                                    {!isGroup && <Hoverable>
                                        { isHovered => (
                                            <View style={{paddingLeft:32,alignSelf:"center"}}>
                                        <TouchableOpacity onPress={onGroup}>
                                            <View style={{
                                                borderRadius:20,
                                                paddingHorizontal:12,
                                                paddingVertical:5,
                                                backgroundColor:isHovered ? "#2863D6" : "#F9F9F9",
                                                flexDirection:"row"
                                            }}>

                                                <EditIcon color={isHovered ? "#fff" : "#212121"} style={{paddingRight:12}}/>
                                                <Text color={isHovered ?  "#fff" : "#212121" } size={15}>Add group name</Text>
                                            </View>
                                        </TouchableOpacity>
                                    </View>) }
                                    </Hoverable>}


                                </View>
                                {
                                    !lodash.size(participants)&&isMobile&&(
                                        <View style={styles.newGroupContainer}>
                                            <View style={{alignContent:'center',flexDirection:'row'}}>
                                                <NewGroupIcon
                                                    width={fontValue(22)}
                                                    height={fontValue(22)}
                                                    color={header.default}
                                                />
                                                <Text
                                                    color={header.default}
                                                    size={14}
                                                    style={{fontFamily:Regular500,marginLeft:5}}
                                                >
                                                    Create new group
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={onGroup}
                                            >
                                                <ArrowRightIcon
                                                    type='chevron-right'
                                                    color={'#606A80'}
                                                    size={fontValue(22)}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View>
                        </View>

                    )
                }
            </View>

            {renderList()}

            <ChatView
                channelId={selectedChannel?._id}
                otherParticipants={lodash.reject(selectedChannel.participants,(p:IParticipants)=>p._id===user._id)}
                isGroup={selectedChannel.isGroup}
                groupName={groupName}
                lastMessage={selectedChannel.lastMessage}
                onNext={(message:string,data:any)=>onNext(message,data)}
                participants={participants}
            />


            <AwesomeAlert
                show={showAlert}
                showProgress={false}
                contentContainerStyle={{borderRadius:15}}
                title={'Discard group?'}
                titleStyle={styles.title}
                message={"Are you sure you would like to discard this group? your changes won't be saved"}
                messageStyle={styles.message}
                contentStyle={styles.content}
                closeOnTouchOutside={false}
                closeOnHardwareBackPress={false}
                showCancelButton={true}
                showConfirmButton={true}
                cancelButtonColor={'white'}
                confirmButtonColor={'white'}
                cancelButtonTextStyle={styles.cancelText}
                confirmButtonTextStyle={styles.confirmText}
                actionContainerStyle={{justifyContent:'space-around'}}
                cancelText="Cancel"
                confirmText="Discard"
                onCancelPressed={()=>setShowAlert(false)}
                onConfirmPressed={onConfirmPressed}
            />
        </View>
    )
};

export default NewChat
