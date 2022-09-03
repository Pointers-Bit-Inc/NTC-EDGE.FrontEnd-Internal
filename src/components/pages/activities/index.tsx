import {createMaterialTopTabNavigator, MaterialTopTabBarProps,} from "@react-navigation/material-top-tabs";

import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    FlatList,
    FlatListProps,
    Platform,
    RefreshControl,
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
import useActivities from "../../../hooks/useActivities";
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
import {fontValue} from "@pages/activities/fontValue";
import HomeMenuIcon from "@assets/svg/homemenu";
import {setVisible} from "../../../reducers/activity/actions";
import {infoColor, primaryColor} from "@styles/color";
import RefreshWeb from "@assets/svg/refreshWeb";
import {MeetingNotif} from '@components/molecules/list-item';
import {
    setApplicationItem,
    setEdit,
    setHasChange,
    setNotPinnedApplication,
    setPinnedApplication,
    setSelectedYPos
} from "../../../reducers/application/actions";
import {renderSwiper} from "@pages/activities/swiper";
import ActivityItem from "@pages/activities/activityItem";
import {getChannelName} from "../../../utils/formatting";
import FakeSearchBar from "@pages/activities/fakeSearchBar";
import {ACTIVITYITEM, APPROVED, PAID, SEARCH, SEARCHMOBILE} from "../../../reducers/activity/initialstate";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ActivityModal from "@pages/activities/modal";
import NoActivity from "@assets/svg/noActivity";
import listEmpty from "./listEmpty";
import ApplicationList from "@pages/activities/applicationList";
import RefreshRN from "@assets/svg/refreshRN";
import useMemoizedFn from "../../../hooks/useMemoizedFn";
import ListHeaderComponent from "@pages/activities/listHeaderComponent";
import Api from "../../../services/api";
import {Regular, Regular500} from "@styles/font";

const TAB_BAR_HEIGHT = 48;
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
        containerHeight,
        activitySizeComponent,
        scrollViewRef, yPos, setYPos,
        flatListViewRef,
        pinnedApplications,
        notPinnedApplications
    } = useActivities(props);

    const normalizeActiveMeetings = useSelector((state: RootStateOrAny) => state.meeting.normalizeActiveMeetings);
    const applicationItemId = useSelector((state: RootStateOrAny) => state.application.applicationItemId);

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


    const {top, bottom} = useSafeAreaInsets();

    const {height: screenHeight} = useWindowDimensions();

    const allRef = useRef<FlatList>(null);
    const pendingRef = useRef<FlatList>(null);
    const historyRef = useRef<FlatList>(null);

    const [tabIndex, setTabIndex] = useState(0);

    const [headerHeight, setHeaderHeight] = useState(0);

    const defaultHeaderHeight = (!!lodash.size(meetingList) ? 80 : 0) + (Platform.OS == "web" ? 0 : 44);

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
    const onDismissedModal = (event: boolean, _id: number) => {
        setUpdateModal(false);
        dispatch(setApplicationItem({}));
        if (event && _id) {
            //  dispatch(deleteApplications(_id))
        }
        if (event) {
            console.log("onRefresh")
            onRefresh()
        }
        onDismissed()
    };
    const onChangeAssignedId = useCallback((event) => {
        let _notPinnedApplications = [...notPnApplications]
        let _pinnedApplications = [...pnApplications]
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
    }, []);
    const onChangeEvent = (event) => {

        setUpdateModal(true);
    }

    const getRenderItem = useCallback((act, i, index: number) => {
        return (
                act?.item?.assignedPersonnel?._id || act?.item?.assignedPersonnel) == user?._id &&
            <ActivityItem
                isOpen={isOpen}
                config={config}
                key={i}
                selected={ Platform?.OS == "web" ? act?.item?._id : false}
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
                        if (Platform.OS == "web") {
                            setModalVisible(true)
                        } else {
                            props.navigation.navigate(ACTIVITYITEM, {
                                onDismissed: onDismissedModal,
                                onChangeEvent: onChangeEvent,
                                onChangeAssignedId: onChangeAssignedId
                            });
                        }
                    }
                    dispatch(setSelectedYPos({yPos, type: 1}))

                }} index={`pin${i}${index}`}
                swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, act?.item, unReadReadApplicationFn)}/>
    }, [])

    const listHeaderComponent = () => <ListHeaderComponent searchVisible={searchVisible} pnApplications={pnApplications}
                                                           containerHeight={fontValue(containerHeight)} onScroll={(event) => {
        if (!isMobile) {
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(event?.nativeEvent?.contentOffset?.y)
                }, 1000);
            }).then((data) => {
                setYPos(data)
            });
        }

    }} ref={scrollViewRef} callbackfn={(item: any, index: number) => {
        return item?.activity && <FlatList
            scrollEventThrottle={16}
            key={index}
            listKey={(item, index) => `_key${index.toString()}`}
            showsVerticalScrollIndicator={false}
            style={styles.items}
            data={item?.activity}

            renderItem={(act, i) => {
                return getRenderItem(act, i, index)
            }
            }
            keyExtractor={(item, index) => `_key${index.toString()}`}
        />
    }}/>;

    const renderItem = useCallback(({item, index}) => (
            <>
                <ApplicationList
                    key={index}
                    onPress={() => {
                        userPress(index)

                    }}
                    item={item}
                    numbers={numberCollapsed}
                    index={index}

                    element={(activity: any, i: number, selected) => {
                        return (
                            <ActivityItem
                                isOpen={isOpen}

                                config={config}
                                /*
                                    isPinned={true}
                                */
                                searchQuery={searchTerm}
                                key={i}
                                selected={Platform?.OS == "web" ? activity?._id : false}
                                parentIndex={index}
                                role={user?.role?.key}
                                activity={activity}
                                currentUser={user}
                                onPressUser={(event: any) => {

                                    dispatch(setEdit(false))
                                    dispatch(setHasChange(false))
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
                                        if (Platform.OS == "web") {
                                            setModalVisible(true)
                                        } else {
                                            props.navigation.navigate(ACTIVITYITEM, {
                                                onDismissed: onDismissedModal,
                                                onChangeEvent: onChangeEvent,
                                                onChangeAssignedId: onChangeAssignedId
                                            });
                                        }


                                        //
                                    }

                                }}

                                index={`${index}${i}`}
                                swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, activity, unReadReadApplicationFn)}/>
                        )
                    }}/>
            </>
        ), []);
    const  onEndReached = () => {
        if (!onEndReachedCalledDuringMomentum || !(
            isMobile && !(
                Platform?.isPad || isTablet()))) {
            handleLoad();
            setOnEndReachedCalledDuringMomentum(true);
        }
    }

    const  listEmptyComponent = useMemoizedFn(() => listEmpty(refreshing, searchTerm, (tabIndex == 0) ? notPnApplications.length + pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
        act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length : tabIndex == 1 ? pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
        act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length : notPnApplications.length));

    const renderAllActivities = useCallback(
        () => <Animated.FlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    progressViewOffset={headerHeight + 42}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyComponent}
            ListHeaderComponent={listHeaderComponent()}
            style={{flex: 1,}}
            data={notPnApplications}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={refreshing ? <View/> : bottomLoader}
            onEndReached={onEndReached}
            ref={allRef}
            onScroll={allScrollHandler}
            {...sharedProps}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [allRef, allScrollHandler, sharedProps]
    );


    const renderPending = useCallback(
        () => <Animated.FlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    progressViewOffset={headerHeight + 42}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyComponent}
            style={{flex: 1,}}
            data={pnApplications}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={refreshing ? <View/> : bottomLoader}
            onEndReached={onEndReached}
            ref={pendingRef}
            onScroll={pendingScrollHandler}
            {...sharedProps}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [pendingRef, pendingScrollHandler,sharedProps]
    );

    const renderHistory = useCallback(
        () => <Animated.FlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    progressViewOffset={headerHeight + 42}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyComponent}
            style={{flex: 1,}}
            data={notPnApplications}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={refreshing ? <View/> : bottomLoader}
            onEndReached={onEndReached}
            ref={historyRef}
            onScroll={historyScrollHandler}
            {...sharedProps}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [historyRef, historyScrollHandler,  sharedProps]
    );
    const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            rendered ? styles.tabBarContainer : undefined,
            {top: rendered ? headerHeight : undefined},
            tabBarAnimatedStyle,
        ],
        [rendered, headerHeight, tabBarAnimatedStyle]
    );
    const tabBarOptions = useMemo(() =>{
        return {
        tabBarLabelStyle: {

            fontFamily: Regular,
            fontSize: fontValue(12),
        },
        "tabBarActiveTintColor": "#2F5BFA",
        "tabBarInactiveTintColor": "#606A80",
        "tabBarIndicatorStyle": {
            "height": 3,
            "backgroundColor": "#2F5BFA"
        }
    }}, [])
    const renderTabBar = useCallback<(props: MaterialTopTabBarProps) => React.ReactElement>(
        (props) => (
            <Animated.View style={tabBarStyle}>
                <TabBar  onIndexChange={setTabIndex} {...props} />
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
        }
    });


    const collapsedOverlayStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            styles.collapsedOvarlay,
            collapsedOverlayAnimatedStyle,
            {height: heightCollapsed},
        ],
        [collapsedOverlayAnimatedStyle, heightCollapsed]
    );
    const headerContainerMergeStyle = useMemo(() => [styles1.rect, styles1.horizontal, {
        backgroundColor: ((isMobile && !(Platform?.isPad || isTablet()))) ? "#041B6E" : "#fff",
        ...Platform.select({
            native: {
                paddingTop: 40,
            },
            web: {
                paddingTop: 10,
            }
        })
    },], [isMobile,Platform?.isPad, isTablet()])

    const containerMergeStyle = useMemo(() => [styles1.container, styles1.shadow, {
        flexBasis: (
            (
                isMobile && !(
                    Platform?.isPad || isTablet())) || dimensions?.width < 768 || (
                (
                    Platform?.isPad || isTablet()) && !isLandscapeSync())) ? "100%" : 466,
        flexGrow: 0,
        flexShrink: 0
    }], [isMobile,Platform?.isPad, isTablet(), isLandscapeSync()])
    const activityMergeStyle = useMemo(() => [styles1.activity,  {
        color: (
            isMobile && !(
                Platform?.isPad || isTablet())) || dimensions?.width < 768 ? "rgba(255,255,255,1)" : primaryColor,
    }], [Platform?.isPad, isMobile, isTablet(), dimensions?.width])

    return (
        <>
            <StatusBar barStyle={'light-content'}/>
            <View style={{flex: 1, backgroundColor: primaryColor,}}>
                <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
                    <View style={containerMergeStyle}>

                        <Animated.View onLayout={handleHeaderLayout} style={headerContainerStyle}>
                            <View onLayout={onLayoutComponent}>
                                <Animated.View style={headerContainerMergeStyle}>

                                    {(
                                            (
                                                isMobile && !(
                                                    Platform?.isPad || isTablet())) || dimensions?.width < 768) &&
                                        <TouchableOpacity
                                            onPress={() => props.navigation.navigate('Settings')/*openDrawer()*/}>
                                            <HomeMenuIcon height={fontValue(24)} width={fontValue(24)}/>
                                        </TouchableOpacity>}

                                    <Text
                                        style={activityMergeStyle}>{(
                                        isMobile && !(
                                            Platform?.isPad || isTablet())) || dimensions?.width < 768 ? `Activity` : `Feed`}</Text>
                                    <View style={{flex: 1}}/>
                                    <TouchableOpacity onPress={() => {
                                        dispatch(setVisible(true))
                                    }

                                    }>

                                        <Filter pressed={visible} width={fontValue(Platform.OS == "web" ? 26 : 18)}
                                                height={fontValue(Platform.OS == "web" ? 26 : 18)}/>
                                    </TouchableOpacity>
                                    {
                                        <TouchableOpacity onPress={onRefresh}>
                                            {(
                                                !(
                                                    isMobile && !(
                                                        Platform?.isPad || isTablet())) && dimensions?.width > 768) ?
                                                <RefreshWeb style={{paddingLeft: 15}} width={fontValue(26)}
                                                            height={fontValue(24)} fill={"#fff"}/> :
                                                <View style={{paddingLeft: 23}}><RefreshRN/></View>}
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
                                            snapToInterval={sizeComponent?.width || dimensions?.width}
                                            decelerationRate={0}
                                            keyExtractor={(item: any) => item._id}
                                            renderItem={({item}) => (
                                                <MeetingNotif
                                                    style={{
                                                        ...Platform.select({
                                                            native: {
                                                                width: sizeComponent?.width || dimensions?.width
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

                        <Animated.View style={collapsedOverlayStyle}>
                            <View>
                                {
                                    !!lodash.size(meetingList) && (
                                        <FlatList
                                            data={meetingList}
                                            bounces={false}
                                            horizontal
                                            showsHorizontalScrollIndicator={false}
                                            snapToInterval={sizeComponent?.width || dimensions?.width}
                                            decelerationRate={0}
                                            keyExtractor={(item: any) => item._id}
                                            renderItem={({item}) => (
                                                <MeetingNotif
                                                    style={{
                                                        ...Platform.select({
                                                            native: {
                                                                width: sizeComponent?.width || dimensions?.width
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
                        <Tab.Navigator  screenOptions={tabBarOptions} tabBar={renderTabBar}>
                            <Tab.Screen name="All">{renderAllActivities}</Tab.Screen>
                            <Tab.Screen name="Pending">{renderPending}</Tab.Screen>
                            <Tab.Screen name="History">{renderHistory}</Tab.Screen>
                        </Tab.Navigator>

                    </View>
                    {
                        lodash.isEmpty(applicationItem) && dimensions?.width > 768  && Platform.OS == "web" ?
                            <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                                <NoActivity/>
                                <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                                    selected</Text>


                            </View> : <></>
                    }


                    {(
                        (!lodash.isEmpty(applicationItem)) && Platform.OS == "web") && <View style={{flex: 1}}>
                        <ItemMoreModal details={applicationItem} visible={moreModalVisible} onDismissed={() => {
                            onMoreModalDismissed(applicationItem?.isOpen)
                        }}/>
                        <ActivityModal updateModal={updateModalFn}
                                       readFn={unReadReadApplicationFn}
                                       onChangeEvent={onChangeEvent}
                                       onChangeAssignedId={onChangeAssignedId}
                                       visible={modalVisible}
                                       onDismissed={onDismissedModal}/>
                    </View>}
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

export default memo(ActivitiesPage);

