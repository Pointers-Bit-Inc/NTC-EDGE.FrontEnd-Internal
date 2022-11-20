import {createMaterialTopTabNavigator, MaterialTopTabBarProps,} from "@react-navigation/material-top-tabs";

import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    Animated as RNAnimated,
    Dimensions,
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
    ViewStyle
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
import {errorColor, infoColor, primaryColor} from "@styles/color";
import RefreshWeb from "@assets/svg/refreshWeb";
import {MeetingNotif} from '@components/molecules/list-item';
import {
    setApplicationItem, setApplications,
    setCalendarVisible,
    setDateEnd,
    setDateStart,
    setEdit,
    setHasChange,
    setNotPinnedApplication,
    setPinnedApplication, setPrevDateEnd, setPrevDateStart,
    setSelectedYPos
} from "../../../reducers/application/actions";
import {renderSwiper} from "@pages/activities/swiper";
import ActivityItem from "@pages/activities/activityItem";
import {getChannelName} from "../../../utils/formatting";
import FakeSearchBar from "@pages/activities/fakeSearchBar";
import {ACTIVITYITEM, SEARCH, SEARCHMOBILE} from "../../../reducers/activity/initialstate";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ActivityModal from "@pages/activities/modal";
import NoActivity from "@assets/svg/noActivity";
import listEmpty from "./listEmpty";
import ApplicationList from "@pages/activities/applicationList";
import RefreshRN from "@assets/svg/refreshRN";
import useMemoizedFn from "../../../hooks/useMemoizedFn";
import ListHeaderComponent from "@pages/activities/listHeaderComponent";
import {Bold, Regular} from "@styles/font";
import CalendarIcon from "@assets/svg/calendarIcon";
import CalendarView from "@pages/schedule/CalendarView";
import modalStyle from "@styles/modal";
import CalendarPicker from 'react-native-calendar-picker';
import CloseIcon from "@assets/svg/close";
import {SuccessButton} from "@atoms/button/successButton";
import {DeclineButton} from "@atoms/button/errorButton";
import hairlineWidth = StyleSheet.hairlineWidth;
import moment from "moment";
import {HttpTransportType, HubConnection, HubConnectionBuilder} from "@microsoft/signalr";
import {BASE_URL} from "../../../services/config";
import useApplicationSignalr from "../../../hooks/useApplicationSignalr";
import Badge from "@atoms/badge";

const OVERLAY_VISIBILITY_OFFSET = 32;
const Tab = createMaterialTopTabNavigator();



const ActivitiesPage = (props) => {
    const dimensions = useWindowDimensions();
    const Filter = (
        isMobile && !(
            Platform?.isPad || isTablet()))  ? FilterIcon : FilterPressIcon;
    const {
        fnApplications,
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
        scrollViewRef, yPos, setYPos,
        countRefresh,
        updateModal,
        calendarVisible,
        dateStart,
        dateEnd,
        prevDateStart,
        prevDateEnd,
        infiniteLoad
    } = useActivities(props);

    const realtimecounts = useSelector((state: RootStateOrAny) => state.application.realtimecounts);
    const {
        initSignalR,
        destroySignalR,
        onConnection,
        onAddApplication,
        onDeleteApplication,
    } = useApplicationSignalr();


    useEffect(() => {
        initSignalR();
        onConnection('OnAddApplication', onAddApplication);
        onConnection('OnDeleteApplication', onDeleteApplication);
        return () => destroySignalR();
    }, []);




    const normalizeActiveMeetings = useSelector((state: RootStateOrAny) => state.meeting.normalizeActiveMeetings);
    const applicationItemId = useSelector((state: RootStateOrAny) => state.application.applicationItemId);

    const feedVisible = useSelector((state: RootStateOrAny) => state.activity.feedVisible);


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
        // transform: [{translateY: translateY.value}],
    }));

    const headerAnimatedStyle = useAnimatedStyle(() => {

        return {};
    })

    const contentContainerStyle = useMemo<StyleProp<ViewStyle>>(
        () => ({}),
        [rendered, headerHeight, bottom, screenHeight, headerDiff]
    );

    const sharedProps = useMemo<Partial<FlatListProps<Connection>>>(
        () => ({
            // contentContainerStyle,

            // scrollIndicatorInsets: {top: heightExpanded},
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

                selected={Platform?.OS == "web" ? act?.item?._id : false}
                currentUser={user}
                role={user?.role?.key}
                searchQuery={searchTerm}
                activity={act?.item}
                isPinned={true}
                onPressUser={(event: any) => {
                    /*unReadReadApplicationFn(act?._id, false, true, (action: any) => {
                    })*/
                    dispatch(setEdit(false))
                    dispatch(setHasChange(false))
                    dispatch(setApplicationItem({...act?.item, isOpen: `pin${i}${index}${ act?.item?._id}`}));
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

                }} index={`pin${i}${index}${ act?.item?._id}`}
                swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, act?.item, unReadReadApplicationFn)}/>
    }, [countRefresh, updateModal, user._id])

    const listHeaderComponent = () => <ListHeaderComponent searchVisible={searchVisible} pnApplications={pnApplications}
                                                           containerHeight={fontValue(containerHeight)}
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

                                                           }} ref={scrollViewRef}
                                                           callbackfn={(item: any, index: number) => {
                                                               return item?.activity && <FlatList
                                                                   scrollEventThrottle={16}
                                                                   refreshing={true}
                                                                   key={index}
                                                                   nestedScrollEnabled={true}
                                                                   listKey={(item, index) => `_key${index.toString()}`}
                                                                   showsVerticalScrollIndicator={false}
                                                                   data={item?.activity}
                                                                   renderItem={(act, i) => {
                                                                       return getRenderItem(act, i, index)
                                                                   }
                                                                   }
                                                                   keyExtractor={(item, index) => `_key${index.toString()}`}
                                                               />
                                                           }}/>;

    const  renderItem = useCallback(({item, index}) => (
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
                                    isOpen: `${index}${i}${ activity?._id}`
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

                            index={`${index}${i}${ activity?._id}`}
                            swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, activity, unReadReadApplicationFn)}/>
                    )
                }}/>
        </>
    ), [countRefresh, updateModal, user._id, refreshing]);
    const onEndReached = () => {
        handleLoad();
        setOnEndReachedCalledDuringMomentum(true);
    }

    const listEmptyComponent = useMemoizedFn(() => listEmpty(refreshing , searchTerm, (tabIndex == 0) ? notPnApplications.length + pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
        act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length : tabIndex == 1 ? pnApplications?.map((item: any, index: number) => item?.activity && item?.activity?.map((act: any, i: number) => (
        act?.assignedPersonnel?._id || act?.assignedPersonnel) == user?._id)).length : notPnApplications.length));
    const listEmptyUnassigned = useMemoizedFn(() => listEmpty(refreshing , searchTerm, notPnApplications.length));
    const listEmptyAssigned = useMemoizedFn(() => listEmpty(refreshing , searchTerm, pnApplications.length));

    const renderAllActivities = useCallback(
        () => <FlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }

            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyComponent}
            ListHeaderComponent={listHeaderComponent()}
            data={notPnApplications}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={bottomLoader}
            onEndReached={onEndReached}
            ref={allRef}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [notPnApplications, pnApplications, refreshing, infiniteLoad]
    );


    const renderPending = useCallback(
        () => <FlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }

            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyAssigned}
            data={pnApplications}
            keyExtractor={(item, index) => {
                return item?.data + index.toString()
            }}
            ListFooterComponent={bottomLoader}
            onEndReached={onEndReached}
            ref={pendingRef}
            // onScroll={pendingScrollHandler}
            estimatedItemSize={300}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [pnApplications, refreshing, infiniteLoad]
    );

    const renderHistory = useCallback(
        () => <FlatList
            refreshControl={
                <RefreshControl
                    tintColor={primaryColor} // ios
                    progressBackgroundColor={infoColor} // android
                    colors={['white']} // android
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                />
            }
            //estimatedItemSize={300}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled={true}
            ListEmptyComponent={listEmptyUnassigned}
            data={notPnApplications}
            keyExtractor={(item, index) => index.toString()}

            ListFooterComponent={bottomLoader}
            onEndReached={onEndReached}
            ref={historyRef}
            //onScroll={historyScrollHandler}
            onEndReachedThreshold={0.5}
            onMomentumScrollBegin={() => {
                //onMomentumScrollBegin();
                setOnEndReachedCalledDuringMomentum(false)
            }}
            renderItem={renderItem}/>,
        [notPnApplications, refreshing, infiniteLoad]
    );
    const tabBarStyle = useMemo<StyleProp<ViewStyle>>(
        () => [
            //rendered ? styles.tabBarContainer : undefined,
            //{top: rendered ? headerHeight : undefined},
            tabBarAnimatedStyle,
        ],
        [rendered, headerHeight, tabBarAnimatedStyle]
    );
    const tabBarOptions = useMemo(() => {
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
        }
    }, [])
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
            //rendered ? styles.headerContainer : undefined,

            // headerAnimatedStyle,
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
        () => [],
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
    },], [isMobile, Platform?.isPad, isTablet()])

    const containerMergeStyle = useMemo(() => [styles1.container, styles1.shadow, isMobile ? {
        flex: 1,
    } : {
        overflow: "auto",
        flexBasis: (
            (
                isMobile && !(
                    Platform?.isPad || isTablet())) || dimensions?.width < 768 || (
                (
                    Platform?.isPad || isTablet()) && !isLandscapeSync())) ? "100%" : (feedVisible ? 466 : 0),
        flexGrow: 0,
        flexShrink: 0
    }], [isMobile, Platform?.isPad, isTablet(), isLandscapeSync(), feedVisible])
    const activityMergeStyle = useMemo(() => [styles1.activity, {
        color: (
            isMobile && !(
                Platform?.isPad || isTablet())) ? "rgba(255,255,255,1)" : primaryColor,
    }], [Platform?.isPad, isMobile, isTablet(), dimensions?.width,])

    const [animation] = useState(() => new RNAnimated.Value(0));

    const background = animation.interpolate({
        inputRange: [0, 0.2, 1.8, 2],
        outputRange: [
            'rgba(0,0,0,0)',
            'rgba(0,0,0,.3)',
            'rgba(0,0,0,.3)',
            'rgba(0,0,0,0)',
        ],
        extrapolate: 'clamp',
    });

    const display = animation.interpolate({
        inputRange: [0.2, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const {height} = Dimensions.get('window');

    const success = animation.interpolate({
        inputRange: [1.1, 2],
        outputRange: [0, -height],
        extrapolate: 'clamp',
    });


    const onDateChange = (date, type) => {
        if (type === 'END_DATE') {
            let _date = date?.set({"hour": 23, "minute": 59, "second": 59})
            dispatch(setDateEnd(_date));
        } else {
            let _date = date?.set({"hour": 0, "minute": 0})
            dispatch(setDateEnd(null));
            dispatch(setDateStart(_date));
        }
    }

    const calendarPress = () => {
        dispatch(setPrevDateEnd(dateEnd));
        dispatch(setPrevDateStart(dateStart));
        if(!(dateEnd && dateStart)){
            let _dateEnd = moment()?.set({"hour": 23, "minute": 59, "second": 59})
            let _dateStart = moment()?.set({"hour": 0, "minute": 0})
            dispatch(setDateEnd(_dateEnd));
            dispatch(setDateStart(_dateStart));
        }
        dispatch(setCalendarVisible(true))

        RNAnimated.spring(animation, {
            toValue: 1,
            useNativeDriver: false,
        }).start();
    }
    return (
        <>
            <StatusBar barStyle={'light-content'}/>

            <View style={{flex: 1, backgroundColor: primaryColor,}}>
                <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>

                    <View style={containerMergeStyle}>

                        <View onLayout={handleHeaderLayout} style={headerContainerStyle}>
                            <View onLayout={onLayoutComponent}>
                                <View style={headerContainerMergeStyle}>

                                    {(
                                            (
                                                isMobile && !(
                                                    Platform?.isPad || isTablet()))) &&
                                        <TouchableOpacity
                                            onPress={() => props.navigation.navigate('Settings')/*openDrawer()*/}>
                                            <HomeMenuIcon height={fontValue(24)} width={fontValue(24)}/>
                                        </TouchableOpacity>}

                                    <Text
                                        style={activityMergeStyle}>{(
                                        isMobile && !(
                                            Platform?.isPad || isTablet()))? `Activity` : `Feed`}</Text>
                                    <View style={{flex: 1, justifyContent: "center"}}/>
                                    <View style={{paddingHorizontal: 15}}>
                                        <TouchableOpacity onPress={calendarPress}>
                                            <CalendarIcon color={(Platform.OS == "web" || Platform.isPad)? "#4E4B66"  :"white"} pressed={visible} width={fontValue(Platform.OS == "web" || Platform.isPad ? 26 : 23)}
                                                          height={fontValue(Platform.OS == "web" || Platform.isPad ? 20 : 23)}/>
                                        </TouchableOpacity>
                                    </View>

                                    <TouchableOpacity onPress={() => {
                                        dispatch(setVisible(true))
                                    }

                                    }>
                                        <Filter pressed={visible} width={fontValue(Platform.OS == "web" || Platform.isPad ? 30 : 21)}
                                                height={fontValue(Platform.OS == "web" || Platform.isPad ? 30 : 21)}/>
                                    </TouchableOpacity>
                                    {
                                        <TouchableOpacity onPress={onRefresh}>

                                            {Platform.OS == "web" || Platform.isPad ?
                                                <RefreshWeb style={{paddingLeft: 15}} width={fontValue(24)}
                                                            height={fontValue(24)} fill={"#fff"}/> :
                                                <View style={{paddingLeft: 15}}><RefreshRN/></View>}
                                        </TouchableOpacity>
                                    }
                                </View>
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
                            {calendarVisible ? <View style={styles.calendarView}>
                                <View style={{padding: 10}}>
                                    <Text style={{fontSize: 16, fontFamily: Bold}}>Date Filter: </Text>
                                </View>
                                <CalendarView onPress={()=> dispatch(setCalendarVisible(true))}
                                              isCloseable={true}
                                              onCloseable={() => {
                                                  dispatch(setDateEnd(null));
                                                  dispatch(setDateStart(null));
                                                  dispatch(setCalendarVisible(!calendarVisible))
                                                  onRefresh()
                                              }}
                                              startDate={dateStart}
                                              endDate={dateEnd}
                                              onPress1={props.onPress1}/>
                            </View> : <></>}
                        </View>


                        {user?.role?.permission?.tabPermission?.all || user?.role?.permission?.tabPermission?.pending || user?.role?.permission?.tabPermission?.history ?
                            <Tab.Navigator screenOptions={tabBarOptions}>
                                {user?.role?.permission?.tabPermission?.all ?
                                    <Tab.Screen name="All">{renderAllActivities}</Tab.Screen> : null}
                                {user?.role?.permission?.tabPermission?.pending ?
                                    <Tab.Screen options={{

                                        tabBarBadge: () => <Badge  text={realtimecounts}>
                                        </Badge>
                                    }} name="Pending">{renderPending}</Tab.Screen> : null}
                                {user?.role?.permission?.tabPermission?.history ?
                                    <Tab.Screen name="History">{renderHistory}</Tab.Screen> : null}
                            </Tab.Navigator> : <></>}

                    </View>
                    {
                        lodash.isEmpty(applicationItem) && dimensions?.width > 768 && Platform.OS == "web" ?
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
                        <ActivityModal nav={props?.navigation} updateModal={updateModalFn}
                                       readFn={unReadReadApplicationFn}
                                       onChangeEvent={onChangeEvent}
                                       onChangeAssignedId={onChangeAssignedId}
                                       visible={modalVisible}
                                       onDismissed={onDismissedModal}/>
                    </View>}

                </View>

            </View>

            {calendarVisible ? <RNAnimated.View
                pointerEvents="box-none"
                style={[
                    {
                        backgroundColor: background,
                    },
                    modalStyle.background,

                ]}>
                <RNAnimated.View
                    style={[
                        modalStyle.background,
                        {
                            transform: [{scale: display}, {translateY: success}],
                        },
                    ]}>
                    <View style={modalStyle.wrap}>
                        <View style={modalStyle.modalHeader} />


                        <CalendarPicker
                            maxDate={new Date()}
                            allowBackwardRangeSelect={true}
                            width={isMobile? dimensions.width * 0.8 : dimensions.width * 0.3}
                            height={dimensions.height * 0.8}
                            headerWrapperStyle={!isMobile ? {width: "100%"} : {}}
                            startFromMonday={true}
                            allowRangeSelection={true}

                            selectedStartDate={dateStart}
                            selectedEndDate={dateEnd}
                            selectedDayColor={infoColor}
                            selectedDayTextColor="#FFFFFF"
                            onDateChange={onDateChange}
                        />
                        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10}}>
                            <View style={{flex: 0.9, paddingHorizontal: 10}}>
                                <DeclineButton onPress={() => {

                                    if(!(dateStart && dateEnd)){
                                        dispatch(setCalendarVisible(!calendarVisible))
                                    }
                                    dispatch(setDateEnd(prevDateEnd));
                                    dispatch(setDateStart(prevDateStart));

                                    if(!(prevDateEnd && prevDateStart)){
                                        dispatch(setCalendarVisible(false))
                                    }

                                    RNAnimated.spring(animation, {
                                        toValue: 0,
                                        useNativeDriver: false,
                                    }).start();
                                }} name={"Cancel"}/>
                            </View>
                            <View style={{flex: 0.9,  paddingHorizontal: 10}}>
                                <SuccessButton disabled={!(dateStart && dateEnd)} onPress={()=>{
                                    onRefresh()
                                    RNAnimated.spring(animation, {
                                        toValue: 0,
                                        useNativeDriver: false,
                                    }).start();

                                }} name={"Confirm"}/>
                            </View>

                        </View>

                    </View>
                </RNAnimated.View>
            </RNAnimated.View> : <></>}


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
    }, calendarView: { backgroundColor: "rgba(255,255,255,1)",
        ...Platform.select({
            native: {
                height: undefined,
                paddingHorizontal: 30,
                paddingVertical: 10
            },
            default: {

                height: undefined,
                paddingHorizontal: 30,
                paddingBottom: 21,
                borderBottomWidth: hairlineWidth,
                borderBottomColor: "#EFEFEF"
            }
        })}

});




export default memo(ActivitiesPage);

