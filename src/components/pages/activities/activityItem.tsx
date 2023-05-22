import React, {memo, useEffect, useMemo, useState} from "react";
import {Platform, StyleSheet, TouchableOpacity, useWindowDimensions, View} from "react-native";
import Text from "@components/atoms/text";
import ProfileImage from "@components/atoms/image/profile";
import FileIcon from "@assets/svg/file";
import {Hoverable} from 'react-native-web-hooks';
import {
    formatDate,
    getActivityStatus,
    PaymentStatusText,
    readableToHuman,
    remarkColor,
    StatusText
} from "@pages/activities/script";
import * as Animatable from 'react-native-animatable'
import {APPROVED, CASHIER, DECLINED,} from "../../../reducers/activity/initialstate";
import {infoColor, outline} from 'src/styles/color';
import Highlighter from "@pages/activities/search/highlighter";

import EndorseIcon from "@assets/svg/endorse";
import {Bold, Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {ActivitySwipeable} from "@pages/activities/nativeView/activitySwipeable";
import MoreCircle from "@assets/svg/moreCircle";
import {isMobile} from "@pages/activities/isMobile";
import {Menu, MenuOption, MenuOptions, MenuTrigger} from "react-native-popup-menu";
import UnseeIcon from "@assets/svg/unsee";
import PinToTopIcon from "@assets/svg/pintotop";
import BellMuteIcon from "@assets/svg/bellMute";
import ArchiveIcon from "@assets/svg/archive";
import DeleteIcon from "@assets/svg/delete";
import {isTablet} from "react-native-device-info";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import {setModalVisible} from "../../../reducers/application/actions";

const styles = StyleSheet.create({

    containerBlur: {
        paddingTop: 10,

        borderRadius: fontValue(10),

        shadowColor: "rgba(0,0,0,1)",
        shadowOffset: {
            height: 0,
            width: 0
        },
        elevation: fontValue(2),
        shadowOpacity: 0.2,
        shadowRadius: fontValue(2),
        flex: 1
    },
    container: {
        paddingVertical: 5

    },
    horizontal: {

        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    content: {

        flex: 1,

        borderBottomColor: outline.default,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft: 5,

    },
    name: {
        marginBottom: 5,
    },
    date: {
        flex: 1,
        paddingVertical: 6,
        paddingRight: 6,
        alignSelf: "flex-start",
        justifyContent: "flex-end",
        color: "#606A80"
    },
    application: {
        borderRadius: 5,
        marginLeft: 0,
        //borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#163776',
    },
    status: {
        paddingHorizontal: 5,
        paddingVertical: 2,
        borderRadius: 5,
        marginLeft: 15
    },
    circle: {
        width: 8,
        height: 8,

        borderRadius: 8,
        marginLeft: -8,
        marginRight: 5,
    },
    applicationContainer: {

        flexDirection: 'row',
        alignItems: 'center',

    },
    moreCircle: {

        shadowColor: "rgba(0,0,0,0.1)",
        shadowOffset: {
            width: 0,
            height: 4
        },
        borderRadius: 25,
        elevation: 30,
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    menuItemText: {
        fontSize: 14,
        paddingVertical: 3,
        paddingHorizontal: 10,
    },
    menuItem: {
        flexDirection: "row",
        paddingHorizontal: 10,
        alignItems: "center"
    }
});


const RenderStatus = ({trigger, status}: any) => {
    const containerStatus = useMemo(() =>
            [
                styles.horizontal,
                //statusBackgroundColor(status),

                styles.status,
                {
                    backgroundColor: remarkColor(status),
                    paddingHorizontal: fontValue(10),
                    paddingVertical: fontValue(5),
                    borderRadius: fontValue(30)
                },
            ]
        , [status])


    return (
        <View
            style={containerStatus}
        >
            {/* {statusIcon(status,{marginRight:3})}*/}

                <Text
                    style={{color: "#fff"}}
                    size={fontValue(10)}
                    numberOfLines={1}
                >
                    {status?.toUpperCase()}
                </Text>
        </View>
    )
};


const RenderApplication = ({applicationType}: any) => {

    const containerStyles = useMemo(() => [
        //{backgroundColor:"#BFBEFC"},
        styles.horizontal,
        styles.application
    ], [])
    return (
        <View
            style={containerStyles}
        >
            <FileIcon
                width={fontValue(20)}
                height={fontValue(20)}
            />
            <Text

                style={{marginLeft: 3, marginRight: 5}}
                color="#606A80"
                size={fontValue(12)}
                numberOfLines={1}
            >
                {(
                    isMobile && !(
                        Platform?.isPad || isTablet())) ? applicationType : (
                    (
                        applicationType)?.length > 25) ?
                    (
                        (
                            (
                                applicationType)?.substring(0, 25 - 3)) + '...') :
                    applicationType}
            </Text>
        </View>
    )
};


const RenderPinned = ({personnel, config}: any) => {
    const containerStyles = useMemo(() => [
        {
            //backgroundColor : "#F3F7FF" ,
        },
        styles.horizontal,
        styles.application
    ], [])
    const personelStyle = useMemo(() => {
        return {marginLeft: 3, marginRight: 5, width: "50%", borderRadius: 14, backgroundColor: "#EAEDFF"}
    }, [])
    return (
        <View
            style={containerStyles}
        >
            <EndorseIcon
                width={fontValue(20)}
                height={fontValue(20)}
            />
            {!personnel?.firstName ?
                <View style={personelStyle}><Text

                    size={fontValue(12)}
                    numberOfLines={1}
                >
                </Text></View> :
                <Text
                    style={{"marginLeft": 3, "marginRight": 5}}
                    color="#606A80"
                    size={fontValue(12)}
                    numberOfLines={1}
                >
                    {personnel != undefined ? `Assigned to ${personnel?.firstName} ${personnel?.lastName}` : ``}
                </Text>
            }
        </View>
    )
};
let row: Array<any> = [];
let prevOpenedRow;
const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
};


function ProfileImageMemo(props: { userActivity: any, name: any }) {

    return  useMemo(() => <ProfileImage
        size={fontValue(45)}
        image={props.userActivity?.profilePicture?.thumb != "https://ui-avatars.com/api/?name=Guest+EDGE&background=3b82f6&color=fff&size=75" ? props.userActivity?.profilePicture?.thumb ? props.userActivity?.profilePicture?.thumb.match(/[^/]+(jpg|jpeg|png|gif)$/i) ? props.userActivity?.profilePicture?.thumb : props.userActivity?.profilePicture?.thumb + ".png" : null : null}
        name={props.name}
    />, [props])
}

const ActivityItem = (props: any) => {
    const applicationItemId = useSelector((state:RootStateOrAny)=>state.application.applicationItemId);
    const propsMemo = useMemo(() => props, [props])
    const selected =useMemo(() => {
        return Platform.OS == "web" ? applicationItemId == propsMemo.selected : false
    }, [applicationItemId,  propsMemo.selected] )
    const status = [CASHIER].indexOf(propsMemo?.role) != -1 ? PaymentStatusText(propsMemo?.activity?.paymentStatus) : StatusText(propsMemo?.activity?.status);
    const userActivity = propsMemo?.activity?.applicant?.user || propsMemo?.activity?.applicant;
 const getStatus = getActivityStatus(propsMemo, status);
    let userType = propsMemo?.activity?.applicant?.userType;


    const nameMemo = useMemo(() => {
        let basicFirstName = propsMemo?.activity?.service?.basic?.firstName;
        let basicLastName = propsMemo?.activity?.service?.basic?.lastName;
        let basicCompanyName = propsMemo?.activity?.service?.basic?.companyName;
        let basicClubName = propsMemo?.activity?.service?.basic?.clubName;
        let companyName = propsMemo?.activity?.applicant?.companyName;
        let clubName = propsMemo?.activity?.service?.applicationDetails?.clubName;
        let firstName = userActivity?.firstName;
        let lastName = userActivity?.lastName;
        let applicantName = userActivity?.applicantName;


        return propsMemo?.activity?.applicant?.userId == "2b2957c9-c604-4d0e-ad31-14466f172c06" || propsMemo?.activity?.applicant?.userId ==  "41b17694-119a-4d3c-b996-7aa4ab6e9b91"
        || (basicFirstName || basicLastName) ?
            (basicFirstName || basicLastName ?
                `${basicFirstName || ""} ${basicLastName || ""}`
                : basicCompanyName ? basicCompanyName : basicClubName ?? companyName)
            : ((userType == "Individual" ) ?
                ((firstName || lastName || applicantName) ?
                    `${firstName || ""} ${lastName || ""}`.trim() || applicantName :
                    ((basicFirstName || basicFirstName) ?
                        `${basicFirstName || ""} ${basicLastName || ""}` :
                        (basicCompanyName ? basicCompanyName : ""))) :
                ((companyName || basicCompanyName) ?
                    (companyName || basicCompanyName) :
                    (clubName ? clubName :
                        ((firstName || lastName || applicantName) ?
                            `${firstName || ""} ${lastName || ""}`.trim() || applicantName :
                            ((basicFirstName || basicFirstName) ?
                                `${basicFirstName || ""} ${basicLastName || ""}` :
                                (basicCompanyName ? basicCompanyName :
                                    ""))))))
    }, [userActivity])
    useEffect(() => {
        let unsubscribe = true;
        unsubscribe && propsMemo?.isOpen == propsMemo?.index && row[propsMemo?.index]?.close();
        unsubscribe && propsMemo?.isOpen == propsMemo?.index && !!row.length && row[propsMemo?.index]?.close();
        return () => {
            unsubscribe = false
        }
    }, [propsMemo.isOpen == propsMemo.index]);
    useEffect(() => {
        setSelectedMoreCircle(propsMemo.activityMore == propsMemo.index)
    }, [propsMemo.activityMore]);
    const [isAdd, setIsAdd] = useState(false)
    const [isUpdate, setIsUpdate] = useState(false)
    const [isDelete, setIsDelete] = useState(false)
    useEffect(() => {
        let state = null;
       if(props?.activity?.state == "add"){
           setIsAdd(true)
           state = new Promise((resolve, reject) => {
               setTimeout(() => {


                   resolve() // when this fires, .then gets called

               }, 3000)
           }).then(() => {
               console.log("setIsAdd false")
             setIsAdd(false)
           })
       }  else if( props?.activity?.state == "delete"){
           setIsDelete(true)
           state = new Promise((resolve, reject) => {
               setTimeout(() => {


                   resolve() // when this fires, .then gets called

               }, 3000)
           }).then(() => {

               setIsDelete(false)
           })
       }else if( props?.activity?.state == "update"){
           setIsUpdate(true)
           state = new Promise((resolve, reject) => {
               setTimeout(() => {


                   resolve() // when this fires, .then gets called

               }, 3000)
           }).then(() => {
               console.log("setIsAdd false")
               setIsUpdate(false)
           })
       }
    }, [props?.activity?.state]);
    const [selectedMoreCircle, setSelectedMoreCircle] = useState(false);
    const onMoreCircle = () => {

        setSelectedMoreCircle(value => !value)

    };

    const dimensions = useWindowDimensions();

    const personnel = useMemo(() => {
        if (propsMemo?.activity) {
            if (!!propsMemo?.activity.paymentMethod && propsMemo?.activity?.assignedPersonnel?._id) {
                return propsMemo?.activity?.assignedPersonnel
            } else if (propsMemo?.activity?.paymentStatus == APPROVED || propsMemo?.activity?.paymentStatus == DECLINED) {
                return propsMemo?.activity?.paymentHistory?.[0]?.personnel || propsMemo?.activity?.paymentHistory?.personnel;
            } else {
                return (
                        propsMemo?.activity?.assignedPersonnel?._id ? propsMemo?.activity?.assignedPersonnel : null) ||
                    propsMemo?.activity?.approvalHistory?.[0]?.personnel ||
                    propsMemo?.activity?.approvalHistory?.personnel;

            }
        }
    }, [ propsMemo?.activity?.approvalHistory, propsMemo?.activity?.paymentHistory, propsMemo?.activity.paymentMethod , propsMemo?.activity.paymentStatus, propsMemo?.activity.assignedPersonnel])

    const [pressed, setPressed] = useState(false)
    const container = useMemo(() => [styles.container, {paddingRight: dimensions.width <= 768 ? 20 : undefined}], [dimensions])
    const applicationContainer = useMemo(() => styles.applicationContainer, [])
    const applicationBlur = useMemo(() => {

        return [styles.containerBlur, {
            borderColor: !(
                isMobile && !(
                    Platform?.isPad || isTablet())) ? "#AAB6DF" : (pressed ? "#98AFDC" : "#E5E5E5"),
            backgroundColor: pressed ? "#DCE8FF" : "#fff",
            borderWidth: selected && Platform.OS == "web" ? 4 : 1,
        }]
    }, [pressed, selected ])
    const assignPersonnelStyle = useMemo(() => [styles.section, {
        paddingHorizontal: fontValue(10),
        paddingTop: fontValue(4),
        paddingBottom: propsMemo?.activity?.assignedPersonnel?.id || propsMemo?.activity?.assignedPersonnel ? fontValue(4) : fontValue(10)
    }], [propsMemo?.activity?.assignedPersonnel])
    const activityItem = useMemo(() => [{
        height: 8,
        width: 8,
        backgroundColor: undefined,//propsMemo?.activity?.dateRead  ? "#fff" : "#2863D6" ,
        borderRadius: 4
    }], []);
    const assignPersonnelTop = useMemo(() => {
        return {
            borderRadius: fontValue(10),
            flex: 1,

            paddingHorizontal: fontValue(10),
            //paddingVertical:propsMemo?.activity?.assignedPersonnel?.id||propsMemo?.activity?.assignedPersonnel ? undefined : fontValue(10),
            flexDirection: "row",
            alignItems: "center"
        }
    }, [])
    const optionsContainerStyle = useMemo(() => {
        return {
            marginTop: 50,

            shadowColor: "rgba(0,0,0,1)",
            paddingVertical: 10,
            borderRadius: 8,
            shadowOffset: {
                width: 0,
                height: 0
            },
            elevation: 45,
            shadowOpacity: 0.1,
            shadowRadius: 15,
        }
    }, []);
    const onMoreCircleStyle = useMemo(() => {
        return [styles.moreCircle, selectedMoreCircle && {
            borderColor: 'rgba(116, 115, 189, 0.3)',
            borderWidth: 4,
        }]
    }, [selectedMoreCircle]);
    return (

        <Hoverable>
            {(isHovered => (

                <View style={{
                    backgroundColor:  isDelete ? "#ff9e9e"  : isUpdate ? "#8ab9f6"  : isAdd ? "#cef3ce"  : selected && !(
                        (
                            isMobile && !(
                                Platform?.isPad || isTablet()))) ? "#D4D3FF" : isHovered ? "#EEF3F6" : isAdd ? "#cef3ce"  :"#fff"
                }}>
                    <ActivitySwipeable
                        ref={ref => row[propsMemo.index] = ref}
                        key={propsMemo.index}
                        onSwipeableRightOpen={() => {
                            closeRow(propsMemo.index)
                        }
                        }
                        renderRightActions={
                            (progress, dragX) => propsMemo.swiper(propsMemo.index, progress, dragX, propsMemo.onPressUser)
                        }
                    >

                        <Animatable.View
                            animation={'fadeIn'}
                            style={container}>

                            <View style={applicationContainer}>
                                <View style={{padding: 5}}>
                                    <View style={activityItem}/>
                                </View>
                                <View style={applicationBlur}>

                                    <TouchableOpacity activeOpacity={100} onPressIn={() => setPressed(true)}
                                                      onPressOut={() => setPressed(false)}
                                                      onPress={propsMemo.onPressUser}>
                                        <View style={
                                            assignPersonnelTop
                                        }>
                                            <ProfileImageMemo userActivity={userActivity} name={nameMemo}/>
                                            <View style={styles.content}>
                                                <View style={styles.section}>
                                                    <View style={styles.name}>

                                                        <Highlighter
                                                            style={{
                                                                fontFamily: Bold,
                                                                fontSize: fontValue(14,)
                                                            }}
                                                            highlightStyle={{backgroundColor: '#BFD6FF'}}
                                                            searchWords={[propsMemo?.searchQuery]}
                                                            textToHighlight={nameMemo}
                                                        />
                                                        <View>
                                                            <Text style={{fontSize: fontValue(12,), color: "#606A80"}}>
                                                                {userType ? userType : "Individual" }
                                                            </Text>
                                                        </View>

                                                    </View>
                                                    <View style={styles.date}>

                                                        <Text
                                                            style={
                                                                {
                                                                    alignSelf: "flex-end",
                                                                    color: infoColor,
                                                                    fontFamily: Regular,
                                                                    fontSize: fontValue(10)
                                                                }
                                                            }
                                                            numberOfLines={1}
                                                        >
                                                            {readableToHuman(formatDate(propsMemo.activity.createdAt))}
                                                        </Text>
                                                    </View>
                                                </View>


                                            </View>

                                        </View>
                                        <View style={assignPersonnelStyle}>
                                            <View style={{flex: 1, alignItems: 'flex-start',}}>
                                                <RenderApplication
                                                    applicationType={propsMemo?.activity?.applicationType || propsMemo?.activity?.service?.name}/>
                                            </View>
                                            <View style={{paddingLeft: 6}}>
                                                <RenderStatus
                                                    status={getStatus}
                                                />
                                            </View>

                                        </View>
                                        {propsMemo?.activity?.assignedPersonnel?.id || propsMemo?.activity?.assignedPersonnel &&
                                            <View style={{
                                                padding: fontValue(10),
                                                borderTopColor: "#EFEFEF",
                                                borderTopWidth: 1
                                            }}>
                                                <View style={styles.section}>
                                                    <View style={{flex: 1, alignItems: 'flex-start'}}>
                                                        <RenderPinned config={propsMemo.config} personnel={personnel}/>
                                                    </View>
                                                </View>
                                            </View>
                                        }
                                    </TouchableOpacity>

                                </View>
                                {dimensions.width >= 768 &&
                                    <View style={{paddingHorizontal: selectedMoreCircle ? 14 : 18,}}>
                                        <Menu onClose={() => {
                                            setSelectedMoreCircle(false)
                                        }} onSelect={value => setSelectedMoreCircle(true)}>

                                            <MenuTrigger onPress={onMoreCircle}>
                                                <View style={onMoreCircleStyle}>
                                                    <MoreCircle selected={selectedMoreCircle}/>
                                                </View>
                                            </MenuTrigger>
                                            <MenuOptions optionsContainerStyle={optionsContainerStyle}>
                                                <MenuOption value={"Unread"}>
                                                    <View style={styles.menuItem}>
                                                        <UnseeIcon color={"#000"}/>
                                                        <Text style={styles.menuItemText}>Unread</Text>
                                                    </View>
                                                </MenuOption>
                                                <MenuOption value={"Pin to top"}>
                                                    <View style={styles.menuItem}>
                                                        <PinToTopIcon width={16.67} height={16.67}/>
                                                        <Text style={styles.menuItemText}>Pin to top</Text>
                                                    </View>
                                                </MenuOption>
                                                <MenuOption value={"Archive"}>
                                                    <View style={styles.menuItem}>
                                                        <BellMuteIcon width={16.67} height={16.67}/>
                                                        <Text style={styles.menuItemText}>Mute</Text>
                                                    </View>
                                                </MenuOption>
                                                <MenuOption
                                                    style={{borderBottomWidth: 1, borderBottomColor: "#E5E5E5"}}
                                                    value={"Archive"}>
                                                    <View style={styles.menuItem}>
                                                        <ArchiveIcon width={16.67} height={16.67}/>
                                                        <Text style={styles.menuItemText}>Archive</Text>
                                                    </View>
                                                </MenuOption>

                                                <MenuOption value={"Archive"}>
                                                    <View style={styles.menuItem}>
                                                        <DeleteIcon width={16.67} height={16.67}/>
                                                        <Text
                                                            style={[styles.menuItemText, {color: "#CF0327"}]}>Delete</Text>
                                                    </View>
                                                </MenuOption>
                                            </MenuOptions>

                                        </Menu>

                                    </View>}

                            </View>


                        </Animatable.View>


                    </ActivitySwipeable>

                </View>

            ))}
        </Hoverable>

    );
}

export default memo(ActivityItem)
