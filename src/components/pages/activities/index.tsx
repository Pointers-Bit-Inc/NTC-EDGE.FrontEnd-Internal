import {createMaterialTopTabNavigator, MaterialTopTabBarProps,} from "@react-navigation/material-top-tabs";

import React, {FC, memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    FlatList,
    FlatListProps,
    Platform, RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleProp,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
    ViewProps,
    ViewStyle,
} from "react-native";
import Animated, {
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
} from "react-native-reanimated";
import TabBar from "./components/TabBar";
import useScrollSync from "./hooks/useScrollSync";
import {Connection} from "./types/Connection";
import {ScrollPair} from "./types/ScrollPair";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {HeaderConfig} from "./types/HeaderConfig";
import {Visibility} from "./types/Visibility";
import lodash from "lodash";
import {useActivities} from "../../../hooks/useActivities";
import {isMobile} from "@pages/activities/isMobile";
import {isLandscapeSync, isTablet} from "react-native-device-info";
import FilterPressIcon from "@assets/svg/filterPress";
import FilterIcon from "@assets/svg/filterIcon";
import {styles as styles1} from "@pages/activities/styles";
import {RootStateOrAny, useSelector} from "react-redux";
import IMeetings from "../../../interfaces/IMeetings";
import {
    removeActiveMeeting,
    resetCurrentMeeting,
    setActiveMeetings,
    setMeeting,
    setOptions
} from "../../../reducers/meeting/actions";
import IParticipants from "../../../interfaces/IParticipants";
import {openUrl} from "../../../utils/web-actions";
import {setSelectedChannel} from "../../../reducers/channel/actions";
import {Regular500} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import HomeMenuIcon from "@assets/svg/homemenu";
import {setVisible} from "../../../reducers/activity/actions";
import {primaryColor} from "@styles/color";
import RefreshWeb from "@assets/svg/refreshWeb";
import {MeetingNotif} from '@components/molecules/list-item';
import {
    setApplicationItem,
    setNotPinnedApplication,
    setPinnedApplication,
    setSelectedYPos
} from "../../../reducers/application/actions";
import {renderSwiper} from "@pages/activities/swiper";
import {ActivityItem} from "@pages/activities/activityItem";
import {getChannelName} from "../../../utils/formatting";
import {FakeSearchBar} from "@pages/activities/fakeSearchBar";
import {SEARCH, SEARCHMOBILE} from "../../../reducers/activity/initialstate";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ActivityModal from "@pages/activities/modal";
import NoActivity from "@assets/svg/noActivity";
import listEmpty from "./listEmpty";
import ApplicationList from "@pages/activities/applicationList";
import { FontAwesome } from "@expo/vector-icons";
const TAB_BAR_HEIGHT = 48;
const HEADER_HEIGHT = 48;

const OVERLAY_VISIBILITY_OFFSET = 32;
const Tab = createMaterialTopTabNavigator();
const ActivitiesPage = (props) => {


    const dimensions = useWindowDimensions();
    const Filter = (
        isMobile && !(
            Platform?.isPad || isTablet())) || dimensions?.width <= 768 ? FilterIcon : FilterPressIcon;
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
        flatListViewRef,
        pinnedApplications,
        notPinnedApplications
    } = useActivities(props);

    const normalizeActiveMeetings = useSelector((state: RootStateOrAny) => state.meeting.normalizeActiveMeetings);
    const meeting = useSelector((state: RootStateOrAny) => state.meeting.meeting);
    const meetingList = useMemo(() => {
        if (meeting?._id) {
            return [];
        }
        let meetingList = lodash.keys(normalizeActiveMeetings).map(m => normalizeActiveMeetings[m]);
        meetingList = lodash.reject(meetingList, (m: IMeetings) => lodash.find(m.participants, (p: IParticipants) => p._id === user._id && (p.status === 'busy' || p.muted)));
        return lodash.orderBy(meetingList, 'updatedAt', 'desc');
    }, [normalizeActiveMeetings, meeting]);

    useEffect(() => {

        let unMount = false;
        getActiveMeetingList((err, result) => {
            if (!unMount) {
                if (result) {
                    dispatch(setActiveMeetings(result));
                }
            }
        });
        return () => {
            unMount = true;
        }
    }, []);
    const onJoin = (item: IMeetings) => {
        if (Platform.OS === 'web') {
            return openUrl(`/VideoCall?meetingId=${item._id}`);
        }
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

    const onClose = (item: IMeetings, leave = false) => {
        if (leave && item?.isGroup) {
            dispatch(removeActiveMeeting(item?._id));
            return leaveMeeting(item?._id, 'busy');
        } else if (item?.host?._id === user?._id || !item?.isGroup) {
            return endMeeting(item._id);
        } else {
            return dispatch(removeActiveMeeting(item?._id));
        }
    };
    const listHeaderComponent = () => <>
        {!searchVisible && !!pnApplications?.length && containerHeight &&
            <View style={[styles1.pinnedActivityContainer, {
                marginBottom: 5,
                paddingBottom: 20,
                backgroundColor: "#fff"
            }]}>
                {!!pnApplications?.length &&
                    <View style={[styles1.pinnedgroup, {height: undefined}]}>
                        <View style={[styles1.pinnedcontainer, {paddingVertical: 10}]}>
                            <Text style={[styles1.pinnedActivity, {fontFamily: Regular500,}]}>Pinned
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
                                if (!isMobile) {
                                    new Promise((resolve, reject) => {
                                        setTimeout(() => {
                                            resolve(event?.nativeEvent?.contentOffset?.y)
                                        }, 1000);
                                    }).then((data) => {
                                        setYPos(data)
                                    });
                                }

                            }}
                            scrollEventThrottle={16}
                            ref={scrollViewRef}
                            style={{maxHeight: 300}}>
                    {
                        pnApplications.map((item: any, index: number) => {
                            return item?.activity && <FlatList
                                scrollEventThrottle={16}
                                key={index}
                                listKey={(item, index) => `_key${index.toString()}`}
                                showsVerticalScrollIndicator={false}
                                style={styles.items}
                                data={item?.activity}

                                renderItem={(act, i) => {
                                    return (
                                            act?.item?.assignedPersonnel?._id || act?.item?.assignedPersonnel) == user?._id &&
                                        <ActivityItem
                                            isOpen={isOpen}
                                            config={config}
                                            key={i}
                                            selected={applicationItem?._id == act?.item?._id}
                                            currentUser={user}
                                            role={user?.role?.key}
                                            searchQuery={searchTerm}
                                            activity={act?.item}
                                            isPinned={true}
                                            onPressUser={(event: any) => {

                                                /*unReadReadApplicationFn(act?._id, false, true, (action: any) => {
                                                })*/
                                                dispatch(setApplicationItem({...act?.item, isOpen: `pin${i}${index}`}));
                                                //setDetails({ ...act , isOpen : `pin${ i }${ index }` });
                                                if (event?.icon == 'more') {
                                                    setMoreModalVisible(true)
                                                } else {
                                                    setModalVisible(true)
                                                }
                                                dispatch(setSelectedYPos({yPos, type: 1}))
                                            }} index={`pin${i}${index}`}
                                            swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, act?.item, unReadReadApplicationFn)}/>
                                }
                                }
                                keyExtractor={(item, index) => `_key${index.toString()}`}
                            />
                        })
                    }
                </ScrollView>

            </View>}
    </>;


    const {top, bottom} = useSafeAreaInsets();

    const {height: screenHeight} = useWindowDimensions();

    const allRef = useRef<FlatList>(null);
    const pendingRef = useRef<FlatList>(null);
    const historyRef = useRef<FlatList>(null);

    const [tabIndex, setTabIndex] = useState(0);

    const [headerHeight, setHeaderHeight] = useState(0);

    const defaultHeaderHeight =   (!!lodash.size(meetingList) ? 80 : 0) + (Platform.OS == "web" ? 0 : 44);

    const headerConfig = useMemo<HeaderConfig>(
        () => ({
            heightCollapsed: defaultHeaderHeight,
            heightExpanded: headerHeight,
        }),
        [defaultHeaderHeight, headerHeight]
    );

    const {heightCollapsed, heightExpanded} = headerConfig;

    const headerDiff = heightExpanded - heightCollapsed;

    const rendered = headerHeight > 0;

    const handleHeaderLayout = useCallback<NonNullable<ViewProps["onLayout"]>>(
        (event) => setHeaderHeight(event.nativeEvent.layout.height),
        []
    );

    const allScrollValue = useSharedValue(0);

    const allScrollHandler = useAnimatedScrollHandler(
        (event) => (allScrollValue.value = event.contentOffset.y)
    );

    const pendingScrollValue = useSharedValue(0);

    const pendingScrollHandler = useAnimatedScrollHandler(
        (event) => (pendingScrollValue.value = event.contentOffset.y)
    );
    const historyScrollValue = useSharedValue(0);

    const historyScrollHandler = useAnimatedScrollHandler(
        (event) => (historyScrollValue.value = event.contentOffset.y)
    );
    const scrollPairs = useMemo<ScrollPair[]>(
        () => [
            {list: allRef, position: allScrollValue},
            {list: pendingRef, position: pendingScrollValue},
            {list: historyRef, position: historyScrollValue},
        ],
        [allRef, allScrollValue, pendingRef, pendingScrollValue, historyRef, historyScrollValue]
    );

    const {sync} = useScrollSync(scrollPairs, headerConfig);

    const сurrentScrollValue = useDerivedValue(
        () =>
            tabIndex === 0 ? allScrollValue.value : tabIndex == 1 ? pendingScrollValue.value : historyScrollValue.value,
        [tabIndex, allScrollValue, pendingScrollValue, historyScrollValue]
    );

    const translateY = useDerivedValue(
        () => -Math.min(сurrentScrollValue.value, headerDiff)
    );

    const tabBarAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{translateY: translateY.value}],
    }));

    const headerAnimatedStyle = useAnimatedStyle(() => {

        return {
            transform: [{translateY: translateY.value}],
            opacity: interpolate(
                translateY.value,
                [-headerDiff, 0],
                [Visibility.Hidden, Visibility.Visible],
            ),
        };
    })

    const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => ({
            paddingTop: rendered ? headerHeight + TAB_BAR_HEIGHT : 0,
            paddingBottom: bottom,
            minHeight: screenHeight + headerDiff,
        }),
        [rendered, headerHeight, bottom, screenHeight, headerDiff]
    );

    const sharedProps = useMemo<Partial<FlatListProps<Connection>>>(
        () => ({
            contentContainerStyle,
            onMomentumScrollEnd: sync,
            onScrollEndDrag: sync,
            scrollEventThrottle: 16,
            scrollIndicatorInsets: {top: heightExpanded},
        }),
        [contentContainerStyle, sync, heightExpanded]
    );

    function getFlatList(ref, scrollHandler, sP, data, isHeader= false) {
        return <Animated.FlatList
            refreshControl={
                <RefreshControl
                    progressViewOffset={headerHeight}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={() => listEmpty(refreshing, searchTerm, (tabIndex == 0) ? notPnApplications.length + pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
                act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length : tabIndex == 1 ? pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
                act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length :  notPnApplications.length )}
            ListHeaderComponent={isHeader ? listHeaderComponent() : null}

            style={{flex: 1,}}
            data={data}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={refreshing ? <View/> : bottomLoader}
            onEndReached={() => {
                if (!onEndReachedCalledDuringMomentum || !(
                    isMobile && !(
                        Platform?.isPad || isTablet()))) {
                    handleLoad();
                    setOnEndReachedCalledDuringMomentum(true);
                }
            }}
            ref={ref}
            onScroll={scrollHandler}
            {...sP}
            onScrollEndDrag={onScrollEndDrag}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            onMomentumScrollEnd={onMomentumScrollEnd}
            scrollEventThrottle={1}
            renderItem={({item, index}) => (
                <ApplicationList
                    key={index}
                    onPress={() => {
                        userPress(index)

                    }}
                    item={item}
                    numbers={numberCollapsed}
                    index={index}

                    element={(activity: any, i: number) => {
                        return (

                            <ActivityItem
                                isOpen={isOpen}
                                config={config}
                                /*
                                    isPinned={true}
                                */
                                searchQuery={searchTerm}
                                key={i}
                                selected={applicationItem?._id == activity?._id}
                                parentIndex={index}
                                role={user?.role?.key}
                                activity={activity}
                                currentUser={user}
                                onPressUser={(event: any) => {
                                    dispatch(setSelectedYPos({yPos, type: 0}))
                                    dispatch(setApplicationItem({
                                        ...activity,
                                        isOpen: `${index}${i}`
                                    }));
                                    //setDetails({ ...activity , isOpen : `${ index }${ i }` });
                                    /*unReadReadApplicationFn(activity?._id, false, true, (action: any) => {
                                    })*/
                                    if (event?.icon == 'more') {
                                        setMoreModalVisible(true)
                                    } else {
                                        setModalVisible(true)
                                    }

                                }}

                                index={`${index}${i}`}
                                swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, activity, unReadReadApplicationFn)}/>
                        )
                    }}/>
            )}
        />
    }

    const renderAllActivities = useCallback(
        () => getFlatList(allRef, allScrollHandler, sharedProps, notPnApplications, true),
        [allRef, allScrollHandler, sharedProps]
    );

    const renderPending = useCallback(
        () => getFlatList(pendingRef, pendingScrollHandler, sharedProps, pnApplications, false),
        [pendingRef, pendingScrollHandler, sharedProps]
    );
    const renderHistory = useCallback(
        () => getFlatList(historyRef, historyScrollHandler, sharedProps, notPnApplications, false),
        [historyRef, historyScrollHandler, sharedProps]
    );
    const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            rendered ? styles.tabBarContainer : undefined,
            {top: rendered ? headerHeight : undefined},
            tabBarAnimatedStyle,
        ],
        [rendered, headerHeight, tabBarAnimatedStyle]
    );

    const renderTabBar = useCallback<(props: MaterialTopTabBarProps) => React.ReactElement>(
        (props) => (
            <Animated.View style={tabBarStyle}>
                <TabBar onIndexChange={setTabIndex} {...props} />
            </Animated.View>
        ),
        [tabBarStyle]
    );
    const headerContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            rendered ? styles.headerContainer : undefined,

            headerAnimatedStyle,
        ],

        [rendered, headerAnimatedStyle]
    );
    const collapsedOverlayAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                translateY.value,
                [-headerDiff, OVERLAY_VISIBILITY_OFFSET - headerDiff, 0],
                [Visibility.Visible, Visibility.Hidden, Visibility.Hidden]
            ),
            backgroundColor: primaryColor,
            zIndex: !!translateY.value ? 3 : 1
        }});


    const collapsedOverlayStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            styles.collapsedOvarlay,
            collapsedOverlayAnimatedStyle,
            {height: heightCollapsed},
        ],
        [collapsedOverlayAnimatedStyle, heightCollapsed]
    );
    return (
        <>
            <StatusBar barStyle={'light-content'}/>
            <View style={{flex: 1, backgroundColor: primaryColor,}}>
                <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
                    <View  style={[styles1.container, styles1.shadow, {
                        flexBasis: (
                            (
                                isMobile && !(
                                    Platform?.isPad || isTablet())) || dimensions?.width < 768 || (
                                (
                                    Platform?.isPad || isTablet()) && !isLandscapeSync())) ? "100%" : 466,
                        flexGrow: 0,
                        flexShrink: 0
                    }]}>

                        <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
                            <View onLayout={onLayoutComponent}>
                                <Animated.View style={[styles1.rect, styles1.horizontal, {
                                    backgroundColor: ((isMobile && !(Platform?.isPad || isTablet()))) ? "#041B6E" : "#fff",
                                    ...Platform.select({
                                        native: {
                                            paddingTop: 40 ,
                                        },
                                        web:{
                                            paddingTop: 10 ,
                                        }
                                    })
                                },]}>

                                    {(
                                            (
                                                isMobile && !(
                                                    Platform?.isPad || isTablet())) || dimensions?.width < 768) &&
                                        <TouchableOpacity  onPress={() => props.navigation.navigate('Settings')/*openDrawer()*/}>
                                            <HomeMenuIcon height={fontValue(24)} width={fontValue(24)}/>
                                        </TouchableOpacity>}

                                    <Text
                                        style={[styles1.activity, {
                                            color: (
                                                isMobile && !(
                                                    Platform?.isPad || isTablet())) || dimensions?.width < 768 ? "rgba(255,255,255,1)" : primaryColor,
                                        }]}>{(
                                        isMobile && !(
                                            Platform?.isPad || isTablet())) || dimensions?.width < 768 ? `Activity` : `Feed`}</Text>
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity onPress={() => {
                                        dispatch(setVisible(true))
                                    }

                                    }>
                                        <Filter pressed={visible} width={fontValue(32)} height={fontValue(32)}/>
                                    </TouchableOpacity>
                                    {
                                        <TouchableOpacity onPress={onRefresh}>
                                            {(
                                                !(
                                                    isMobile && !(
                                                        Platform?.isPad || isTablet())) && dimensions?.width > 768) ?<RefreshWeb style={{paddingLeft: 15}} width={fontValue(26)}
                                                                                                                                 height={fontValue(24)} fill={"#fff"}/> :<View style={{paddingHorizontal: 5}}><FontAwesome name="refresh" size={30} color="white" /></View>}
                                        </TouchableOpacity>
                                    }
                                </Animated.View>
                            </View>
                            <View>
                                {
                                    !!lodash.size(meetingList) && (
                                        <FlatList
                                            data={meetingList}
                                            bounces={false}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            snapToInterval={activitySizeComponent?.width || dimensions?.width}
                                            decelerationRate={0}
                                            keyExtractor={(item: any) => item._id}
                                            renderItem={({item}) => (
                                                <MeetingNotif
                                                    style={{
                                                        ...Platform.select({
                                                            native: {
                                                                width: activitySizeComponent?.width || dimensions?.width
                                                            },
                                                            default: {
                                                                width: 466
                                                            }
                                                        })
                                                    }}
                                                    name={getChannelName({
                                                        ...item,
                                                        otherParticipants: item?.participants
                                                    })}
                                                    time={item.createdAt}
                                                    host={item.host}
                                                    onJoin={() => onJoin(item)}
                                                    onClose={(leave: any) => onClose(item, leave)}
                                                    closeText={'Cancel'}
                                                />
                                            )}
                                        />
                                    )
                                }

                            </View>
                            <FakeSearchBar onSearchLayoutComponent={onSearchLayoutComponent}
                                           animated={{}} onPress={() => {

                                //setSearchVisible(true)
                                dispatch(setApplicationItem({}));

                                props.navigation.navigate(isMobile ? SEARCHMOBILE : SEARCH);
                            }} searchVisible={searchVisible}/>

                        </Animated.View>
                        <Animated.View  style={collapsedOverlayStyle}>
                            <View >
                                {
                                    !!lodash.size(meetingList) && (
                                        <FlatList
                                            data={meetingList}
                                            bounces={false}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            snapToInterval={activitySizeComponent?.width || dimensions?.width}
                                            decelerationRate={0}
                                            keyExtractor={(item: any) => item._id}
                                            renderItem={({item}) => (
                                                <MeetingNotif
                                                    style={{
                                                        ...Platform.select({
                                                            native: {
                                                                width: activitySizeComponent?.width || dimensions?.width
                                                            },
                                                            default: {
                                                                width: 466
                                                            }
                                                        })
                                                    }}
                                                    name={getChannelName({
                                                        ...item,
                                                        otherParticipants: item?.participants
                                                    })}
                                                    time={item.createdAt}
                                                    host={item.host}
                                                    onJoin={() => onJoin(item)}
                                                    onClose={(leave: any) => onClose(item, leave)}
                                                    closeText={'Cancel'}
                                                />
                                            )}
                                        />
                                    )
                                }

                            </View>
                        </Animated.View>
                        <Tab.Navigator tabBar={renderTabBar}>
                            <Tab.Screen name="All">{renderAllActivities}</Tab.Screen>
                            <Tab.Screen name="Pending">{renderPending}</Tab.Screen>
                            <Tab.Screen name="History">{renderHistory}</Tab.Screen>
                        </Tab.Navigator>
                    </View>
                    {
                        !(
                            (
                                isMobile && !(
                                    Platform?.isPad || isTablet()))) && lodash.isEmpty(applicationItem) && dimensions?.width > 768 &&
                        <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                            <NoActivity/>
                            <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                                selected</Text>


                        </View>
                    }


                    {(
                        !lodash.isEmpty(applicationItem)) && <View style={{flex: 1}}>
                        <ItemMoreModal details={applicationItem} visible={moreModalVisible} onDismissed={() => {
                            onMoreModalDismissed(applicationItem?.isOpen)
                        }}/>
                        <ActivityModal updateModal={updateModalFn}
                                       readFn={unReadReadApplicationFn}
                                       details={applicationItem}
                                       onChangeAssignedId={(event) => {
                                           let _notPinnedApplications = [...notPinnedApplications]
                                           let _pinnedApplications = [...pinnedApplications]
                                           let flag = 1

                                           for (let i = 0; i < _notPinnedApplications?.length; i++) {
                                               if (!flag) break
                                               if (_notPinnedApplications?.[i]?._id == event?._id) {
                                                   _notPinnedApplications[i] = event
                                               }
                                           }
                                           flag = 1
                                           for (let i = 0; i < _pinnedApplications?.length; i++) {
                                               if (!flag) break
                                               if (_pinnedApplications?.[i]?._id == event?._id) {
                                                   _notPinnedApplications.unshift(event)
                                                   _pinnedApplications.splice(i, 1)
                                               }
                                           }

                                           dispatch(setApplicationItem(event))
                                           dispatch(setNotPinnedApplication(_notPinnedApplications))
                                           dispatch(setPinnedApplication(_pinnedApplications))
                                           setUpdateModal(true);
                                       }}
                                       visible={modalVisible}
                                       onDismissed={(event: boolean, _id: number) => {
                                           setUpdateModal(false);
                                           dispatch(setApplicationItem({}));
                                           if (event && _id) {
                                               //  dispatch(deleteApplications(_id))
                                           }
                                           if (event) {
                                               onRefresh()
                                           }
                                           onDismissed()
                                       }}/></View>}
                </View>
            </View>
        </>

    )

};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    tabBarContainer: {
        top: 0,
        left: 0,
        right: 0,
        position: "absolute",
        zIndex: 1,
    },
    overlayName: {
        fontSize: 24,
    },
    collapsedOvarlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        justifyContent: "flex-end",
        zIndex: 1,
    },
    headerContainer: {
        top: 0,
        left: 0,
        right: 0,
        position: "absolute",
        zIndex: 2,
    },
});

export default ActivitiesPage;