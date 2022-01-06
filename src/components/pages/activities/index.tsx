import React, {useEffect, useMemo, useState} from "react";
import {Animated, RefreshControl, ScrollView, StatusBar, Text, TouchableOpacity, View} from "react-native";
import {styles} from "@pages/activities/styles";
import {APPROVED, CASHIER, DATE_ADDED, DIRECTOR, FOREVALUATION} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setNotPinnedApplication, setPinnedApplication} from "../../../reducers/application/actions";
import ActivityModal from "@pages/activities/modal";
import axios from "axios";
import FilterIcon from "@assets/svg/filterIcon";
import {checkFormatIso,} from "@pages/activities/script";
import {Application} from "@pages/activities/interface";
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


export default function ActivitiesPage(props: any) {


    const user = useSelector((state: RootStateOrAny) => state.user);
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const {pinnedApplications, notPinnedApplications} = useSelector((state: RootStateOrAny) => state.application)
    const dispatch = useDispatch()
    const ispinnedApplications = (applications: any) => {
        setTotalPages(Math.ceil(applications.length / 10));

        const sortByDate = (arr: any) => {
            const sorter = (a: any, b: any) => {
                return selectedChangeStatus?.indexOf(DATE_ADDED) != -1 ?
                    new Date(checkFormatIso(b.updatedAt, "-")).getTime() - new Date(checkFormatIso(a.updatedAt, "-")).getTime() :
                    new Date(checkFormatIso(a.updatedAt, "-")).getTime() - new Date(checkFormatIso(b.updatedAt, "-")).getTime()

            }
            return arr?.sort(sorter);
        };


        const selectedClone = selectedChangeStatus?.filter((status: string) => {
            return status != DATE_ADDED
        })
        const list = sortByDate(applications).filter((item: Application) => {
            const search = item?.applicant?.user?.firstName.includes(searchTerm) && (selectedClone?.length ?
                selectedClone.indexOf(item.status) != -1
                : true)
            if ([CASHIER].indexOf(user?.role?.key) != -1) {
                return item?.status == APPROVED && search
            } else if ([DIRECTOR].indexOf(user?.role?.key) != -1) {
                return item?.status == FOREVALUATION && search
            } else {
                return search
            }
        });
        setIsPinnedActivity(0)
        const groups = list.reduce((groups: any, activity: any) => {
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


        return groupArrays.slice(0, currentPage * 10);
    }
    const [countRefresh, setCountRefresh] = useState(0)
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setCountRefresh(countRefresh + 1)

    }, [countRefresh]);


    useEffect(() => {
        let isCurrent = true
        const config = {
            headers: {
                Authorization: "Bearer ".concat(user.sessionToken)
            }
        }
        let res: any = [];
        dispatch(setNotPinnedApplication([]))
        dispatch(setPinnedApplication([]))
        axios.get(BASE_URL + '/applications/notpinned', config).then((response) => {

            dispatch(setNotPinnedApplication(response.data))
            if(isCurrent) setRefreshing(false);
        }).catch((err) => {
            setRefreshing(false)
            console.warn(err)
        })
        axios.get(BASE_URL + '/applications/pinned', config).then((response) => {
            dispatch(setPinnedApplication(response.data))
            if(isCurrent)setRefreshing(false);
        }).catch((err) => {
            setRefreshing(false)
            console.warn(err)
        })
        return () => {
            isCurrent = false
        }

    }, [countRefresh])

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
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
    return (
        <>
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

                        {pnApplications.length > 0 &&
                        <View style={styles.pinnedgroup}>
                            <View style={styles.pinnedcontainer}>
                                <Text style={styles.pinnedActivity}>Pinned activity</Text>
                            </View>
                        </View>}

                        {pnApplications.map((item, index) => {


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

                <ScrollView style={{flex: 1}}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                            onScroll={(event) => {
                                let paddingToBottom = 10
                                paddingToBottom +=
                                    event.nativeEvent.layoutMeasurement.height;
                                var currentOffset =
                                    event.nativeEvent.contentOffset.y;
                                let direction = (currentOffset > event.nativeEvent.contentOffset.y ? 'down' : 'up');

                                if (direction === 'up') {

                                    if (
                                        event.nativeEvent.contentOffset.y >=
                                        event.nativeEvent.contentSize.height -
                                        paddingToBottom
                                    ) {

                                        if (currentPage < totalPages) {
                                            setCurrentPage(currentPage + 1)
                                            setOffset((currentPage - 1) * perPage)
                                        }
                                    }
                                }

                            }}
                            scrollEventThrottle={16}
                >
                    {
                        notPnApplications.map((item: any, index: number) => {
                            return <ApplicationList

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
                                            //userPressActivityModal(index, i)
                                            setDetails(activity/*{...activity, ...{parentIndex: index, index: i}}*/)
                                            if (event?.icon == 'more') {
                                                setMoreModalVisible(true)
                                            } else {
                                                setModalVisible(true)
                                            }

                                        }} index={i} swiper={renderSwiper}/>
                                }}/>
                        })
                    }
                </ScrollView>
                <ItemMoreModal details={details} visible={moreModalVisible} onDismissed={onMoreModalDismissed}/>
                <ActivityModal details={details} visible={modalVisible} onDismissed={(event: boolean) => {
                    if (event) {
                        onRefresh()
                    }
                    onDismissed()
                }}/>

            </View>
        </>

    );
}


