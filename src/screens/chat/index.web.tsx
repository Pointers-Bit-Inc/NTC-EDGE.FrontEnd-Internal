import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    StyleSheet ,
    View ,
    TouchableOpacity ,
    Dimensions ,
    Platform ,
    StatusBar , ActivityIndicator , FlatList , RefreshControl , Animated , ScrollView ,
} from 'react-native'
import { useSelector, useDispatch, RootStateOrAny } from 'react-redux';
import AwesomeAlert from 'react-native-awesome-alerts';
import lodash from 'lodash';
import { setSelectedChannel, setChannelList, addToChannelList, addChannel, updateChannel, removeChannel, setMeetings, removeSelectedMessage, setSearchValue as setSearchValueFN } from 'src/reducers/channel/actions';
import { SearchField } from '@components/molecules/form-fields';
import { primaryColor, outline, text, button } from '@styles/color';
import useSignalr from 'src/hooks/useSignalr';
import { useRequestCameraAndAudioPermission } from 'src/hooks/useAgora';
import Text from '@atoms/text';
import InputStyles from 'src/styles/input-style';
import HomeMenuIcon from "@assets/svg/homemenu";
import { NewChatIcon } from '@atoms/icon';
import {Bold, Regular, Regular500} from "@styles/font";
import BottomModal, { BottomModalRef } from '@components/atoms/modal/bottom-modal';
import NewChat from '@pages/chat/new';
import {fontValue} from "@pages/activities/fontValue";
import MeetIcon from "@assets/svg/meetIcon";
import hairlineWidth = StyleSheet.hairlineWidth;
import {getChannelImage , getChannelName , getTimeString} from "../../utils/formatting";
import IMeetings from "../../interfaces/IMeetings";
import {removeActiveMeeting , setMeeting} from "../../reducers/meeting/actions";
import {ChatItem , ListFooter , MeetingNotif} from "@molecules/list-item";
import Swipeable from "react-native-gesture-handler/Swipeable";
import NewDeleteIcon from "@atoms/icon/new-delete";
import ChatView from "@screens/chat/view";
import List from "@screens/chat/chat-list";

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: 'white',
    },
    header: {
        backgroundColor: 'white',
         borderBottomWidth: hairlineWidth,
        borderBottomColor: "#EFEFEF"
    },
    input: {
        fontSize: fontValue(14),
        fontFamily: Regular,
        color: 'black',
        flex: 1,
    },
    outline: {
        borderWidth: 0,
        backgroundColor: '#EFF0F6',
        borderRadius: 10,
    },
    icon: {
        paddingHorizontal: 5,
        color: text.default,
        fontSize: fontValue(18),
    },
    headerContent: {
        justifyContent: "center",
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        paddingTop: 15,
        paddingHorizontal: 26
    },
    titleContainer: {
        flex: 1,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        width: width - 70,
        alignSelf: 'flex-end',
        backgroundColor: outline.default,
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    floating: {
        position: 'absolute',
        bottom: 60,
        right: 20,
    },
    button: {
        height: 65,
        width: 65,
        borderRadius: 65,
        backgroundColor: primaryColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    delete: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    bar: {
        height: 15,
        width: 35,
        borderRadius: 4,
    },
    cancelText: {
        fontSize: fontValue(18),
        color: '#DC2626',
    },
    confirmText: {
        fontSize: fontValue(18),
        color: text.info,
    },
    title: {
        textAlign: 'center',
        fontSize: fontValue(16),
        fontFamily: Regular,
        color: '#1F2022'
    },
    message: {
        textAlign: 'center',
        fontSize: 14,
        marginHorizontal: 15,
        marginBottom: 15,
    },
    content: {
        borderBottomColor: outline.default,
        borderBottomWidth: 1,
    },
    headerNewChatIcon:{

          padding: 11,
        backgroundColor: "#2863D6",
        borderRadius: 100
    }
});

function Chat(props: { user, navigation, onPress: () => any, onBackdropPress: () => void, onSubmit: (res: any) => void }) {
   // useRequestCameraAndAudioPermission();
    const {
        getChatList,
        leaveChannel,
        endMeeting,
        leaveMeeting,
    } = useSignalr();
    const swipeableRef:any = useRef({});
    const { selectedMessage } = useSelector((state:RootStateOrAny) => state.channel);
    const modalRef = useRef<BottomModalRef>(null);
    const dispatch = useDispatch();
    const meetingList = useSelector((state: RootStateOrAny) => {
        const { normalizeActiveMeetings } = state.meeting
        const meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m])
        return lodash.orderBy(meetingList, 'updatedAt', 'desc');
    })
    const [searchText, setSearchText] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [sendRequest, setSendRequest] = useState(0);
    const [pageIndex, setPageIndex] = useState(1);
    const [fetching, setFetching] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedItem, setSelectedItem]:any = useState({});
    const onJoin = (item:IMeetings) => {
        dispatch(setSelectedChannel(item.room));
        dispatch(setMeeting(item));
        props.navigation.navigate('Dial', {
            isHost: item.host._id === props.user._id,
            isVoiceCall: item.isVoiceCall,
            options: {
                isMute: false,
                isVideoEnable: true,
            }
        });
    }
    const onClose = (item:IMeetings, leave = false) => {
        if (leave) {
            dispatch(removeActiveMeeting(item._id));
            return leaveMeeting(item._id);
        } else if (item.host._id === props.user._id) {
            return endMeeting(item._id);
        } else {
            return dispatch(removeActiveMeeting(item._id));
        }
    }
    const channelList = useSelector((state:RootStateOrAny) => {
        const { normalizedChannelList } = state.channel
        const channelList = lodash.keys(normalizedChannelList).map(ch => {
            const channel = normalizedChannelList[ch];
            channel.otherParticipants = lodash.reject(channel.participants, p => p._id === props.user._id);
            channel.lastMessage.hasSeen = !!lodash.find(channel.lastMessage.seen, s => s._id === props.user._id);
            return channel;
        });
        return lodash.orderBy(channelList, 'lastMessage.createdAt', 'desc');
    });
    const onRequestData = () => setSendRequest(request => request + 1);
    const fetchMoreChat = (isPressed = false) => {
        if ((!hasMore || fetching || hasError || loading) && !isPressed) return;
        setFetching(true);
        setHasError(false);
        const payload = searchValue ? { pageIndex, keyword: searchValue } : { pageIndex };

        getChatList(payload, (err:any, res:any) => {
            if (res) {
                if (res.list) dispatch(addToChannelList(res.list));
                setPageIndex(current => current + 1);
                setHasMore(res.hasMore);
            }
            if (err) {
                console.log('ERR', err);
                setHasError(true);
            }
            setFetching(false);
        });
    }
    useEffect(() => {
        setLoading(true);
        setPageIndex(1);
        setHasMore(false);
        setHasError(false);
        let unMount = false;
        const payload = searchValue ? { pageIndex: 1, keyword: searchValue } : { pageIndex: 1 };

        getChatList(payload, (err:any, res:any) => {
            if (!unMount) {
                if (res) {
                    dispatch(setChannelList(res.list));
                    setPageIndex(current => current + 1);
                    setHasMore(res.hasMore);
                }
                if (err) {
                    console.log('ERR', err);
                }
                setLoading(false);
            }
        });

        return () => {
            unMount = true;
        }
    }, [sendRequest, searchValue])
    const emptyComponent = () => (
        <View
            style={{
                justifyContent: 'center',
                alignItems: 'center',
                padding: 30,
            }}>
            <Text
                color={text.default}
                size={14}
            >
                No chat found
            </Text>
        </View>
    )

    const renderRightActions = (progress, dragX, item) => {
        const trans = dragX.interpolate({
            inputRange: [-50, 100],
            outputRange: [10, 100],
        });
        return (
            <TouchableOpacity onPress={() => {
                setSelectedItem(item);
                setShowAlert(true)
            }}>
                <Animated.View
                    style={{
                        paddingHorizontal: 15,
                        marginLeft: 10,
                        backgroundColor: '#CF0327',
                        flex: 1,
                        transform: [{ translateX: trans }],
                        alignItems: 'center',
                        justifyContent: 'center',
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
    const ListFooterComponent = () => {
        return (
            <ListFooter
                hasError={hasError}
                fetching={fetching}
                loadingText="Loading more chat..."
                errorText="Unable to load chats"
                refreshText="Refresh"
                onRefresh={() => fetchMoreChat(true)}
            />
        );
    }

    return <View style={styles.container}>
        <StatusBar barStyle={ "light-content" }/>
        <View style={ styles.header }>
            <View style={ styles.headerContent }>

                <View style={ styles.titleContainer }>
                    <Text
                        color={ "#113196" }
                        size={ 20 }
                        style={ { fontFamily : Bold , marginBottom : Platform.OS === "ios" ? 0 : -5 } }
                    >
                        Chat
                    </Text>
                </View>
                <View style={ { width : 25 } }/>

                <TouchableOpacity >

                    <View style={[styles.headerNewChatIcon, {borderWidth: 1, borderColor: "#E5E5E5", backgroundColor: "#F0F0F0", marginHorizontal: 10,}]}>
                        <MeetIcon
                            width={ fontValue(20) }
                            height={ fontValue(20) }
                        />
                    </View>

                </TouchableOpacity>
                <TouchableOpacity onPress={() => modalRef.current?.open()} >

                    <View style={styles.headerNewChatIcon}>
                        <NewChatIcon
                            width={ fontValue(20) }
                            height={ fontValue(20) }
                        />
                    </View>

                </TouchableOpacity>
            </View>
            <View>
                {
                        !!lodash.size(meetingList) && (
                            <FlatList
                                data={meetingList}
                                bounces={false}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                snapToInterval={width}
                                decelerationRate={0}
                                keyExtractor={(item: any) => item._id}
                                renderItem={({item}) => (
                                    <MeetingNotif
                                        style={{width}}
                                        name={getChannelName({...item, otherParticipants: item?.participants})}
                                        time={item.createdAt}
                                        host={item.host}
                                        onJoin={() => onJoin(item)}
                                        onClose={(leave:boolean) => onClose(item, leave)}
                                        closeText={'Cancel'}
                                    />
                                )}
                            />
                        )
                    }
            </View>

            <SearchField
                containerStyle={{ paddingHorizontal: 20, paddingVertical: 20, paddingBottom: 10 }}
                inputStyle={[InputStyles.text, styles.input]}
                iconStyle={styles.icon}
                placeholder="Search"
                placeholderTextColor="#6E7191"
                outlineStyle={[InputStyles.outlineStyle, styles.outline]}
                value={searchText}
                onChangeText={setSearchText}
                onChangeTextDebounce={setSearchValue}
                onSubmitEditing={(event:any) => setSearchText(event.nativeEvent.text)}

            />
        </View>
        <View style={ styles.shadow }/>
        {
            loading ? (
                <View style={{ alignItems: 'center' }}>
                    <ActivityIndicator size={'small'} color={text.default} />
                    <Text
                        style={{ marginTop: 10 }}
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
                    renderItem={({ item }:any) => (
                        <Swipeable
                            ref={ref => swipeableRef.current[item._id] = ref}
                            renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}
                        >
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
                                onPress={() => {
                                    dispatch(setSelectedChannel(item));
                                    dispatch(setMeetings([]));
                                    if (selectedMessage && selectedMessage.channelId !== item._id) {
                                        dispatch(removeSelectedMessage());
                                    }
                                    //props.navigation.navigate('ViewChat', item)
                                }}
                            />
                        </Swipeable>
                    )}
                    keyExtractor={(item:any) => item._id}
                    ListEmptyComponent={emptyComponent}
                    ListFooterComponent={ListFooterComponent}
                    onEndReached={() => fetchMoreChat()}
                    onEndReachedThreshold={0.5}
                />
            )
        }
        <BottomModal
            ref={modalRef}
            onModalHide={() => modalRef.current?.close()}
            avoidKeyboard={false}
            header={
                <View style={styles.bar} />
            }
            containerStyle={{ maxHeight: null }}
            backdropOpacity={0}
            onBackdropPress={() => {}}
        >
            <View style={{ height: height * (Platform.OS === 'ios' ? 0.94 : 0.98) }}>
                <NewChat
                    onClose={() => modalRef.current?.close()}
                    onSubmit={(res:any) => {
                        res.otherParticipants = lodash.reject(res.participants, p => p._id === props.user._id);
                        dispatch(setSelectedChannel(res));
                        dispatch(addChannel(res));
                        modalRef.current?.close();
                        setTimeout(() => props.navigation.navigate('ViewChat', res), 300);
                    }}
                />
            </View>
        </BottomModal>
        <AwesomeAlert
            overlayStyle={ { flex : 1 } }
            showProgress={ false }
            contentContainerStyle={ { borderRadius : 15 , maxWidth : width * 0.7 } }
            titleStyle={ styles.title }
            message={ "Are you sure you want to permanently delete this conversation?" }
            messageStyle={ styles.title }
            contentStyle={ styles.content }
            closeOnTouchOutside={ false }
            closeOnHardwareBackPress={ false }
            showCancelButton={ true }
            showConfirmButton={ true }
            cancelButtonColor={ "white" }
            confirmButtonColor={ "white" }
            cancelButtonTextStyle={ styles.cancelText }
            confirmButtonTextStyle={ styles.confirmText }
            actionContainerStyle={ { justifyContent : "space-around" } }
            cancelText="Cancel"
            confirmText="Yes"

        />
    </View>;
}


const ChatList = ({ navigation }:any) => {


    const user = useSelector((state:RootStateOrAny) => state.user);

    return (
        <View style={ { flexDirection : "row" , flex: 1} }>
            <View style={ { flex : 0.4,} }>
                <Chat
                    user={user}
                    navigation={navigation}
                    onPress={ () => navigation.navigate('Settings') }
                    onBackdropPress={ () => {
                    } }
                    onSubmit={ (res: any) => {
                        res.otherParticipants = lodash.reject(res.participants , p => p._id === user._id);
                        setTimeout(() => navigation.navigate('ViewChat' , res) , 300);
                    } }/>
            </View>
              <View style={ { flex : 0.6 ,} }>

                     <List/>

              </View>
        </View>


    )
}

export default ChatList
