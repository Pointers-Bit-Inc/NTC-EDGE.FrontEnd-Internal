import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Alert, Animated, FlatList, RefreshControl, StatusBar, Text, TouchableOpacity, View, Dimensions} from "react-native";
import {styles} from "@pages/activities/styles";
import {
    APPROVED,
    CASHIER,
    DATE_ADDED,
    DECLINED,
    DIRECTOR,
    EVALUATOR,
    FOREVALUATION, FORVERIFICATION,
    PAID,
    PENDING,
    UNVERIFIED,
    VERIFIED
} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {
    handleInfiniteLoad,
    setApplications,
    setNotPinnedApplication,
    setPinnedApplication
} from "../../../reducers/application/actions";
import ActivityModal from "@pages/activities/modal";
import axios from "axios";
import FilterIcon from "@assets/svg/filterIcon";
import {checkFormatIso, PaymentStatusText, StatusText,} from "@pages/activities/script";
import SearchIcon from "@assets/svg/search";
import {ActivityItem} from "@pages/activities/activityItem";
import {renderSwiper} from "@pages/activities/swiper";
import {BASE_URL} from "../../../services/config";
import ProfileImage from "@components/atoms/image/profile";
import {setVisible} from "../../../reducers/activity/actions";
import Search from "@pages/activities/search";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import moment from "moment";
import ApplicationList from "@pages/activities/applicationList";
import Loader from "@pages/activities/bottomLoad";
import useFirebase from 'src/hooks/useFirebase';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { getChannelName } from 'src/utils/formatting';
import lodash from 'lodash';
import {
    addActiveMeeting,
    removeActiveMeeting,
    updateActiveMeeting,
    setMeetingId,
  } from 'src/reducers/meeting/actions';
import { MeetingNotif } from '@components/molecules/list-item';
const { width } = Dimensions.get('window')

export default function ActivitiesPage(props: any) {
    const user = useSelector((state: RootStateOrAny) => state.user);
    const meetingList = useSelector((state:RootStateOrAny) => {
        const { activeMeetings } = state.meeting;
        const sortedMeeting = lodash.orderBy(activeMeetings, 'updatedAt', 'desc');
        return sortedMeeting;
      });
    const cashier = [CASHIER].indexOf(user?.role?.key) != -1;
    const config = {
        headers: {
            Authorization: "Bearer ".concat(user?.sessionToken)
        }
    }
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const {pinnedApplications, notPinnedApplications} = useSelector((state: RootStateOrAny) => state.application)
    const dispatch = useDispatch()
    const { userActiveMeetingSubscriber, endMeeting } = useFirebase({
        _id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
      });
    const ispinnedApplications = (applications: any) => {

        setTotalPages(Math.ceil(applications?.length / 10));

        const sortByDate = (arr: any) => {
            const sorter = (a: any, b: any) => {
                const DateB = new Date(checkFormatIso(b.date, "-")).getTime();
                const DateA = new Date(checkFormatIso(a.date, "-")).getTime();
                return selectedChangeStatus?.indexOf(DATE_ADDED) != -1 ?
                    DateA - DateB :
                    DateB - DateA
            }
            return arr?.sort(sorter);
        };

        const selectedClone = selectedChangeStatus?.filter((status: string) => {
            return status != DATE_ADDED
        })


        const list = applications?.filter((item: any) => {

            const search = item?.applicant?.user?.firstName.includes(searchTerm) &&
                (selectedClone?.length ?
                    selectedClone.indexOf(cashier ?
                        PaymentStatusText(item.paymentStatus) : StatusText(item.status)) != -1
                    : true)
            if (cashier) {
                return (item?.status == APPROVED || item?.assignedPersonnel == user?._id) && search
            } else if ([DIRECTOR, EVALUATOR].indexOf(user?.role?.key) != -1) {
                return (item?.status == FOREVALUATION || item?.status == PENDING || item?.assignedPersonnel == user?._id) && search
            } else {
                return search
            }
        });

        setIsPinnedActivity(0)
        const groups = list?.reduce((groups: any, activity: any) => {
            const date = checkFormatIso(activity.updatedAt, "-");
            if (activity.isPinned) {
                setIsPinnedActivity(isPinnedActivity + 1)
            }
            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(activity);
            return groups;
        }, {});
        const groupArrays = Object.keys(groups).map((date) => {
            return {
                date,
                readableHuman: moment([date]).fromNow(),
                activity: groups[date],
            };
        });
        let a = [], b = [];
        for (let i = 0; i < groupArrays.length; i++) {
            for (let j = 0; j < groupArrays[i].activity.length; j++) {
                b.push(0)
            }
            a.push({parentIndex: 0, child: b});

        }
        if (a) {
            setNumberCollapsed(a)
        }


        return groupArrays.slice(0, currentPage * 25);
    }
    const [searchTerm, setSearchTerm] = useState('');
    const [countRefresh, setCountRefresh] = useState(0)
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setCountRefresh(countRefresh + 1)
    }, [countRefresh]);


    useEffect(() => {

        setRefreshing(true)
        let isCurrent = true

        let res: any = [];
        dispatch(setNotPinnedApplication([]))
        dispatch(setPinnedApplication([]))

        const keyword = searchTerm.length ? '?keyword=' + searchTerm : '';
        const selectedClone = selectedChangeStatus?.filter((status: string) => {
            return status != DATE_ADDED
        })

        const checkDateAdded = selectedChangeStatus?.filter((status: string) => {
            return status == DATE_ADDED
        })

        const dateAdded = checkDateAdded.length ? "?sort=desc" : "?sort=asc"

        const status = selectedClone.length ? (cashier ? "?paymentStatus=" : '?status=') + selectedClone.map((item: any) => {
            if(cashier){
                if (item == VERIFIED) {
                    return PAID
                } else if (item == UNVERIFIED) {
                    return DECLINED
                }else if(item == FORVERIFICATION){
                    return [PENDING, FORVERIFICATION, FOREVALUATION].toString()
                }
            } else if(item == FOREVALUATION){
                return [FOREVALUATION, PENDING].toString()
            }
            return item
        }).toString() : ''

        axios.get(BASE_URL + `/applications${dateAdded + keyword + status}`, config).then((response) => {
            if (response?.data?.message) Alert.alert(response.data.message)
            dispatch(setApplications(response.data))
            if (isCurrent) setRefreshing(false);
        }).catch((err) => {
            setRefreshing(false)
            console.warn(err)
        })
        return () => {
            isCurrent = false
        }

    }, [countRefresh, searchTerm, selectedChangeStatus])


    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(25)
    const [offset, setOffset] = useState((currentPage - 1) * perPage)
    const [totalPages, setTotalPages] = useState(0)
    const [numberCollapsed, setNumberCollapsed] = useState<{ parentIndex: number, child: number[] }[]>([])
    const [isPinnedActivity, setIsPinnedActivity] = useState(0)
    const [searchVisible, setSearchVisible] = useState(false)

    const pnApplications = useMemo(() => {

        return ispinnedApplications(pinnedApplications)
    }, [searchTerm, selectedChangeStatus?.length, pinnedApplications?.length, currentPage])

    const notPnApplications = useMemo(() => {
        return ispinnedApplications(notPinnedApplications)
    }, [searchTerm, selectedChangeStatus?.length, notPinnedApplications?.length, currentPage])


    const userPress = (index: number) => {
        let newArr = [...numberCollapsed]
        newArr[index].parentIndex = newArr[index].parentIndex ? 0 : 1
        setNumberCollapsed(newArr)
    }
    const userPressActivityModal = (index: number, i: number) => {
        let newArr = [...numberCollapsed]
        newArr[index].child[i] = newArr[index].child[i] ? 0 : 1
        setNumberCollapsed(newArr)
    }
    const [modalVisible, setModalVisible] = useState(false)
    const [moreModalVisible, setMoreModalVisible] = useState(false)
    const onDismissed = () => {
        setModalVisible(false)
    }
    const onMoreModalDismissed = () => {
        setMoreModalVisible(false)
    }
    const [details, setDetails] = useState({})
    const initialMove = new Animated.Value(-400);
    const endMove = 400
    const duration = 1000;
    const [loadingAnimation, setLoadingAnimation] = useState(false)
    const loadingAnimate = () => {

        Animated.timing(initialMove, {
            toValue: endMove,
            duration: duration,
            useNativeDriver: true,
        }).start((o) => {
            if (o.finished) {
                initialMove.setValue(-400)
                if (loadingAnimation) {
                    loadingAnimate()
                }

            }
        })
    }
    const [oldCurrentPage, setOldCurrentPage] = useState(1)
    const [infiniteLoad, setInfiniteLoad] = useState(false)
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(false)
    const bottomLoader = () => {
        return infiniteLoad ? <Loader/> : null
    };

    useEffect(() => {
        setInfiniteLoad(true)
        const keyword = searchTerm.length ? '?keyword=' + searchTerm : '';
        if (currentPage != oldCurrentPage) {
            const page = "?page=" + currentPage
            axios.get(BASE_URL + `/applications${keyword + page}`, config).then((response) => {
                if (response?.data?.docs.length == 0) {
                    setInfiniteLoad(false);

                } else {
                    dispatch(handleInfiniteLoad(response.data))
                    setInfiniteLoad(false);
                }

            }).catch((err) => {
                setInfiniteLoad(false)
                console.warn(err)
            })
        }else{
            setInfiniteLoad(false)
        }
    }, [currentPage])
    
    useEffect(() => {
        let unMount = false;
        const unsubscriber = userActiveMeetingSubscriber((querySnapshot:FirebaseFirestoreTypes.QuerySnapshot) => {
          if (!unMount) {
            querySnapshot.docChanges().forEach((change:any) => {
              const data = change.doc.data();
              data._id = change.doc.id;
              switch(change.type) {
                case 'added': {
                  const hasSave = lodash.find(meetingList, (ch:any) => ch._id === data._id);
                  if (!hasSave) {
                    dispatch(addActiveMeeting(data));
                  }
                  return;
                }
                case 'modified': {
                  dispatch(updateActiveMeeting(data));
                  return;
                }
                case 'removed': {
                  dispatch(removeActiveMeeting(data._id));
                  return;
                }
                default:
                  return;
              }
            });
          }
        })
        return () => {
          unMount = true;
          unsubscriber();
        }
      }, []);

    const handleLoad = () => {
        setCurrentPage(currentPage + 1)
        setOffset((currentPage - 1) * perPage)
        setOldCurrentPage(currentPage)
    }

    const onJoin = (item) => {
        dispatch(setMeetingId(item._id));
        props.navigation.navigate('Dial', {
          isHost: item.host._id === user._id,
          isVoiceCall: item.isVoiceCall,
          options: {
            isMute: false,
            isVideoEnable: true,
          }
        });
      }
    
      const onClose = (item) => {
        if (item.host._id === user._id) {
          endMeeting(item._id);
        } else {
          dispatch(removeActiveMeeting(item._id));
        }
      }

    return (
        <Fragment>
            <StatusBar barStyle={'light-content'}/>
            {searchVisible && <Search loadingAnimation={(event: boolean) => {

                setLoadingAnimation(event)


            }} initialMove={initialMove} animate={loadingAnimate} onSearch={(query: string) => {
                setSearchTerm(query)
            }} onDismissed={() => {

                setSearchVisible(false)
                setSearchTerm("")
            }}/>}
            <View style={[styles.container]}>


                <View style={styles.group}>
                    <View style={[styles.rect, styles.horizontal, {paddingHorizontal: 20, paddingTop: 35}]}>
                        <TouchableOpacity onPress={() => props.navigation.openDrawer()}>
                            <ProfileImage
                                size={45}
                                image={user.image}
                                name={`${user.firstName} ${user.lastName}`}
                            />
                        </TouchableOpacity>
                        <Text style={styles.activity}>Activity</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={() => {
                            dispatch(setVisible(true))
                        }

                        }>
                            <FilterIcon width={18} height={18} fill={"#fff"}/>
                        </TouchableOpacity>
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
                        snapToInterval={width}
                        decelerationRate={0}
                        keyExtractor={(item:any) => item._id}
                        renderItem={({ item }) => (
                            <MeetingNotif
                            style={{ width }}
                            name={getChannelName(item)}
                            time={item.createdAt}
                            onJoin={() => onJoin(item)}
                            onClose={() => onClose(item)}
                            closeText={
                                item.host._id === user._id ? 'End' : 'Close'
                            }
                            />
                        )}
                        />
                    )
                }
                </View>
                <View style={styles.group9}>

                    <View style={styles.searcg}>
                        <View style={[styles.rect26, {height: undefined, paddingHorizontal: 20, paddingVertical: 10}]}>
                            <TouchableOpacity onPress={() => {
                                setSearchVisible(true)
                            }}>
                                {!searchVisible &&
                                <View style={[styles.rect7, {marginTop: 0, width: '100%', marginLeft: 0}]}>
                                    <View style={styles.iconRow}>

                                        <SearchIcon style={styles.icon}></SearchIcon>

                                        <View

                                            style={styles.textInput}

                                        >
                                            <Text style={{color: "rgba(128,128,128,1)",}}>Search</Text>
                                        </View>

                                    </View>
                                </View>
                                }
                            </TouchableOpacity>
                        </View>

                        {pnApplications?.length > 0 &&
                        <View style={styles.pinnedgroup}>
                            <View style={styles.pinnedcontainer}>
                                <Text style={styles.pinnedActivity}>Pinned activity</Text>
                            </View>
                        </View>}

                        {pnApplications.map((item: any, index: number) => {
                            return item.activity.map((act: any, i: number) => {
                                return act?.assignedPersonnel == user?._id && <ActivityItem
                                    searchQuery={searchTerm}
                                    activity={act}
                                    onPressUser={() => {
                                        setDetails({...act, ...{isPinned: true}})
                                        setModalVisible(true)
                                    }} index={i} swiper={renderSwiper}/>
                            })
                        })
                        }


                    </View>
                    <View style={[styles.rect27, {height: 5}]}></View>
                </View>

                <FlatList

                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    style={{flex: 1}}
                    data={notPnApplications}
                    keyExtractor={(item, index) => index.toString()}
                    ListFooterComponent={bottomLoader}
                    onEndReached={() => {
                        if (!onEndReachedCalledDuringMomentum) {
                            handleLoad()
                            setOnEndReachedCalledDuringMomentum(true);
                        }

                    }}
                    onEndReachedThreshold={0.1}
                    onMomentumScrollBegin={() => {
                        setOnEndReachedCalledDuringMomentum(false)
                    }}
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

                                return <ActivityItem
                                    searchQuery={searchTerm}
                                    key={i}
                                    parentIndex={index}
                                    role={user?.role?.key}
                                    activity={activity}
                                    currentUser={user}
                                    onPressUser={(event: any) => {
                                        setDetails(activity)
                                        if (event?.icon == 'more') {
                                            setMoreModalVisible(true)
                                        } else {
                                            setModalVisible(true)
                                        }

                                    }} index={i} swiper={renderSwiper}/>
                            }}/>
                    )}
                />
                <ItemMoreModal details={details} visible={moreModalVisible} onDismissed={onMoreModalDismissed}/>
                <ActivityModal details={details} visible={modalVisible} onDismissed={(event: boolean) => {
                    if (event) {
                        onRefresh()
                    }
                    if (!(notPnApplications.length || pnApplications.length)) {
                        onRefresh()
                    }
                    onDismissed()
                }}/>

            </View>
        </Fragment>

    );
}


