import React, {useCallback, useEffect, useRef} from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";
import BackSpaceIcon from "@assets/svg/backspace";
import {styles} from "@pages/activities/search/styles";
import ActivityItem from "@pages/activities/activityItem";
import {renderSwiper} from "@pages/activities/swiper";
import ApplicationList from "@pages/activities/applicationList";
import ItemMoreModal from "@pages/activities/itemMoreModal";
import ActivityModal from "@pages/activities/modal";
import Loader from "@pages/activities/bottomLoad";
import useCountUp from "../../../../hooks/useCountUp";
import {Regular500} from "@styles/font";
import InputField from "@molecules/form-fields/input-field";

import NoActivity from "@assets/svg/noActivity";
import lodash from 'lodash';
import {fontValue} from "@pages/activities/fontValue";
import {isMobile} from "@pages/activities/isMobile";
import ActivityModalView from "@pages/activities/nativeView/activityModalView";
import {
    setApplicationItem,
    setEdit,
    setHasChange,
    setNotPinnedApplication, setPinnedApplication
} from "../../../../reducers/application/actions";
import useActivities from "../../../../hooks/useActivities";
import {ACTIVITYITEM} from "../../../../reducers/activity/initialstate";

const {height} = Dimensions.get('screen');

export function SearchActivity(props: { navigation: any, setApplications: any, onBlur: any, isHandleLoad: any, isRecentSearches: any, clearAll: any, total: any, loading: boolean, setText: any, handleLoad: any, bottomLoader: any, size: any, refreshing: any, applications: any, onPress: () => void, value: string, onEndEditing: () => void, onChange: (event) => void, onChangeText: (text) => void, onPress1: () => void, translateX: any, nevers: [], callbackfn: (search, index) => JSX.Element }) {
    const {
        setIsOpen,
        user,
        setUpdateModal,
        config,
        applicationItem,
        dispatch,
        onRefresh,
        modalVisible,
        setModalVisible,
        moreModalVisible,
        setMoreModalVisible,
        onDismissed,
        onEndReachedCalledDuringMomentum,
        setOnEndReachedCalledDuringMomentum,
        unReadReadApplicationFn,
        updateModalFn,
        isOpen,
        onMoreModalDismissed
    } = useActivities();
    const dimensions = useWindowDimensions();
    const inputRef = useRef(null);
    const onFocusHandler = () => {
        inputRef.current && inputRef.current.focus();
    }
    useEffect(() => {
        onFocusHandler()
    }, [])


    const AnimatedTotal = useCallback((props) => {
        const progress = useCountUp(2000)
        const countUp = (Math.max(0, Math.round(progress * props.total)))
        return <Text>{countUp == props.total ? props.total : countUp}</Text>
    }, [])

    const onChangeAssignedId = (event) => {






        let _applications = [...props?.applications]
        let flag = 1


        for (let i = 0; i < _applications.length; i++) {
            if (!flag) break
            for (let j = 0; j < _applications?.[i]?.['activity'].length; j++) {
                if (_applications?.[i]?.['activity']?.[j]._id == event._id) {
                    _applications[i]['activity'][j] = event
                    flag = 0
                    break;
                }
            }
        }
        props?.setApplications(_applications)

    }
    const onDismissedModal = (event: boolean, _id: number) => {

        setUpdateModal(false);
        dispatch(setApplicationItem({}))
        if (event && _id) {
            //  dispatch(deleteApplications(_id))
        }
        if (event) {
            onRefresh()
        }
        onDismissed()
    };
    return <View style={[styles.container, {flexDirection: "row"}]}>
        <View style={[styles.group9, {
            flex: (
                isMobile || dimensions?.width < 768) ? 1 : 0.4,
            flexBasis: (
                isMobile || dimensions?.width < 768) ? "100%" : 466,
            flexGrow: 0,
            flexShrink: 0
        }]}>
            <View style={styles.group4}>
                <View style={styles.rect}>
                    <View style={styles.group2}>
                        <TouchableOpacity style={{paddingRight: 10}} onPress={() => {
                            onDismissed()
                            props.onPress()
                        }}>
                            <BackSpaceIcon
                                width={fontValue(20)}
                                height={fontValue(16)}
                                style={styles.icon}
                            ></BackSpaceIcon>
                        </TouchableOpacity>

                        <View style={styles.group}>

                            <InputField ref={inputRef}

                                        inputStyle={{fontWeight: "400", fontSize: fontValue(14)}}
                                        value={props.value}
                                        onEndEditing={props.onEndEditing}
                                        onChange={props.onChange}
                                        onBlur={props.onEndEditing}
                                        onChangeText={props.onChangeText}
                                        placeholder="Search"/>

                        </View>

                    </View>
                </View>
            </View>

            <View
                style={[styles.group8, {backgroundColor: props.value.length < 1 || props.total == 0 ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",}]}>

                {!props?.loading && props.value.length < 1 && <View
                    style={[styles.header, {justifyContent: props.isRecentSearches ? "space-between" : "center",}]}>

                    <Text
                        style={[styles.recentSearches]}>{props.nevers.length && props.isRecentSearches == true ? "Recent Searches" : props.isRecentSearches == true ? "No Recent Searches" :
                        <ActivityIndicator/>}</Text>

                    <TouchableOpacity onPress={props.clearAll}>
                        <Text style={{
                            fontSize: fontValue(14),
                            color: '#2863D6',
                            fontFamily: Regular500,
                        }}>{props.nevers.length ? "Clear all" : ""}</Text>
                    </TouchableOpacity>

                </View>}


                {props?.loading &&
                    <View style={{backgroundColor: "#fff", paddingVertical: 10}}>
                        <Loader/>
                    </View>

                }
                <View style={{flex: 1}}>
                    {props.value.length < 1 ?
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {props.nevers?.map(props.callbackfn)}
                        </ScrollView>
                        : <>
                            {!props?.loading && !!props.value.length &&
                                <View style={styles.header}>
                                    <Text style={styles.recentSearches}>
                                        {props.isHandleLoad ?
                                            <AnimatedTotal total={props.total}/> : props.total} results of
                                        "<Text>{props.value}</Text>"</Text>
                                </View>
                            }
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={{flex: 1}}
                                data={props.applications}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={() => {
                                    if (!onEndReachedCalledDuringMomentum) {
                                        props.handleLoad(props.value)
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


                                        }}
                                        item={item}
                                        index={index}
                                        element={(activity: any, i: number) => {

                                            return (
                                                <ActivityItem
                                                    isOpen={isOpen}
                                                    config={config}
                                                    searchQuery={props.value}
                                                    key={i}
                                                    parentIndex={index}
                                                    role={user?.role?.key}
                                                    activity={activity}
                                                    currentUser={user}
                                                    selected={applicationItem?._id == activity?._id}
                                                    onPressUser={(event: any) => {

                                                        dispatch(setEdit(false))
                                                        dispatch(setHasChange(false))
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
                                                                    onChangeEvent: onChangeAssignedId,
                                                                    onChangeAssignedId: onChangeAssignedId
                                                                });
                                                            }


                                                            //
                                                        }


                                                    }} index={`${index}${i}`}
                                                    swiper={(index: number, progress: any, dragX: any, onPressUser: any) => renderSwiper(index, progress, dragX, onPressUser, activity, unReadReadApplicationFn)}/>
                                            )
                                        }} numbers={[]}/>
                                )}
                            />
                        </>
                    }
                </View>
            </View>


        </View>


        {
            !(
                isMobile) && lodash.isEmpty(applicationItem) && dimensions?.width > 768 &&
            <View style={[{flex: 1, justifyContent: "center", alignItems: "center"}]}>

                <NoActivity/>
                <Text style={{color: "#A0A3BD", fontSize: fontValue(24)}}>No activity
                    selected</Text>


            </View>
        }

        {(!lodash.isEmpty(applicationItem)) && <ActivityModalView>
            <ItemMoreModal details={applicationItem} visible={moreModalVisible} onDismissed={() => {
                onMoreModalDismissed(applicationItem?.isOpen)
            }}/>
            <ActivityModal updateModal={updateModalFn}
                           readFn={unReadReadApplicationFn}
                           details={applicationItem}
                           onChangeAssignedId={onChangeAssignedId}
                           visible={modalVisible}
                           onDismissed={onDismissedModal}/></ActivityModalView>}
    </View>;
}
