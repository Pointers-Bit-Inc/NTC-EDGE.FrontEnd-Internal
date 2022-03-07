import React , {Fragment , useCallback , useEffect , useMemo , useRef , useState} from "react";

import {formatDate , getFilter , unreadReadApplication ,} from "@pages/activities/script";
import {
    Alert ,
    Animated ,
    Dimensions ,
    FlatList ,
    RefreshControl ,
    ScrollView ,
    StatusBar ,
    Text ,
    TouchableOpacity ,
    View
} from "react-native";

import {
    APPROVED ,
    DATE_ADDED ,
    DECLINED ,
    FORAPPROVAL ,
    FOREVALUATION ,
    FORVERIFICATION ,
    PAID ,
    PENDING ,
    SEARCH ,
    UNVERIFIED ,
    VERIFIED
} from "../../../reducers/activity/initialstate";
import {RootStateOrAny , useDispatch , useSelector} from "react-redux";
import {
    handleInfiniteLoad , setApplicationItem ,
    setApplications ,
    setNotPinnedApplication ,
    setPinnedApplication
} from "../../../reducers/application/actions";
import ActivityModal from "@pages/activities/modal";
import axios from "axios";
import FilterIcon from "@assets/svg/filterIcon";

import {ActivityItem} from "@pages/activities/activityItem";
import {renderSwiper} from "@pages/activities/swiper";
import {BASE_URL} from "../../../services/config";
import {setVisible} from "../../../reducers/activity/actions";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import moment from "moment";
import ApplicationList from "@pages/activities/applicationList";
import Loader from "@pages/activities/bottomLoad";
import useFirebase from 'src/hooks/useFirebase';
import {getChannelName} from 'src/utils/formatting';
import lodash from 'lodash';
import {removeActiveMeeting , setMeetingId ,} from 'src/reducers/meeting/actions';
import {MeetingNotif} from '@components/molecules/list-item';
import listEmpty from "@pages/activities/listEmpty";
import HomeMenuIcon from "@assets/svg/homemenu";
import {FakeSearchBar} from "@pages/activities/fakeSearchBar";
import {useUserRole} from "@pages/activities/hooks/useUserRole";
import {Regular500} from "@styles/font";
import {useComponentLayout} from "@pages/activities/hooks/useComponentLayout";
import NoActivity from "@assets/svg/noActivity";
import {styles} from "@pages/activities/styles";
import {fontValue} from "@pages/activities/fontValue";
import FilterWeb from "@assets/svg/filterWeb";
import RefreshWeb from "@assets/svg/refreshWeb";
import {primaryColor} from "@styles/color";
import {isMobile} from "@pages/activities/isMobile";

const { width } = Dimensions.get('window');

function ActivityModalView(props) {
    return isMobile ? <>{ props.children }</> : <View style={ { flex : 0.6 } }> { props.children }</View>;
}

const Filter = isMobile ? FilterIcon : FilterWeb;
export default function ActivitiesPage(props: any) {


    const [total , setTotal] = useState(0);
    const [page , setPage] = useState(0);
    const [size , setSize] = useState(0);
    const { user , cashier , director , evaluator , checker , accountant } = useUserRole();
    const [updateModal , setUpdateModal] = useState(false);
    const meetingList = useSelector((state: RootStateOrAny) => {
        const { activeMeetings } = state.meeting;
        const sortedMeeting = lodash.orderBy(activeMeetings , 'updatedAt' , 'desc');
        return sortedMeeting;
    });
    const config = {
        headers : {
            Authorization : "Bearer ".concat(user?.sessionToken)
        }
    };


    const { selectedChangeStatus , visible } = useSelector((state: RootStateOrAny) => state.activity);
    const { pinnedApplications , notPinnedApplications, applicationItem } = useSelector((state: RootStateOrAny) => state.application);
    const dispatch = useDispatch();
    const { userActiveMeetingSubscriber , endMeeting } = useFirebase({
        _id : user._id ,
        name : user.name ,
        firstName : user.firstName ,
        lastName : user.lastName ,
        email : user.email ,
        image : user.image ,
    });

    function getList(list: any , selectedClone) {
        return getFilter({
            list : list ,
            user : user ,
            selectedClone : selectedClone ,
            cashier : cashier ,
            director : director ,
            checker : checker ,
            evaluator : evaluator ,
            accountant : accountant
        });
    }

    const ispinnedApplications = (applications: any) => {

        setTotalPages(Math.ceil(applications?.length / 10));

        const selectedClone = selectedChangeStatus?.filter((status: string) => {
            return status != DATE_ADDED
        });


        const list = getList(applications , selectedClone);


        const groups = list?.reduce((groups: any , activity: any) => {

            if (activity.assignedPersonnel == user?._id) {
                //  isPinned++


            }
            if (!groups[formatDate(activity.createdAt)]) {
                groups[formatDate(activity.createdAt)] = [];
            }

            groups[formatDate(activity.createdAt)].push(activity);
            return groups;
        } , {});


        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date ,
                readableHuman : moment([date]).fromNow() ,
                activity : groups[date] ,
            };
        });
        let a = [] , b = [];
        for (let i = 0; i < groupArrays.length; i++) {
            for (let j = 0; j < groupArrays[i].activity.length; j++) {
                b.push(0)
            }
            a.push({ parentIndex : 0 , child : b });

        }
        if (a) {
            setNumberCollapsed(a)
        }
        return groupArrays.slice(0 , currentPage * 25);
    };
    const [updateUnReadReadApplication , setUpdateUnReadReadApplication] = useState(false);
    const [searchTerm , setSearchTerm] = useState('');
    const [countRefresh , setCountRefresh] = useState(0);
    const [refreshing , setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setCountRefresh(countRefresh + 1)
    } , [countRefresh]);

    const selectedClone = selectedChangeStatus?.filter((status: string) => {
        return status != DATE_ADDED
    });

    const checkDateAdded = selectedChangeStatus?.filter((status: string) => {
        return status == DATE_ADDED
    });
    const query = () => {
        return {
            ...(
                searchTerm && { keyword : searchTerm }) ,
            ...(
                { sort : checkDateAdded.length ? "asc" : "desc" }) ,
            ...(
                selectedClone.length > 0 && {
                    [cashier ? "paymentStatus" : 'status'] : selectedClone.map((item: any) => {
                        if (cashier) {
                            if (item == VERIFIED) {
                                return [PAID , VERIFIED , APPROVED]
                            } else if (item == UNVERIFIED) {
                                return [DECLINED , UNVERIFIED]
                            } else if (item == FORVERIFICATION) {
                                return [PENDING , FORVERIFICATION , FOREVALUATION , FORAPPROVAL].toString()
                            }
                        } else if (item == FOREVALUATION) {
                            return [FOREVALUATION , PENDING , FORAPPROVAL , FORVERIFICATION].toString()
                        }
                        return item
                    }).toString()
                })
        }
    };
    let count = 0;
    const fnApplications = (isCurrent: boolean , callback: (err: any) => void) => {

        setRefreshing(true);
        axios.get(BASE_URL + `/applications` , { ...config , params : query() }).then((response) => {
            if (response?.data?.message) Alert.alert(response.data.message);
            if (isCurrent) setRefreshing(false);
            if (response?.data?.docs?.length) callback(true);


            if (count == 0) {
                count = 1;
                if (count) {
                    response?.data?.size ? setSize(response?.data?.size) : setSize(0);
                    response?.data?.total ? setTotal(response?.data?.total) : setTotal(0);
                    response?.data?.page ? setPage(response?.data?.page) : setPage(0);
                    dispatch(setApplications({ data : response?.data , user : user }))
                }
            }
            if (isCurrent) setRefreshing(false);
        }).catch((err) => {
            setRefreshing(false);
            Alert.alert('Alert' , err?.message || 'Something went wrong.');

            callback(false);
            console.warn(err)
        })
    };
    useEffect(() => {

        let isCurrent = true;
        dispatch(setNotPinnedApplication([]));
        dispatch(setPinnedApplication([]));
        fnApplications(isCurrent , () => {
        });
        return () => {
            isCurrent = false
        }
    } , [selectedChangeStatus.length]);

    useEffect(() => {
        let isCurrent = true;
        dispatch(setNotPinnedApplication([]));
        dispatch(setPinnedApplication([]));
        fnApplications(isCurrent , () => {
        });
        return () => {
            isCurrent = false
        }
    } , [countRefresh , searchTerm ,]);


    const [currentPage , setCurrentPage] = useState(1);
    const [perPage , setPerPage] = useState(25);
    const [offset , setOffset] = useState((
        currentPage - 1) * perPage);
    const [totalPages , setTotalPages] = useState(0);
    const [numberCollapsed , setNumberCollapsed] = useState<{ parentIndex: number, child: number[] }[]>([]);

    const [searchVisible , setSearchVisible] = useState(false);

    const pnApplications = useMemo(() => {

        setUpdateUnReadReadApplication(false);
        return ispinnedApplications(pinnedApplications)
    } , [updateUnReadReadApplication , updateModal , searchTerm , selectedChangeStatus?.length , pinnedApplications?.length , currentPage]);

    const notPnApplications = useMemo(() => {
        console.log("update props?.details?.assignedPersonnel:");
        setUpdateUnReadReadApplication(false);
        return ispinnedApplications(notPinnedApplications)
    } , [updateUnReadReadApplication , updateModal , searchTerm , selectedChangeStatus?.length , notPinnedApplications?.length , currentPage]);

    const userPress = (index: number) => {
        let newArr = [...numberCollapsed];
        newArr[index].parentIndex = newArr[index].parentIndex ? 0 : 1;
        setNumberCollapsed(newArr)
    };
    const userPressActivityModal = (index: number , i: number) => {
        let newArr = [...numberCollapsed];
        newArr[index].child[i] = newArr[index].child[i] ? 0 : 1;
        setNumberCollapsed(newArr)
    };
    const [modalVisible , setModalVisible] = useState(false);
    const [moreModalVisible , setMoreModalVisible] = useState(false);
    const onDismissed = () => {
        setModalVisible(false)
    };

    const initialMove = new Animated.Value(-400);
    const endMove = 400;
    const duration = 1000;
    const [loadingAnimation , setLoadingAnimation] = useState(false);
    const loadingAnimate = () => {

        Animated.timing(initialMove , {
            toValue : endMove ,
            duration : duration ,
            useNativeDriver : true ,
        }).start((o) => {
            if (o.finished) {
                initialMove.setValue(-400);
                if (loadingAnimation) {
                    loadingAnimate()
                }

            }
        })
    };
    const [infiniteLoad , setInfiniteLoad] = useState(false);
    const [onEndReachedCalledDuringMomentum , setOnEndReachedCalledDuringMomentum] = useState(false);
    const bottomLoader = () => {
        return infiniteLoad ? <Loader/> : null
    };

    // useEffect(() => {
    //     let unMount = false;
    //     const unsubscriber = userActiveMeetingSubscriber((querySnapshot: FirebaseFirestoreTypes.QuerySnapshot) => {
    //         if (!unMount) {
    //             querySnapshot.docChanges().forEach((change: any) => {
    //                 const data = change.doc.data();
    //                 data._id = change.doc.id;
    //                 switch (change.type) {
    //                     case 'added': {
    //                         const hasSave = lodash.find(meetingList, (ch: any) => ch._id === data._id);
    //                         if (!hasSave) {
    //                             dispatch(addActiveMeeting(data));
    //                         }
    //                         return;
    //                     }
    //                     case 'modified': {
    //                         dispatch(updateActiveMeeting(data));
    //                         return;
    //                     }
    //                     case 'removed': {
    //                         dispatch(removeActiveMeeting(data._id));
    //                         return;
    //                     }
    //                     default:
    //                         return;
    //                 }
    //             });
    //         }
    //     })
    //     return () => {
    //         unMount = true;
    //         unsubscriber();
    //     }
    // }, []);

    const handleLoad = useCallback(() => {

        let _page: string;
        setInfiniteLoad(true);
        if ((
            page * size) < total) {
            _page = "?page=" + (
                page + 1);

            axios.get(BASE_URL + `/applications${ _page }` , { ...config , params : query() }).then((response) => {

                if (response?.data?.message) Alert.alert(response.data.message);
                response?.data?.size ? setSize(response?.data?.size) : setSize(0);
                response?.data?.total ? setTotal(response?.data?.total) : setTotal(0);
                response?.data?.page ? setPage(response?.data?.page) : setPage(0);
                if (response?.data?.docs.length == 0) {
                    setInfiniteLoad(false);

                } else {
                    dispatch(handleInfiniteLoad({
                        data : getList(response.data.docs , selectedChangeStatus) ,
                        user : user
                    }));
                    setInfiniteLoad(false);
                }
                setInfiniteLoad(false);
            }).catch((err) => {
                Alert.alert('Alert' , err?.message || 'Something went wrong.');
                setInfiniteLoad(false);
                console.warn(err)
            })
        } else {
            _page = "?page=" + (
                page + 1);

            axios.get(BASE_URL + `/applications${ _page }` , { ...config , params : query() }).then((response) => {

                if (response?.data?.message) Alert.alert(response.data.message);
                if (response?.data?.size) setSize(response?.data?.size);
                if (response?.data?.total) setTotal(response?.data?.total);
                if (response?.data?.page && response?.data?.docs.length > 1) setPage(response?.data?.page);

                setInfiniteLoad(false);
            }).catch((err) => {
                Alert.alert('Alert' , err?.message || 'Something went wrong.');
                setInfiniteLoad(false);
                console.warn(err)
            });
            setInfiniteLoad(false)
        }

    } , [size , total , page]);

    const onJoin = (item) => {
        dispatch(setMeetingId(item._id));
        props.navigation.navigate('Dial' , {
            isHost : item.host._id === user._id ,
            isVoiceCall : item.isVoiceCall ,
            options : {
                isMute : false ,
                isVideoEnable : true ,
            }
        });
    };

    const onClose = (item) => {
        if (item.host._id === user._id) {
            endMeeting(item._id);
        } else {
            dispatch(removeActiveMeeting(item._id));
        }
    };


    const unReadReadApplicationFn = (id , dateRead , unReadBtn , callback: (action: any) => void) => {
        unreadReadApplication({
            unReadBtn : unReadBtn ,
            dateRead : dateRead ,
            id : id ,
            config : config ,
            dispatch : dispatch ,
            setUpdateUnReadReadApplication : setUpdateUnReadReadApplication ,
            callback : callback
        });
    };

    const updateModalFn = (bool) => {
        setUpdateModal(bool)
    };

    const [isOpen , setIsOpen] = useState();
    const [isPrevOpen , setIsPrevOpen] = useState();
    const onMoreModalDismissed = (isOpen) => {

        setIsOpen(isOpen);
        setMoreModalVisible(false)
    };
    const [sizeComponent , onLayoutComponent] = useComponentLayout();
    const [searchSizeComponent , onSearchLayoutComponent] = useComponentLayout();
    const [activitySizeComponent , onActivityLayoutComponent] = useComponentLayout();
    const [activityScreenComponent , onActivityScreenComponent] = useComponentLayout();

    const [containerHeight , setContainerHeight] = useState(148);
    useEffect(() => {
        if (sizeComponent?.height && searchSizeComponent?.height) setContainerHeight(sizeComponent?.height + searchSizeComponent?.height)
    } , [sizeComponent , searchSizeComponent , activitySizeComponent , activityScreenComponent]);

    const scrollY = useRef(new Animated.Value(0)).current;
    const offsetAnim = useRef(new Animated.Value(0)).current;
    const clampedScroll = Animated.diffClamp(
        Animated.add(
            scrollY.interpolate({
                inputRange : [0 , 1] ,
                outputRange : [0 , 1] ,
                extrapolateLeft : 'clamp' ,
            }) ,
            offsetAnim ,
        ) ,
        0 ,
        containerHeight
    );

    var _clampedScrollValue = 0;
    var _offsetValue = 0;
    var _scrollValue = 0;
    useEffect(() => {

        scrollY.addListener(({ value }) => {

            const diff = value - _scrollValue;
            _scrollValue = value;
            _clampedScrollValue = Math.min(
                Math.max(_clampedScrollValue + diff , 0) ,
                containerHeight ,
            )

        });
        offsetAnim.addListener(({ value }) => {
            _offsetValue = value;

        })
    } , []);

    var scrollEndTimer = null;
    const onMomentumScrollBegin = () => {

        clearTimeout(scrollEndTimer)
    };
    const onMomentumScrollEnd = () => {

        const toValue = _scrollValue > containerHeight &&
                        _clampedScrollValue > (
            containerHeight) / 2
                        ? _offsetValue + containerHeight : _offsetValue - containerHeight;

        Animated.timing(offsetAnim , {
            toValue ,
            duration : 20 ,
            useNativeDriver : true ,
        }).start();
    };
    const onScrollEndDrag = () => {
        scrollEndTimer = setTimeout(onMomentumScrollEnd , 250);
    };

    const headerTranslate = clampedScroll.interpolate({
        inputRange : [0 , containerHeight] ,
        outputRange : [0 , -containerHeight] ,
        extrapolate : 'clamp' ,
    });
    const opacity = clampedScroll.interpolate({
        inputRange : [0 , containerHeight , containerHeight] ,
        outputRange : [1 , 0.5 , 0] ,
        extrapolate : 'clamp' ,
    });


    return (
        <Fragment>
            <StatusBar barStyle={ 'light-content' }/>
            <View onLayout={ onActivityScreenComponent } style={ { flex : 1 , flexDirection : "row" } }>
                <View onLayout={ onActivityLayoutComponent } style={ [styles.container , {
                    flex : (
                               isMobile  || activityScreenComponent?.width <800) ? 1 : 0.4 ,
                }] }>


                    <View onLayout={ onLayoutComponent }
                          style={ [styles.group , !modalVisible && !moreModalVisible && !visible && !refreshing && !lodash.size(meetingList) && { position : "absolute" , }] }>
                        <Animated.View style={ [styles.rect , styles.horizontal , {
                            backgroundColor : isMobile  || activityScreenComponent?.width <800 ? "#041B6E" : "#fff" ,

                        } , !modalVisible && !moreModalVisible && !visible && !refreshing && !lodash.size(meetingList) && {
                            ...{ opacity } ,
                            transform : [{ translateY : headerTranslate }]
                        }] }>

                            { (isMobile  || activityScreenComponent?.width <800)&&
                            <TouchableOpacity onPress={ () => props.navigation.navigate('Settings')/*openDrawer()*/ }>
                                <HomeMenuIcon height={ fontValue(24) } width={ fontValue(24) }/>
                            </TouchableOpacity> }

                            <Text
                                style={ [styles.activity , { color : isMobile  || activityScreenComponent?.width < 800 ? "rgba(255,255,255,1)" : primaryColor , }] }>{ isMobile || activityScreenComponent?.width <800 ? `Activity` : `Feed` }</Text>
                            <View style={ { flex : 1 } }/>
                            <TouchableOpacity onPress={ () => {
                                dispatch(setVisible(true))
                            }

                            }>
                                <Filter width={ fontValue(32) } height={ fontValue(32) } fill={ "#fff" }/>

                            </TouchableOpacity>
                            { ( !isMobile && activityScreenComponent?.width > 800)&&
                            <TouchableOpacity onPress={ onRefresh }>
                                <RefreshWeb style={ { paddingLeft : 15 } } width={ fontValue(26) }
                                            height={ fontValue(24) } fill={ "#fff" }/>
                            </TouchableOpacity>
                            }
                        </Animated.View>
                    </View>
                    <View>
                        {
                            !!lodash.size(meetingList) && (
                                <FlatList
                                    data={ meetingList }
                                    bounces={ false }
                                    horizontal
                                    showsHorizontalScrollIndicator={ false }
                                    snapToInterval={ width }
                                    decelerationRate={ 0 }
                                    keyExtractor={ (item: any) => item._id }
                                    renderItem={ ({ item }) => (
                                        <MeetingNotif
                                            style={ { width } }
                                            name={ getChannelName(item) }
                                            time={ item.createdAt }
                                            onJoin={ () => onJoin(item) }
                                            onClose={ () => onClose(item) }
                                            closeText={
                                                item.host._id === user._id ? 'End' : 'Close'
                                            }
                                        />
                                    ) }
                                />
                            )
                        }

                    </View>
                    <FakeSearchBar onSearchLayoutComponent={ onSearchLayoutComponent }
                                   animated={ !modalVisible && !moreModalVisible && !visible && !refreshing && !lodash.size(meetingList) && {
                                       ...{ opacity } ,
                                       top : sizeComponent?.height || 80 * (
                                           1 + lodash.size(meetingList)) ,
                                       elevation : 10 ,
                                       zIndex : 10 ,
                                       position : "absolute" ,
                                       transform : [{ translateY : headerTranslate }]
                                   } } onPress={ () => {

                        //setSearchVisible(true)
                        props.navigation.navigate(SEARCH);
                    } } searchVisible={ searchVisible }/>

                    <Animated.FlatList
                        onScroll={ Animated.event(
                            [{
                                nativeEvent : {
                                    contentOffset : {
                                        y : scrollY
                                    }
                                }
                            }] ,
                            { useNativeDriver : true }
                        ) }

                        contentContainerStyle={ {
                            paddingTop : (
                                !modalVisible && !moreModalVisible && !visible && !refreshing && !lodash.size(meetingList) && containerHeight * (
                                    lodash.size(meetingList) || 1)) || 0 , flexGrow : 1
                        } }
                        ListEmptyComponent={ () => listEmpty(refreshing , searchTerm , total) }
                        ListHeaderComponent={ () => (
                            <>
                                { !searchVisible && !!pnApplications?.length &&
                                <View style={[styles.pinnedActivityContainer, {  marginBottom: 5,  paddingBottom : 20 , backgroundColor : "#fff" } ]}>
                                    { !!pnApplications?.length &&
                                    <View style={ [styles.pinnedgroup , { height : undefined }] }>
                                        <View style={ [styles.pinnedcontainer , { paddingVertical : 10 }] }>
                                            <Text style={ [styles.pinnedActivity , {  fontFamily : Regular500 , }] }>Pinned
                                                Activity</Text>
                                        </View>
                                    </View> }
                                    { !searchVisible && (

                                        <ScrollView style={ { maxHeight : 300 } }>
                                            {
                                                pnApplications.map((item: any , index: number) => {
                                                    return item?.activity && item?.activity.map((act: any , i: number) => {
                                                        return act?.assignedPersonnel == user?._id && <ActivityItem
                                                            isOpen={ isOpen }
                                                            config={ config }
                                                            key={ i }
                                                            currentUser={ user }
                                                            role={ user?.role?.key }
                                                            searchQuery={ searchTerm }
                                                            activity={ act }
                                                            isPinned={ true }
                                                            onPressUser={ (event: any) => {
                                                                /*unReadReadApplicationFn(act?._id, false, true, (action: any) => {
                                                                })*/
                                                                setIsOpen(undefined);
                                                                dispatch(setApplicationItem({ ...act , isOpen : `pin${ i }${ index }` }))
                                                                //setDetails({ ...act , isOpen : `pin${ i }${ index }` });
                                                                if (event?.icon == 'more') {
                                                                    setMoreModalVisible(true)
                                                                } else {
                                                                    setModalVisible(true)
                                                                }

                                                            } } index={ `pin${ i }${ index }` }
                                                            swiper={ (index: number , progress: any , dragX: any , onPressUser: any) => renderSwiper(index , progress , dragX , onPressUser , act , unReadReadApplicationFn) }/>
                                                    })
                                                })
                                            }
                                        </ScrollView>

                                    )
                                    }
                                </View> }
                            </>

                        ) }
                        refreshControl={

                            <RefreshControl
                                refreshing={ refreshing }
                                onRefresh={ onRefresh }
                            />
                        }
                        style={ { flex : 1 , } }

                        data={ notPnApplications }
                        keyExtractor={ (item , index) => index.toString() }
                        ListFooterComponent={ bottomLoader }
                        onEndReached={ () => {
                            if (!onEndReachedCalledDuringMomentum) {
                                handleLoad();
                                setOnEndReachedCalledDuringMomentum(true);
                            }

                        } }
                        onScrollEndDrag={ onScrollEndDrag }
                        onEndReachedThreshold={ 0.1 }
                        onMomentumScrollBegin={ () => {
                            onMomentumScrollBegin();
                            setOnEndReachedCalledDuringMomentum(false)
                        } }
                        onMomentumScrollEnd={ onMomentumScrollEnd }
                        scrollEventThrottle={ 1 }
                        renderItem={ ({ item , index }) => (
                            <ApplicationList
                                key={ index }
                                onPress={ () => {
                                    userPress(index)

                                } }
                                item={ item }
                                numbers={ numberCollapsed }
                                index={ index }

                                element={ (activity: any , i: number) => {

                                    return (

                                        <ActivityItem
                                            isOpen={ isOpen }
                                            /*config={config}
                                            isPinned={true}*/
                                            searchQuery={ searchTerm }
                                            key={ i }
                                            parentIndex={ index }
                                            role={ user?.role?.key }
                                            activity={ activity }
                                            currentUser={ user }
                                            onPressUser={ (event: any) => {
                                                setIsOpen(undefined);
                                                dispatch(setApplicationItem({ ...activity , isOpen : `${ index }${ i }` }))
                                                //setDetails({ ...activity , isOpen : `${ index }${ i }` });
                                                /*unReadReadApplicationFn(activity?._id, false, true, (action: any) => {
                                                })*/
                                                if (event?.icon == 'more') {
                                                    setMoreModalVisible(true)
                                                } else {
                                                    setModalVisible(true)
                                                }

                                            } } index={ `${ index }${ i }` }
                                            swiper={ (index: number , progress: any , dragX: any , onPressUser: any) => renderSwiper(index , progress , dragX , onPressUser , activity , unReadReadApplicationFn) }/>
                                    )
                                } }/>
                        ) }
                    />
                    {/*    right view jkadtong muslide
                view*/ }


                </View>
                {
                    !(
                        isMobile )  && lodash.isEmpty(applicationItem) && activityScreenComponent?.width >800  &&
                    <View style={ [{ flex : 0.6 , justifyContent : "center" , alignItems : "center" }] }>

                        <NoActivity/>
                        <Text style={ { color : "#A0A3BD" , fontSize : fontValue(24) } }>No activity
                            selected</Text>


                    </View>
                }

                { (!lodash.isEmpty(applicationItem) )  && <ActivityModalView>
                    <ItemMoreModal details={ applicationItem } visible={ moreModalVisible } onDismissed={ () => {

                        onMoreModalDismissed(applicationItem?.isOpen)
                    } }/>
                    <ActivityModal updateModal={ updateModalFn }
                                   readFn={ unReadReadApplicationFn }
                                   details={ applicationItem }
                                   onChangeAssignedId={ (event) => {
                                       dispatch(setApplicationItem(event))
                                   } }
                                   visible={ modalVisible }
                                   onDismissed={ (event: boolean , _id: number) => {
                                       setUpdateModal(false);
                                       dispatch(setApplicationItem({  }))
                                       if (event && _id) {
                                           //  dispatch(deleteApplications(_id))
                                       }
                                       if (event) {
                                           onRefresh()
                                       }
                                       onDismissed()
                                   } }/></ActivityModalView> }
            </View>


        </Fragment>

    );

}

