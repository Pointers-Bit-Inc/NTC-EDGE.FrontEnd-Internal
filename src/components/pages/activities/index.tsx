import React, {useEffect, useMemo, useState} from "react";
import {Image, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View} from "react-native";
import {Entypo, EvilIcons, Octicons} from '@expo/vector-icons'
import {styles} from "@pages/activities/styles";
import Svg, {Ellipse} from "react-native-svg";
import Collapsible from "react-native-collapsible";
import {Swipeable} from "react-native-gesture-handler";
import {APPROVED, DATE_ADDED, DECLINED, FOREVALUATION} from "../../../reducers/activity/initialstate";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setVisible} from "../../../reducers/activity/actions";
import ActivityModal from "@pages/activities/modal";
import axios from "axios";
import FilterIcon from "@assets/svg/filterIcon";
import MoreIcon from "@assets/svg/more";
import UnseeIcon from "@assets/svg/unsee";
import EvaluationStatus from "@assets/svg/evaluationstatus";
import CheckMarkIcon from "@assets/svg/checkmark";
import DeclineStatusIcon from "@assets/svg/declineStatus";
import {checkFormatIso, formatDate} from "@pages/activities/formatDate";
import FileIcon from "@assets/svg/file";
import {Activities} from "@pages/activities/interface";
import SearchIcon from "@assets/svg/search";

export default function ActivitiesPage() {




const user = useSelector((state: RootStateOrAny) => state.user);
    const {selectedChangeStatus} = useSelector((state: RootStateOrAny) => state.activity)
    const dispatch = useDispatch()
    const [mockList, setMockList] = useState<Activities[]>([])

    useEffect(() => {
        axios.get(`https://ntc.astrotechenergy.com/activities`,
            {
                headers: {
                    Authorization: "Bearer ".concat(user.sessionToken)
                }
            }).then((response) => {

            let res = [...response.data]
            setMockList(res)
        }).catch((err) =>{
            console.log(err)
        })
    }, [])

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(10)
    const [offset, setOffset] = useState((currentPage - 1) * perPage)
    const [totalPages, setTotalPages] = useState(0)
    const [numberCollapsed, setNumberCollapsed] = useState<number[]>([])
    const [isPinnedActivity, setIsPinnedActivity] = useState(0)

    const usersList = useMemo(() => {
        setTotalPages(Math.ceil(mockList.length / 10));
        const sortByDate = (arr: any) => {
            const sorter = (a: any, b: any) => {
                return new Date(checkFormatIso(a.createdAt, "-")).getTime() - new Date(checkFormatIso(b.createdAt, "-")).getTime();
            }
            return arr.sort(sorter);
        };
        const selectedClone = selectedChangeStatus.filter((status: string) => {
            return status != DATE_ADDED
        })
        const list = (selectedChangeStatus.indexOf(DATE_ADDED) != -1 ? sortByDate(mockList) : mockList).filter((item: Activities) => {

            return item.activityDetails.applicant.user.firstName.includes(searchTerm) &&
                (selectedClone.length ? selectedClone.indexOf(item.activityDetails.status) != -1 : true)
        });
        setIsPinnedActivity(0)
        const groups = list.reduce((groups: any, activity: any) => {
            const date = checkFormatIso(activity.createdAt, "-");

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
                activity: groups[date]
            };
        });
        let a = [];
        for (let i = 0; i < groupArrays.length; i++) {
            a.push(0);
        }
        setNumberCollapsed(a)
        return groupArrays.slice(0, currentPage * 10);
    }, [searchTerm, selectedChangeStatus.length, mockList.length, currentPage])

    const statusColor = (status: string) => {
        if (status == FOREVALUATION) {
            return {color: "#f66500"}
        } else if (status == APPROVED) {
            return {color: "#34c759"}
        } else if (status == DECLINED) {
            return {color: "#cf0327"}
        }
    }

    const statusIcon = (status: string) => {

        if (status == FOREVALUATION) {

            return <EvaluationStatus style={[styles.icon3, {color: "#f66500",}]}/>
        } else if (status == APPROVED) {
            return <CheckMarkIcon style={[styles.icon3, {left: 20}]}/>
        } else if (status == DECLINED) {
            return <DeclineStatusIcon style={[styles.icon3, {left: 20}]}/>
        }
    }
    const statusBackgroundColor = (status: string) => {

        if (status == FOREVALUATION) {
            return {backgroundColor: "#fef5e8",}
        } else if (status == APPROVED) {
            return {backgroundColor: "rgba(229,247,241,1)",}
        } else if (status == DECLINED) {
            return {backgroundColor: "#fae6e9",}
        }
    }

    const statusDimension = (status: any) => {
        if (status == FOREVALUATION) {
            return {width: 103}
        } else if (status == APPROVED) {
            return {width: 80}
        } else if (status == DECLINED) {
            return {width: 70}
        }
    }


    const userPress = (index: number) => {
        var newArr = [...numberCollapsed]
        newArr[index] = newArr[index] ? 0 : 1
        setNumberCollapsed(newArr)
    }
    const [modalVisible, setModalVisible] = useState(false)
    const onDismissed = () => {
        setModalVisible(false)
    }
    const [details, setDetails] = useState({})
    const renderSwiper = (index: number, progress: any, dragX: any) => {

        return <>

            <View style={{
                paddingRight: 20,
                paddingLeft: 20,
                backgroundColor: '#2863d6',
                alignItems: "center",
                justifyContent: 'center'
            }}>
                <UnseeIcon width={18} height={18} fill={"#fff"}/>
                <Text
                    style={{
                        color: 'white',
                        fontWeight: '600',

                    }}>
                    Unread
                </Text>
            </View>
            <View style={{
                paddingRight: 40,
                paddingLeft: 40,
                backgroundColor: '#e5e5e5',
                justifyContent: 'center',
                alignItems: "center"
            }}>
                <MoreIcon width={18} height={18} fill={"#000"}/>
                <Text
                    style={{
                        color: '#000',
                        fontWeight: '600',
                    }}>
                    More
                </Text>
            </View>
        </>
    }
    return (
        <>


            <View style={[styles.container]}>


                <View style={styles.group}>
                    <View style={styles.rect}>
                        <View style={styles.rect4Row}>
                            <View>

                                <Image style={styles.rect4} source={require('./../../../../assets/favicon.png')}/>

                            </View>
                            <Text style={styles.activity}>Activity</Text>
                        </View>
                        <View style={styles.rect4RowFiller}/>
                        <View style={styles.rect5}>
                            <TouchableOpacity onPress={() => {
                                dispatch(setVisible(true))
                            }

                            }>
                                <FilterIcon width={18} height={18} fill={"#fff"}/>

                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View style={styles.group9}>
                    <View style={styles.searcg}>
                        <View style={styles.rect26}>
                            <View style={styles.rect7}>
                                <View style={styles.iconRow}>
                                    <SearchIcon style={styles.icon}></SearchIcon>
                                    <TextInput
                                        placeholder="search"
                                        style={styles.textInput}
                                        onChange={(event) => setSearchTerm(event.nativeEvent.text)}
                                    ></TextInput>
                                </View>
                            </View>

                        </View>

                        {isPinnedActivity > 0 &&
                        <View style={styles.pinnedgroup}>
                            <View style={styles.pinnedcontainer}>
                                <Text style={styles.pinnedActivity}>Pinned activity</Text>
                            </View>
                        </View>}

                        {isPinnedActivity > 0 && usersList.map((item, index) => {
                            return item.activity.map((activity: any, i: number) => {
                                return activity.isPinned && <Swipeable key={i}
                                                                       renderRightActions={(progress, dragX) => renderSwiper(index, progress, dragX)}>
                                    <View key={i} style={styles.group8}>
                                        <View style={styles.rect8}>
                                            <View style={styles.activeRow}>
                                                <View style={styles.active}>
                                                    <View style={styles.rect12}>
                                                        <View style={styles.rect13}>
                                                            <Svg viewBox="0 0 10 9.5"
                                                                 style={styles.ellipse}>
                                                                <Ellipse
                                                                    strokeWidth={0}
                                                                    fill="rgba(26,89,211,1)"
                                                                    cx={5}
                                                                    cy={5}
                                                                    rx={5}
                                                                    ry={5}
                                                                />
                                                            </Svg>
                                                        </View>
                                                    </View>
                                                </View>
                                                <View style={styles.profile}>
                                                    <View style={styles.rect11Stack}>
                                                        <View style={styles.rect11}/>
                                                        <View style={styles.rect14}/>
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={styles.activeRowFiller}/>
                                            <View style={styles.group4StackStack}>
                                                <View style={styles.group4Stack}>
                                                    <View style={styles.group4}>
                                                        <View style={styles.rect16}>
                                                            <View style={styles.group3}>
                                                                <TouchableOpacity onPress={() => {
                                                                    setDetails(activity)
                                                                    setModalVisible(true)
                                                                }
                                                                }>
                                                                    <Text
                                                                        style={styles.name}>{(activity.activityDetails.applicant?.user?.firstName + " " + activity.activityDetails.applicant?.user?.lastName).length > 20 ? (activity.activityDetails.applicant?.user?.firstName + " " + activity.activityDetails.applicant?.user?.lastName).slice(0, 25).concat('...') : (activity.activityDetails.applicant?.user?.firstName + " " + activity.activityDetails.applicant?.user?.lastName)}</Text>
                                                                </TouchableOpacity>

                                                                <View style={styles.group2}>
                                                                    <View style={styles.rect18Stack}>
                                                                        <View style={styles.rect18}>
                                                                            <View style={styles.group21}>
                                                                                <View style={styles.rect32}>
                                                                                    <Text
                                                                                        style={styles.application}>
                                                                                        {activity.activityDetails.applicationType.length > 25 ? activity.activityDetails.applicationType.slice(0, 25).concat('...') : activity.activityDetails.applicationType }
                                                                                    </Text>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                        <View style={styles.group20}>
                                                                            <View style={styles.rect31}>
                                                                                <FileIcon width={13} height={13} style={styles.icon2}></FileIcon>

                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                    <View style={styles.rect28}/>
                                                </View>
                                                <View style={styles.group5}>
                                                    <View style={styles.group22Stack}>
                                                        <View style={styles.group22}>
                                                            <View style={styles.rect33}>
                                                                <View style={styles.loremIpsumFiller}/>
                                                                <Text
                                                                    style={styles.loremIpsum}>{formatDate(activity.activityDetails.dateTime)}</Text>
                                                            </View>
                                                        </View>
                                                        <View style={styles.rect24}/>
                                                    </View>
                                                </View>
                                                <View style={styles.group7}>
                                                    <View style={styles.stackFiller}/>
                                                    <View style={styles.group6Stack}>
                                                        <View style={styles.group6}>
                                                            <View
                                                                style={[styles.rect23, statusBackgroundColor(activity.activityDetails.status)]}>
                                                                <View style={styles.group19}>
                                                                    <View style={styles.group18Row}>
                                                                        <View style={styles.group18}>
                                                                            <View style={styles.icon3Stack}>
                                                                                {statusIcon(activity.activityDetails.status)}

                                                                                <View
                                                                                    style={styles.rect29}/>
                                                                            </View>
                                                                        </View>
                                                                        <View
                                                                            style={[styles.rect30Stack, statusDimension(activity.activityDetails.status)]}>
                                                                            <View style={styles.rect30}/>
                                                                            <Text
                                                                                style={[styles.approved, statusColor(activity.activityDetails.status)]}>{activity.activityDetails.status}</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.rect25}/>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </Swipeable>
                            })
                        })}

                    </View>
                    <View style={styles.rect27}></View>
                </View>
                <ScrollView style={{flex: 1}} onScroll={(event) => {

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
                        usersList.map((item: any, index: number) => {
                            let activities = item.activity.filter((item: any) => {
                                return !item.isPinned
                            })
                            return activities.length ? <View key={index} style={styles.group26}>
                                <TouchableWithoutFeedback onPress={() => userPress(index)}>
                                    <View style={styles.group25}>
                                        <View style={styles.rect34}>
                                            <View style={styles.group24}>
                                                <View style={styles.dateStack}>
                                                    <Text style={styles.date}>{item.date}</Text>
                                                    <View style={styles.rect36}></View>
                                                </View>
                                            </View>
                                            <View style={styles.group24Filler}></View>
                                            <View style={styles.group23}>
                                                <View style={styles.stackFiller}></View>
                                                <View style={styles.icon4Stack}>
                                                    <Entypo
                                                        name="chevron-thin-down"
                                                        style={styles.icon4}
                                                    />
                                                    <View style={styles.rect35}></View>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                <Collapsible collapsed={numberCollapsed[index] == 1}>
                                    {activities.map((activity: any, i: number) => {

                                        return !activity.isPinned ? <Swipeable key={i}
                                                                               renderRightActions={(progress, dragX) => renderSwiper(index, progress, dragX)}>
                                            <View style={styles.group17}>
                                                <View style={styles.group8}>
                                                    <View style={styles.rect8}>
                                                        <View style={styles.activeRow}>
                                                            <View style={styles.active}>
                                                                <View style={styles.rect12}>
                                                                    <View style={styles.rect13}>
                                                                        <Svg viewBox="0 0 10 9.5"
                                                                             style={styles.ellipse}>
                                                                            <Ellipse
                                                                                strokeWidth={0}
                                                                                fill="rgba(26,89,211,1)"
                                                                                cx={5}
                                                                                cy={5}
                                                                                rx={5}
                                                                                ry={5}
                                                                            />
                                                                        </Svg>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                            <View style={styles.profile}>
                                                                <View style={styles.rect11Stack}>
                                                                    <View style={styles.rect11}/>
                                                                    <View style={styles.rect14}/>
                                                                </View>
                                                            </View>
                                                        </View>
                                                        <View style={styles.activeRowFiller}/>
                                                        <View style={styles.group4StackStack}>
                                                            <View style={styles.group4Stack}>
                                                                <View style={styles.group4}>
                                                                    <View style={styles.rect16}>
                                                                        <View style={styles.group3}>
                                                                            <TouchableOpacity onPress={() => {
                                                                                setDetails(activity)
                                                                                setModalVisible(true)
                                                                            }
                                                                            }>
                                                                                <Text
                                                                                    style={styles.name}>{(activity.activityDetails.applicant?.user?.firstName + " " + activity.activityDetails.applicant?.user?.lastName).length > 20 ? (activity.activityDetails.applicant?.user?.firstName + " " + activity.activityDetails.applicant?.user?.lastName).slice(0, 25).concat('...') : (activity.activityDetails.applicant?.user?.firstName + " " + activity.activityDetails.applicant?.user?.lastName)}</Text>
                                                                            </TouchableOpacity>

                                                                            <View style={styles.group2}>
                                                                                <View style={styles.rect18Stack}>
                                                                                    <View style={styles.rect18}>
                                                                                        <View style={styles.group21}>
                                                                                            <View style={styles.rect32}>
                                                                                                <Text
                                                                                                    style={styles.application}>
                                                                                                    {activity.activityDetails.applicationType.length > 25 ? activity.activityDetails.applicationType.slice(0, 25).concat('...') : activity.activityDetails.applicationType }
                                                                                                </Text>
                                                                                            </View>
                                                                                        </View>
                                                                                    </View>
                                                                                    <View style={styles.group20}>
                                                                                        <View style={styles.rect31}>
                                                                                            <FileIcon width={13} height={13} style={styles.icon2}></FileIcon>
                                                                                        </View>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.rect28}/>
                                                            </View>
                                                            <View style={styles.group5}>
                                                                <View style={styles.group22Stack}>
                                                                    <View style={styles.group22}>
                                                                        <View style={styles.rect33}>
                                                                            <View style={styles.loremIpsumFiller}/>
                                                                            <Text
                                                                                style={styles.loremIpsum}>{formatDate(activity.activityDetails.dateTime)}</Text>
                                                                        </View>
                                                                    </View>
                                                                    <View style={styles.rect24}/>
                                                                </View>
                                                            </View>
                                                            <View style={styles.group7}>
                                                                <View style={styles.stackFiller}/>
                                                                <View style={styles.group6Stack}>
                                                                    <View style={styles.group6}>
                                                                        <View
                                                                            style={[styles.rect23, statusBackgroundColor(activity.activityDetails.status)]}>
                                                                            <View style={styles.group19}>
                                                                                <View style={styles.group18Row}>
                                                                                    <View style={styles.group18}>
                                                                                        <View style={styles.icon3Stack}>
                                                                                            {statusIcon(activity.activityDetails.status)}

                                                                                            <View
                                                                                                style={styles.rect29}/>
                                                                                        </View>
                                                                                    </View>
                                                                                    <View
                                                                                        style={[styles.rect30Stack, statusDimension(activity.activityDetails.status)]}>
                                                                                        <View style={styles.rect30}/>
                                                                                        <Text
                                                                                            style={[styles.approved, statusColor(activity.activityDetails.status)]}>{activity.activityDetails.status}</Text>
                                                                                    </View>
                                                                                </View>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                    <View style={styles.rect25}/>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </Swipeable> : false
                                    })}
                                </Collapsible>

                            </View> : false
                        })
                    }
                </ScrollView>
                <ActivityModal details={details} visible={modalVisible} onDismissed={onDismissed}/>

            </View>
        </>

    );
}


