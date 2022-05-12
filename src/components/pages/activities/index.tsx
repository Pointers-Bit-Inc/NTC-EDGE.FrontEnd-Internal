import React,{useEffect,useMemo} from "react";
import {
    Animated,
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";

import {SEARCH} from "../../../reducers/activity/initialstate";
import {RootStateOrAny,useSelector} from "react-redux";
import {setApplicationItem, setSelectedYPos} from "../../../reducers/application/actions";
import ActivityModal from "@pages/activities/modal";
import FilterIcon from "@assets/svg/filterIcon";
import {ActivityItem} from "@pages/activities/activityItem";
import {renderSwiper} from "@pages/activities/swiper";
import {setVisible} from "../../../reducers/activity/actions";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ApplicationList from "@pages/activities/applicationList";
import {getChannelName} from 'src/utils/formatting';
import lodash from 'lodash';
import {removeActiveMeeting , resetCurrentMeeting, setActiveMeetings , setMeeting, setOptions ,} from 'src/reducers/meeting/actions';
import {setSelectedChannel} from 'src/reducers/channel/actions';
import {MeetingNotif} from '@components/molecules/list-item';
import listEmpty from "@pages/activities/listEmpty";
import HomeMenuIcon from "@assets/svg/homemenu";
import {FakeSearchBar} from "@pages/activities/fakeSearchBar";
import {Regular500} from "@styles/font";
import NoActivity from "@assets/svg/noActivity";
import {styles} from "@pages/activities/styles";
import {fontValue} from "@pages/activities/fontValue";
import RefreshWeb from "@assets/svg/refreshWeb";
import {primaryColor} from "@styles/color";
import {isMobile} from "@pages/activities/isMobile";
import IMeetings from "src/interfaces/IMeetings";
import FilterPressIcon from "@assets/svg/filterPress";
import {useActivities} from "../../../hooks/useActivities";
import IParticipants from "src/interfaces/IParticipants";
import {isLandscapeSync,isTablet} from "react-native-device-info";


export default function ActivitiesPage(props:any){

    const dimensions=useWindowDimensions();
    const Filter=(
                     isMobile&& !(
                         Platform?.isPad||isTablet()))||dimensions?.width<=768 ? FilterIcon : FilterPressIcon;
    const {
        isReady,
        user,
        setUpdateModal,
        config,
        visible,
        applicationItem,
        dispatch,
        getActiveMeetingList,
        endMeeting,
        leaveMeeting,
        searchTerm,
        refreshing,
        onRefresh,
        numberCollapsed,
        searchVisible,
        pnApplications,
        notPnApplications,
        userPress,
        modalVisible,
        setModalVisible,
        moreModalVisible,
        setMoreModalVisible,
        onDismissed,
        onEndReachedCalledDuringMomentum,
        setOnEndReachedCalledDuringMomentum,
        bottomLoader,
        handleLoad,
        unReadReadApplicationFn,
        updateModalFn,
        isOpen,
        onMoreModalDismissed,
        sizeComponent,
        onLayoutComponent,
        onSearchLayoutComponent,
        onActivityLayoutComponent,
        containerHeight,
        scrollY,
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        onScrollEndDrag,
        headerTranslate,
        opacity,
        activitySizeComponent,
        scrollViewRef, yPos, setYPos,
        flatListViewRef
    }=useActivities(props);

    const { normalizeActiveMeetings, meeting } = useSelector((state: RootStateOrAny) => state.meeting);
    const meetingList = useMemo(() => {
        if (meeting?._id) {
            return [];
        }
        let meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m]);
        meetingList = lodash.reject(meetingList, (m:IMeetings) => lodash.find(m.participants, (p:IParticipants) => p._id === user._id && (p.status === 'busy' || p.muted)));
        return lodash.orderBy(meetingList , 'updatedAt' , 'desc');
    }, [normalizeActiveMeetings, meeting]);

    useEffect(()=>{

        let unMount=false;
        getActiveMeetingList((err,result)=>{
            if(!unMount){
                if(result){
                    dispatch(setActiveMeetings(result));
                }
            }
        });
        return ()=>{
            unMount=true;
        }
    },[]);
    const onJoin=(item:IMeetings)=>{
        dispatch(setSelectedChannel(item.room));
        dispatch(resetCurrentMeeting());
        setTimeout(() => {
            dispatch(setOptions({
                isHost: item.host._id === user._id,
                isVoiceCall: item.isVoiceCall,
                isMute: false,
                isVideoEnable: true,
            }));
            dispatch(setMeeting(item));
        }, 100);
    };

    const onClose=(item:IMeetings,leave=false)=>{
        if(leave&&item.isGroup){
            dispatch(removeActiveMeeting(item._id));
            return leaveMeeting(item._id,'busy');
        } else if(item.host._id===user._id|| !item.isGroup){
            return endMeeting(item._id);
        } else{
            return dispatch(removeActiveMeeting(item._id));
        }
    };
    const listHeaderComponent=()=><>
        {!searchVisible&& !!pnApplications?.length&&containerHeight&&
        <View style={[styles.pinnedActivityContainer,{
            marginBottom:5,
            paddingBottom:20,
            backgroundColor:"#fff"
        }]}>
            {!!pnApplications?.length&&
            <View style={[styles.pinnedgroup,{height:undefined}]}>
                <View style={[styles.pinnedcontainer,{paddingVertical:10}]}>
                    <Text style={[styles.pinnedActivity,{fontFamily:Regular500,}]}>Pinned
                        Activity</Text>
                </View>
            </View>}
           {/* <TouchableOpacity onPress={()=>{
            scrollViewRef?.current?.scrollTo({ y: yPos, animated: true });
            }}>
                <Text>test</Text>
            </TouchableOpacity>*/}
            <ScrollView showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        onScroll={(event) => {
                            if(!isMobile){
                                new Promise((resolve, reject) => {
                                    setTimeout(() => {
                                        resolve(event?.nativeEvent?.contentOffset?.y)
                                    }, 1000);
                                }).then((data)=>{
                                    setYPos(data)
                                });
                            }

                        }}
                        scrollEventThrottle={16}
                        ref={scrollViewRef}
                        style={{maxHeight:300}}>
                {
                    pnApplications.map((item:any,index:number)=>{
                        return item?.activity && <FlatList
                            scrollEventThrottle={16}
                            
                            listKey={(item, index) => `_key${index.toString()}`}
                            showsVerticalScrollIndicator={false}
                            style={styles.items}
                            data={item?.activity}

                            renderItem={(act, i) => {
                                return (
                                    act?.item?.assignedPersonnel?._id||act?.item?.assignedPersonnel)==user?._id&&<ActivityItem
                                    isOpen={isOpen}
                                    config={config}
                                    key={i}
                                    selected={applicationItem?._id==act?.item?._id}
                                    currentUser={user}
                                    role={user?.role?.key}
                                    searchQuery={searchTerm}
                                    activity={act?.item}
                                    isPinned={true}
                                    onPressUser={(event:any)=>{

                                        /*unReadReadApplicationFn(act?._id, false, true, (action: any) => {
                                        })*/
                                        dispatch(setApplicationItem({...act?.item,isOpen:`pin${i}${index}`}));
                                        //setDetails({ ...act , isOpen : `pin${ i }${ index }` });
                                        if(event?.icon=='more'){
                                            setMoreModalVisible(true)
                                        } else{
                                            setModalVisible(true)
                                        }
                                        dispatch(setSelectedYPos({yPos, type: 1}))
                                    }} index={`pin${i}${index}`}
                                    swiper={(index:number,progress:any,dragX:any,onPressUser:any)=>renderSwiper(index,progress,dragX,onPressUser,act?.item,unReadReadApplicationFn)}/>
                            }
                            }
                            keyExtractor={(item, index) => `_key${index.toString()}`}
                        />
                    })
                }
            </ScrollView>

        </View>}
    </>;



    return (
        <>
            <StatusBar barStyle={'light-content'}/>

            <View style={{backgroundColor:"#F8F8F8",flex:1,flexDirection:"row"}}>
                <View onLayout={onActivityLayoutComponent} style={[styles.container,styles.shadow,{
                    flexBasis:(
                                  (
                                      isMobile&& !(
                                          Platform?.isPad||isTablet()))||dimensions?.width<768||(
                                      (
                                          Platform?.isPad||isTablet())&& !isLandscapeSync())) ? "100%" : 466,
                    flexGrow:0,
                    flexShrink:0
                }]}>


                    <View onLayout={onLayoutComponent}
                          style={[styles.group,!modalVisible&& !moreModalVisible&& !visible&& !refreshing&& !lodash.size(meetingList)&&{position:"absolute"}]}>
                        <Animated.View style={[styles.rect,styles.horizontal,{
                            backgroundColor:((isMobile&& !(Platform?.isPad||isTablet()))) ? "#041B6E" : "#fff",

                        },!modalVisible&& !moreModalVisible&& !visible&& !refreshing&& !lodash.size(meetingList)&&{
                            ...{opacity},
                            transform:[{translateY:headerTranslate}]
                        }]}>

                            {(
                                (
                                    isMobile&& !(
                                        Platform?.isPad||isTablet()))||dimensions?.width<768)&&
                            <TouchableOpacity onPress={()=>props.navigation.navigate('Settings')/*openDrawer()*/}>
                                <HomeMenuIcon height={fontValue(24)} width={fontValue(24)}/>
                            </TouchableOpacity>}

                            <Text
                                style={[styles.activity,{
                                    color:(
                                              isMobile&& !(
                                                  Platform?.isPad||isTablet()))||dimensions?.width<768 ? "rgba(255,255,255,1)" : primaryColor,
                                }]}>{(
                                         isMobile&& !(
                                             Platform?.isPad||isTablet()))||dimensions?.width<768 ? `Activity` : `Feed`}</Text>
                            <View style={{flex:1}}/>
                            <TouchableOpacity onPress={()=>{
                                dispatch(setVisible(true))
                            }

                            }>

                                <Filter pressed={visible} width={fontValue(32)} height={fontValue(32)}/>

                            </TouchableOpacity>
                            {(
                                !(
                                    isMobile&& !(
                                        Platform?.isPad||isTablet()))&&dimensions?.width>768)&&
                            <TouchableOpacity onPress={onRefresh}>
                                <RefreshWeb style={{paddingLeft:15}} width={fontValue(26)}
                                            height={fontValue(24)} fill={"#fff"}/>
                            </TouchableOpacity>
                            }
                        </Animated.View>
                    </View>
                    <View>
                        {
                            !!lodash.size(meetingList)&&(
                                <FlatList
                                    data={meetingList}
                                    bounces={false}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    snapToInterval={activitySizeComponent?.width||dimensions?.width}
                                    decelerationRate={0}
                                    keyExtractor={(item:any)=>item._id}
                                    renderItem={({item})=>(
                                        <MeetingNotif
                                            style={{
                                                ...Platform.select({
                                                    native:{
                                                        width:activitySizeComponent?.width||dimensions?.width
                                                    },
                                                    default:{
                                                        width:466
                                                    }
                                                })
                                            }}
                                            name={getChannelName({
                                                ...item,
                                                otherParticipants:item?.participants
                                            })}
                                            time={item.createdAt}
                                            host={item.host}
                                            onJoin={()=>onJoin(item)}
                                            onClose={(leave:any)=>onClose(item,leave)}
                                            closeText={'Cancel'}
                                        />
                                    )}
                                />
                            )
                        }

                    </View>
                    <FakeSearchBar onSearchLayoutComponent={onSearchLayoutComponent}
                                   animated={!modalVisible&& !moreModalVisible&& !visible&& !refreshing&& !lodash.size(meetingList)&&{
                                       ...{opacity},
                                       top:sizeComponent?.height||80*(
                                           1+lodash.size(meetingList)),
                                       elevation:10,
                                       zIndex:10,
                                       position:"absolute",
                                       transform:[{translateY:headerTranslate}]
                                   }} onPress={()=>{

                        //setSearchVisible(true)
                        dispatch(setApplicationItem({}));

                        props.navigation.navigate(SEARCH);
                    }} searchVisible={searchVisible}/>

                    <Animated.FlatList
                        refreshControl={
                            <RefreshControl
                                progressViewOffset={refreshing ? 0 : containerHeight}
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            {
                                useNativeDriver: true,
                                listener: (event) => {
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            resolve(event?.nativeEvent?.contentOffset?.y)
                                        }, 1000);
                                    }).then((data)=>{
                                        setYPos(data)
                                    })
                                } }
                        )}
                        contentContainerStyle={{
                            display:isReady ? undefined : "none",
                            paddingTop:(
                                !modalVisible&& !moreModalVisible&& !visible&& !refreshing&& !lodash.size(meetingList)&&containerHeight*(
                                    lodash.size(meetingList)||1))||0,flexGrow:1
                        }}
                        ListEmptyComponent={()=>listEmpty(refreshing,searchTerm,(
                            notPnApplications.length)+pnApplications?.map((item:any,index:number)=>item?.activity&&item?.activity?.map((act:any,i:number)=>(
                            act?.assignedPersonnel?._id||act?.assignedPersonnel)==user?._id)).length)}
                        ListHeaderComponent={listHeaderComponent()}

                        style={{flex:1,}}
                        ref={flatListViewRef}
                        data={notPnApplications}
                        keyExtractor={(item,index)=>index.toString()}
                        ListFooterComponent={bottomLoader}
                        onEndReached={()=>{

                            if(!onEndReachedCalledDuringMomentum|| !(
                                isMobile&& !(
                                    Platform?.isPad||isTablet()))){
                                handleLoad();
                                setOnEndReachedCalledDuringMomentum(true);
                            }

                        }}
                        onScrollEndDrag={onScrollEndDrag}
                        onEndReachedThreshold={0.5}
                        onMomentumScrollBegin={()=>{
                            onMomentumScrollBegin();
                            setOnEndReachedCalledDuringMomentum(false)
                        }}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        scrollEventThrottle={1}
                        renderItem={({item,index})=>(
                            <ApplicationList
                                key={index}
                                onPress={()=>{
                                    userPress(index)

                                }}
                                item={item}
                                numbers={numberCollapsed}
                                index={index}

                                element={(activity:any,i:number)=>{
                                    return (

                                        <ActivityItem
                                            isOpen={isOpen}
                                            config={config}
                                            /*
                                            isPinned={true}*/
                                            searchQuery={searchTerm}
                                            key={i}
                                            selected={applicationItem?._id==activity?._id}
                                            parentIndex={index}
                                            role={user?.role?.key}
                                            activity={activity}
                                            currentUser={user}
                                            onPressUser={(event:any)=>{
                                                dispatch(setSelectedYPos({yPos,   type: 0}))
                                                dispatch(setApplicationItem({
                                                    ...activity,
                                                    isOpen:`${index}${i}`
                                                }));
                                                //setDetails({ ...activity , isOpen : `${ index }${ i }` });
                                                /*unReadReadApplicationFn(activity?._id, false, true, (action: any) => {
                                                })*/
                                                if(event?.icon=='more'){
                                                    setMoreModalVisible(true)
                                                } else{
                                                    setModalVisible(true)
                                                }

                                            }} index={`${index}${i}`}
                                            swiper={(index:number,progress:any,dragX:any,onPressUser:any)=>renderSwiper(index,progress,dragX,onPressUser,activity,unReadReadApplicationFn)}/>
                                    )
                                }}/>
                        )}
                    />
                    {/*    right view jkadtong muslide
                view*/}


                </View>
                {
                    !(
                        (
                            isMobile&& !(
                                Platform?.isPad||isTablet())))&&lodash.isEmpty(applicationItem)&&dimensions?.width>768&&
                    <View style={[{flex:1,justifyContent:"center",alignItems:"center"}]}>

                        <NoActivity/>
                        <Text style={{color:"#A0A3BD",fontSize:fontValue(24)}}>No activity
                            selected</Text>


                    </View>
                }


                {(
                    !lodash.isEmpty(applicationItem))&&<View style={{flex:1}}>
                    <ItemMoreModal details={applicationItem} visible={moreModalVisible} onDismissed={()=>{
                        onMoreModalDismissed(applicationItem?.isOpen)
                    }}/>
                    <ActivityModal updateModal={updateModalFn}
                                   readFn={unReadReadApplicationFn}
                                   details={applicationItem}
                                   onChangeAssignedId={(event)=>{

                                       dispatch(setApplicationItem(event))

                                   }}
                                   visible={modalVisible}
                                   onDismissed={(event:boolean,_id:number)=>{
                                       setUpdateModal(false);
                                       dispatch(setApplicationItem({}));
                                       if(event&&_id){
                                           //  dispatch(deleteApplications(_id))
                                       }
                                       if(event){
                                           onRefresh()
                                       }
                                       onDismissed()
                                   }}/></View>}
            </View>

        </>


    );

}

