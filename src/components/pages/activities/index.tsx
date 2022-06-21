import React, {useEffect, useMemo, useRef, useState} from "react";
import {
    Animated,
    FlatList,
    PanResponder,
    Platform,
    Easing, SafeAreaView, ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View, ActivityIndicator, RefreshControl
} from "react-native";

import {SEARCH, SEARCHMOBILE} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useSelector} from "react-redux";
import {
    setApplicationItem,
    setNotPinnedApplication,
    setPinnedApplication,
    setSelectedYPos
} from "../../../reducers/application/actions";
import ActivityModal from "@pages/activities/modal";
import FilterIcon from "@assets/svg/filterIcon";
import {ActivityItem} from "@pages/activities/activityItem";
import {renderSwiper} from "@pages/activities/swiper";
import {setVisible} from "../../../reducers/activity/actions";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ApplicationList from "@pages/activities/applicationList";
import {getChannelName} from 'src/utils/formatting';
import lodash from 'lodash';
import {
    removeActiveMeeting,
    resetCurrentMeeting,
    setActiveMeetings,
    setMeeting,
    setOptions,
} from 'src/reducers/meeting/actions';
import {setSelectedChannel} from 'src/reducers/channel/actions';
import {MeetingNotif} from '@components/molecules/list-item';
import HomeMenuIcon from "@assets/svg/homemenu";
import {FakeSearchBar} from "@pages/activities/fakeSearchBar";
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
import {isLandscapeSync, isTablet} from "react-native-device-info";
import {openUrl} from "src/utils/web-actions";

import {TabBar, TabView} from 'react-native-tab-view';
import {Regular500} from "@styles/font";

import {PanGestureHandler, State} from 'react-native-gesture-handler';
import PullToRefresh from "@pages/activities/pull-to-refresh/PullToRefresh";
import listEmpty from "./listEmpty";

export default function ActivitiesPage(props: any) {

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
        /*
        onMomentumScrollBegin,
        onMomentumScrollEnd,
        onScrollEndDrag,*/
        headerTranslate,
        opacity,
        activitySizeComponent,
        scrollViewRef, yPos, setYPos,
        flatListViewRef,
        setRefreshing,
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
    const windowHeight = dimensions.height;
    const windowWidth = dimensions.width;
    const TabBarHeight = 48;
    const HeaderHeight = containerHeight;
    const SafeStatusBar = Platform.select({
        ios: 44,
        android: StatusBar.currentHeight,
    });

    /**
     * stats
     */
    const [tabIndex, setIndex] = useState(0);
    const [routes] = useState([
        {key: 'tab0', title: 'All'},
        {key: 'tab1', title: 'Pending'},
        {key: 'tab2', title: 'History'},
    ]);
    const [canScroll, setCanScroll] = useState(true);

    /**
     * ref
     */
    const headerScrollY = useRef(new Animated.Value(0)).current;
    const listRefArr = useRef([]);
    const listOffset = useRef({});
    const isListGliding = useRef(false);
    const headerScrollStart = useRef(0);
    const _tabIndex = useRef(0);

    /**
     * PanResponder for header
     */
    const headerPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onStartShouldSetPanResponder: (evt, gestureState) => {
                headerScrollY.stopAnimation();
                syncScrollOffset();
                return false;
            },

            onMoveShouldSetPanResponder: (evt, gestureState) => {
                headerScrollY.stopAnimation();
                return Math.abs(gestureState.dy) > 5;
            },

            onPanResponderRelease: (evt, gestureState) => {
                syncScrollOffset();
                if (Math.abs(gestureState.vy) < 0.2) {
                    return;
                }
                headerScrollY.setValue(scrollY._value);
                Animated.decay(headerScrollY, {
                    velocity: -gestureState.vy,
                    useNativeDriver: true,
                }).start(() => {
                    syncScrollOffset();
                });
            },
            onPanResponderMove: (evt, gestureState) => {
                listRefArr.current.forEach((item) => {
                    if (item.key !== routes[_tabIndex.current].key) {
                        return;
                    }
                    if (item.value) {
                        item.value.scrollToOffset({
                            offset: -gestureState.dy + headerScrollStart.current,
                            animated: false,
                        });
                    }
                });
            },
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                headerScrollStart.current = scrollY._value;
            },
        }),
    ).current;

    /**
     * PanResponder for list in tab scene
     */
    const listPanResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
            onStartShouldSetPanResponder: (evt, gestureState) => false,
            onMoveShouldSetPanResponder: (evt, gestureState) => {
                headerScrollY.stopAnimation();
                return false;
            },
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                headerScrollY.stopAnimation();
            },
        }),
    ).current;

    /**
     * effect
     */
    useEffect(() => {
        scrollY.addListener(({value}) => {
            const curRoute = routes[tabIndex].key;
            listOffset.current[curRoute] = value;
        });

        headerScrollY.addListener(({value}) => {
            listRefArr.current.forEach((item) => {
                if (item.key !== routes[tabIndex].key) {
                    return;
                }
                if (value > HeaderHeight || value < 0) {
                    headerScrollY.stopAnimation();
                    syncScrollOffset();
                }
                if (item.value && value <= HeaderHeight) {
                    item.value.scrollToOffset({
                        offset: value,
                        animated: false,
                    });
                }
            });
        });
        return () => {
            scrollY.removeAllListeners();
            headerScrollY.removeAllListeners();
        };
    }, [routes, tabIndex]);

    /**
     *  helper functions
     */
    const syncScrollOffset = () => {
        const curRouteKey = routes[_tabIndex.current].key;

        listRefArr.current.forEach((item) => {
            if (item.key !== curRouteKey) {
                if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
                    if (item.value) {
                        item.value.scrollToOffset({
                            offset: scrollY._value,
                            animated: false,
                        });
                        listOffset.current[item.key] = scrollY._value;
                    }
                } else if (scrollY._value >= HeaderHeight) {
                    if (
                        listOffset.current[item.key] < HeaderHeight ||
                        listOffset.current[item.key] == null
                    ) {
                        if (item.value) {
                            item.value.scrollToOffset({
                                offset: HeaderHeight,
                                animated: false,
                            });
                            listOffset.current[item.key] = HeaderHeight;
                        }
                    }
                }
            }
        });
    };

    const onMomentumScrollBegin = () => {
        isListGliding.current = true;
        setOnEndReachedCalledDuringMomentum(false)
    };

    const onMomentumScrollEnd = () => {
        isListGliding.current = false;
        syncScrollOffset();
    };

    const onScrollEndDrag = () => {
        syncScrollOffset();
    };

    /**
     * render Helper
     */
    const renderHeader = () => {
        const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [0, -HeaderHeight],
            extrapolate: 'clamp',
        });
        return (
            <>
                <View onLayout={onLayoutComponent}
                      style={[styles.group, {position: "absolute"}]}>
                    <Animated.View style={[styles.rect, styles.horizontal, {
                        backgroundColor: ((isMobile && !(Platform?.isPad || isTablet()))) ? "#041B6E" : "#fff",

                    }, {
                        ...{opacity},
                        transform: [{translateY: headerTranslate}]
                    }]}>

                        {(
                                (
                                    isMobile && !(
                                        Platform?.isPad || isTablet())) || dimensions?.width < 768) &&
                            <TouchableOpacity onPress={() => props.navigation.navigate('Settings')/*openDrawer()*/}>
                                <HomeMenuIcon height={fontValue(24)} width={fontValue(24)}/>
                            </TouchableOpacity>}

                        <Text
                            style={[styles.activity, {
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
                        {(
                                !(
                                    isMobile && !(
                                        Platform?.isPad || isTablet())) && dimensions?.width > 768) &&
                            <TouchableOpacity onPress={onRefresh}>
                                <RefreshWeb style={{paddingLeft: 15}} width={fontValue(26)}
                                            height={fontValue(24)} fill={"#fff"}/>
                            </TouchableOpacity>
                        }
                    </Animated.View>

                </View>

                <FakeSearchBar onSearchLayoutComponent={onSearchLayoutComponent}
                               animated={{
                                   ...{opacity},
                                   top: sizeComponent?.height || (isMobile ? 80 : 57) * (
                                       1 + lodash.size(meetingList)),
                                   elevation: 10,
                                   zIndex: 10,
                                   position: "absolute",
                                   transform: [{translateY: headerTranslate}]
                               }} onPress={() => {

                    //setSearchVisible(true)
                    dispatch(setApplicationItem({}));

                    props.navigation.navigate(isMobile ? SEARCHMOBILE : SEARCH);
                }} searchVisible={searchVisible}/>

            </>

        );
    };
    const listHeaderComponent = () => <>
        {!searchVisible && !!pnApplications?.length && containerHeight &&
            <View style={[styles.pinnedActivityContainer, {
                marginBottom: 5,
                paddingBottom: 20,
                backgroundColor: "#fff"
            }]}>
                {!!pnApplications?.length &&
                    <View style={[styles.pinnedgroup, {height: undefined}]}>
                        <View style={[styles.pinnedcontainer, {paddingVertical: 10}]}>
                            <Text style={[styles.pinnedActivity, {fontFamily: Regular500,}]}>Pinned
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
    const renderLabel = ({route, focused}) => {
        return (
            <Text style={[styles1.label, {opacity: focused ? 1 : 0.5}]}>
                {route.title}
            </Text>
        );
    };

    const renderScene = ({route}) => {

        const focused = route.key === routes[tabIndex].key;
        let numCols;
        let data, header = false;
        let renderItem;
        switch (route.key) {
            case 'tab0':
                data = notPnApplications;
                header = true
                break;
            case 'tab1':
                data = pnApplications;
                header = false
                break;
            case 'tab2':
                data = notPnApplications;
                header = false;
                break;
            default:
                return null;
        }

        return (
            <>
                <PullToRefresh offset={HeaderHeight + TabBarHeight + (!!lodash.size(meetingList) && 80)}
                               refreshing={refreshing} onRefresh={onRefresh}>
                    <Animated.FlatList
                        // scrollEnabled={canScroll}
                        {...listPanResponder.panHandlers}
                        ref={(ref) => {
                            if (ref) {
                                const found = listRefArr.current.find((e) => e.key === route.key);
                                if (!found) {
                                    listRefArr.current.push({
                                        key: route.key,
                                        value: ref,
                                    });
                                }
                            }
                        }}
                        scrollEventThrottle={16}
                        onScroll={
                            focused ? Animated.event(
                                [
                                    {
                                        nativeEvent: {contentOffset: {y: scrollY}},
                                    },
                                ],
                                {useNativeDriver: true},
                            ) : null
                        }
                        ListFooterComponent={refreshing ? <View/> :bottomLoader}
                        onMomentumScrollBegin={onMomentumScrollBegin}
                        onScrollEndDrag={onScrollEndDrag}
                        onMomentumScrollEnd={onMomentumScrollEnd}
                        ListEmptyComponent={()=>listEmpty(refreshing,searchTerm,(
                            notPnApplications.length)+pnApplications?.map((item:any,index:number)=>item?.activity&&item?.activity?.map((act:any,i:number)=>(
                            act?.assignedPersonnel?._id||act?.assignedPersonnel)==user?._id)).length)}
                        ListHeaderComponent={header ? listHeaderComponent() : null}
                        contentContainerStyle={{
                            paddingTop: HeaderHeight + TabBarHeight + (!!lodash.size(meetingList) && 80),
                        }}
                        onEndReached={() => {
                            if (!onEndReachedCalledDuringMomentum || !(
                                isMobile && !(
                                    Platform?.isPad || isTablet()))) {
                                handleLoad();
                                setOnEndReachedCalledDuringMomentum(true);
                            }
                        }}
                        showsHorizontalScrollIndicator={false}
                        data={data}
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

                                            }} index={`${index}${i}`}
                                            swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, activity, unReadReadApplicationFn)}/>
                                    )
                                }}/>
                        )}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </PullToRefresh>

            </>

        );
    };

    const renderTabBar = (props) => {
        const y = scrollY.interpolate({
            inputRange: [0, HeaderHeight],
            outputRange: [HeaderHeight, 0],
            extrapolate: 'clamp',
        });
        return (

            <Animated.View
                style={{
                    top: 0,
                    zIndex: 1,
                    position: 'absolute',
                    transform: [{translateY: headerTranslate}],
                    paddingTop: (containerHeight),
                    width: '100%',
                }}>
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
                <TabBar
                    {...props}
                    onTabPress={({route, preventDefault}) => {
                        if (isListGliding.current) {
                            preventDefault();
                        }
                    }}
                    style={styles1.tab}
                    renderLabel={renderLabel}
                    indicatorStyle={styles1.indicator}
                />
            </Animated.View>

        );
    };

    const renderTabView = () => {
        return (
            <TabView
                onSwipeStart={() => setCanScroll(false)}
                onSwipeEnd={() => setCanScroll(true)}
                onIndexChange={(id) => {
                    _tabIndex.current = id;
                    setIndex(id);
                }}
                navigationState={{index: tabIndex, routes}}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                initialLayout={{
                    height: 0,
                    width: windowWidth,
                }}
            />
        );
    };
    const styles1 = StyleSheet.create({
        container: {
            flex: 1,
        },
        fillParent: {
            backgroundColor: 'transparent',
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0
        },
        header: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            //position: 'absolute',
        },
        label: {fontSize: 16, color: '#222'},
        tab: {
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: '#fff',
            height: TabBarHeight,
        },
        indicator: {backgroundColor: primaryColor},
    });
    return (
        <>
            <StatusBar barStyle={'light-content'}/>
            <SafeAreaView style={{flex: 1, backgroundColor: primaryColor}}>
                <View style={{backgroundColor: "#F8F8F8", flex: 1, flexDirection: "row"}}>
                    <View onLayout={onActivityLayoutComponent} style={[styles.container, styles.shadow, {
                        flexBasis: (
                            (
                                isMobile && !(
                                    Platform?.isPad || isTablet())) || dimensions?.width < 768 || (
                                (
                                    Platform?.isPad || isTablet()) && !isLandscapeSync())) ? "100%" : 466,
                        flexGrow: 0,
                        flexShrink: 0
                    }]}>
                        <View style={styles1.container}>
                            {renderTabView()}
                            {renderHeader()}
                        </View>
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
            </SafeAreaView>
        </>


    );


}
