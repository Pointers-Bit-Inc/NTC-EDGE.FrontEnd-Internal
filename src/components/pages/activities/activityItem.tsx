import React , {useEffect , useRef , useState} from "react";
import {ActivityIndicator , StyleSheet , TouchableOpacity , View} from "react-native";
import Text from "@components/atoms/text";
import ProfileImage from "@components/atoms/image/profile";
import FileIcon from "@assets/svg/file";
import {Hoverable} from 'react-native-web-hooks';
import {
    formatDate ,
    getRole ,
    PaymentStatusText ,
    statusColor ,
    statusIcon ,
    StatusText
} from "@pages/activities/script";

import {
    ACCOUNTANT ,
    APPROVED ,
    CASHIER ,
    DECLINED ,
    DIRECTOR ,
    EVALUATOR ,
    FORAPPROVAL ,
    FOREVALUATION
} from "../../../reducers/activity/initialstate";
import {outline} from 'src/styles/color';
import Highlighter from "@pages/activities/search/highlighter";

import EndorseIcon from "@assets/svg/endorse";
import {useAssignPersonnel} from "@pages/activities/hooks/useAssignPersonnel";
import {Bold , Regular} from "@styles/font";
import {fontValue} from "@pages/activities/fontValue";
import {ActivitySwipeable} from "@pages/activities/nativeView/activitySwipeable";
import MoreCircle from "@assets/svg/moreCircle";
import {isMobile} from "@pages/activities/isMobile";
import {Menu , MenuOption , MenuOptions , MenuTrigger} from "react-native-popup-menu";
import UnseeIcon from "@assets/svg/unsee";
import PinToTopIcon from "@assets/svg/pintotop";
import BellMuteIcon from "@assets/svg/bellMute";
import ArchiveIcon from "@assets/svg/archive";
import DeleteIcon from "@assets/svg/delete";

const styles = StyleSheet.create({

    containerBlur : {
        borderColor : "#AAB6DF" ,
        borderRadius : 10 ,
        backgroundColor : "#fff" ,
        shadowColor : "rgba(0,0,0,1)" ,
        shadowOffset : {
            height : 0 ,
            width : 0
        } ,
        elevation : fontValue(2) ,
        shadowOpacity : 0.2 ,
        shadowRadius : fontValue(2) ,
        flex : 1
    } ,
    container : {
        paddingVertical : 5 ,
        paddingRight : 20 ,

    } ,
    horizontal : {

        flexDirection : 'row' ,
        alignItems : 'center' ,
    } ,
    section : {
        flexDirection : 'row' ,
        alignItems : 'center' ,
        justifyContent : 'space-between' ,
    } ,
    content : {

        flex : 1 ,
        paddingBottom : 10 ,
        borderBottomColor : outline.default ,
        // borderBottomWidth: StyleSheet.hairlineWidth,
        paddingLeft : 5 ,
        paddingTop : 15
    } ,
    name : {
        marginBottom : 5 ,
    } ,
    date : {
        color : "#606A80"
    } ,
    application : {

        paddingHorizontal : 3 ,
        paddingVertical : 3 ,
        borderRadius : 5 ,
        marginLeft : 0 ,
        //borderWidth: StyleSheet.hairlineWidth,
        borderColor : '#163776' ,
    } ,
    status : {
        paddingLeft : 5 ,
        paddingVertical : 2 ,
        borderRadius : 5 ,
        marginLeft : 15
    } ,
    circle : {
        width : 8 ,
        height : 8 ,

        borderRadius : 8 ,
        marginLeft : -8 ,
        marginRight : 5 ,
    } ,
    applicationContainer : {

        flexDirection : 'row' ,
        alignItems : 'center' ,

    } ,
    moreCircle : {

        shadowColor : "rgba(0,0,0,0.1)" ,
        shadowOffset : {
            width : 0 ,
            height : 4
        } ,
        borderRadius : 25 ,
        elevation : 30 ,
        shadowOpacity : 1 ,
        shadowRadius : 10 ,
    } ,
    menuItemText : {
        fontSize : 14 ,
        paddingVertical : 3 ,
        paddingHorizontal : 10 ,
    },
    menuItem:   {
        flexDirection : "row" ,
        paddingHorizontal : 10 ,
        alignItems : "center"
    }
});


const RenderStatus = ({ trigger , status }: any) => {

    return (
        <View
            style={ [
                styles.horizontal ,
                //statusBackgroundColor(status),
                styles.status ,
            ] }
        >
            { statusIcon(status , { marginRight : 3 }) }
            <Text
                style={ [statusColor(status)] }
                size={ fontValue(14) }
                numberOfLines={ 1 }
            >
                { status?.toUpperCase() }
            </Text>
        </View>
    )
};


const RenderApplication = ({ applicationType }: any) => {
    return (
        <View
            style={ [
                { backgroundColor : "#BFBEFC" } ,
                styles.horizontal ,
                styles.application
            ] }
        >
            <FileIcon
                width={ fontValue(20) }
                height={ fontValue(20) }
            />
            <Text
                style={ { marginLeft : 3 , marginRight : 5 } }
                color="#2A00A2"
                size={ fontValue(10) }
                numberOfLines={ 1 }
            >
                { applicationType }
            </Text>
        </View>
    )
};


const RenderPinned = ({ assignedPersonnel , config }: any) => {
    const { personnel , loading } = useAssignPersonnel(assignedPersonnel , config);
    return (
        <View
            style={ [
                { backgroundColor : "#F3F7FF" , marginTop : 5 } ,
                styles.horizontal ,
                styles.application
            ] }
        >
            { loading ? <></> : <EndorseIcon
                width={ fontValue(20) }
                height={ fontValue(20) }
            /> }
            { loading ? <ActivityIndicator/> :
              <Text
                  style={ { "marginLeft" : 3 , "marginRight" : 5 } }
                  color="#606A80"
                  size={ fontValue(10) }
                  numberOfLines={ 1 }
              >
                  { personnel != undefined ? `${ personnel?.firstName } ${ personnel?.lastName }` : `` }
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

export function ActivityItem(props: any) {
    const status = [CASHIER].indexOf(props?.role) != -1 ? PaymentStatusText(props?.activity?.paymentStatus) : StatusText(props?.activity?.status);
    const userActivity = props?.activity?.applicant?.user;
    const getStatus = getRole(props.currentUser , [EVALUATOR , DIRECTOR]) && status == FORAPPROVAL && !!props?.activity?.approvalHistory?.[0]?.userId && props?.activity?.approvalHistory?.[0]?.status !== FOREVALUATION ? APPROVED : getRole(props.currentUser , [ACCOUNTANT]) && !!props?.activity?.paymentMethod && !!props?.activity?.paymentHistory?.[0]?.status ? StatusText(props?.activity?.paymentHistory?.[0]?.status) : getRole(props.currentUser , [ACCOUNTANT]) && props?.activity?.approvalHistory[0].status == FOREVALUATION && props?.activity?.approvalHistory[1].status == FORAPPROVAL ? DECLINED : status;


    useEffect(() => {
        let unsubscribe = true;
        unsubscribe && props?.isOpen == props?.index && row[props?.index]?.close();
        unsubscribe && props?.isOpen == props?.index && !!row.length && row[props?.index]?.close();
        return () => {
            unsubscribe = false
        }
    } , [props.isOpen == props.index]);
    useEffect(() => {
        setSelectedMoreCircle(props.activityMore == props.index)
    } , [props.activityMore]);
    const [selectedMoreCircle , setSelectedMoreCircle] = useState(false);
    const onMoreCircle = () => {
        props.setActivityMore(props.index);
        if (!selectedMoreCircle) {
            setSelectedMoreCircle(props.activityMore == props.index)
        } else {
            setSelectedMoreCircle(value => !value)
        }

    };

    const _menu = useRef();
    return (

        <Hoverable>
            { isHovered => (

                <View style={ { backgroundColor : props.selected ? "#D4D3FF" : isHovered ? "#EEF3F6" : "#fff" } }>


                    <ActivitySwipeable
                        ref={ ref => row[props.index] = ref }
                        key={ props.index }
                        onSwipeableRightOpen={ () => {
                            closeRow(props.index)
                        } }
                        renderRightActions={
                            (progress , dragX) => props.swiper(props.index , progress , dragX , props.onPressUser)
                        }
                    >

                        <View style={ [styles.container] }>

                            <View style={ styles.applicationContainer }>
                                <View style={ { padding : 5 } }>
                                    <View style={ {
                                        height : 8 ,
                                        width : 8 ,
                                        backgroundColor : undefined ,//props?.activity?.dateRead  ? "#fff" : "#2863D6" ,
                                        borderRadius : 4
                                    } }/>
                                </View>
                                <View style={ [styles.containerBlur , { borderWidth : props.selected ? 4 : 0 , }] }>
                                    <TouchableOpacity onPress={ () => {
                                        props.onPressUser()
                                    } }>
                                        <View style={
                                            {
                                                borderRadius : fontValue(10) ,
                                                flex : 1 ,
                                                padding : fontValue(10) ,
                                                flexDirection : "row" ,
                                                alignItems : "center"
                                            }
                                        }>
                                            <ProfileImage
                                                size={ fontValue(45) }
                                                image={ userActivity?.profilePicture?.small }
                                                name={ `${ userActivity?.firstName } ${ userActivity?.lastName }` }
                                            />
                                            <View style={ styles.content }>
                                                <View style={ styles.section }>
                                                    <View style={ styles.name }>
                                                        <Text
                                                            //style={{color: props?.activity?.dateRead ? "#565961" : "#000"}}
                                                            style={ {
                                                                fontFamily : Bold ,
                                                                fontSize : fontValue(14 ,)
                                                            } }
                                                            numberOfLines={ 1 }
                                                        >
                                                            <Highlighter
                                                                highlightStyle={ { backgroundColor : '#BFD6FF' } }
                                                                searchWords={ [props?.searchQuery] }
                                                                textToHighlight={ `${ userActivity?.firstName } ${ userActivity?.lastName }` }
                                                            />

                                                        </Text>
                                                    </View>
                                                    <View style={ styles.date }>

                                                        <Text
                                                            style={
                                                                {
                                                                    color : "#606A80" ,
                                                                    fontFamily : Regular ,
                                                                    fontSize : fontValue(10)
                                                                }
                                                            }
                                                            numberOfLines={ 1 }
                                                        >
                                                            { formatDate(props.activity.createdAt) }
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={ styles.section }>
                                                    <View style={ { flex : 1 , alignItems : 'flex-start' } }>
                                                        <RenderApplication
                                                            applicationType={ props?.activity?.applicationType }/>
                                                    </View>

                                                    <RenderStatus
                                                        status={ getStatus }
                                                    />
                                                </View>
                                                { props?.isPinned && props?.activity?.assignedPersonnel &&
                                                <View style={ styles.section }>
                                                    <View style={ { flex : 1 , alignItems : 'flex-start' } }>
                                                        <RenderPinned config={ props.config }
                                                                      assignedPersonnel={ props?.activity?.assignedPersonnel }/>
                                                    </View>
                                                </View> }
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                { !isMobile && <View style={ { paddingHorizontal : selectedMoreCircle ? 14 : 18 , } }>
                                    <Menu  onClose={()=>{setSelectedMoreCircle(false)}}  onSelect={ value => setSelectedMoreCircle(true) }>

                                        <MenuTrigger onPress={ onMoreCircle } text={
                                            <View style={ [styles.moreCircle , selectedMoreCircle && {
                                                borderColor : 'rgba(116, 115, 189, 0.3)' ,
                                                borderWidth : 4 ,
                                            }] }>
                                                <MoreCircle selected={ selectedMoreCircle }/>
                                            </View> }>

                                        </MenuTrigger>

                                        <MenuOptions  optionsContainerStyle={ {
                                           marginTop: 50,

                                            shadowColor : "rgba(0,0,0,1)" ,
                                            paddingVertical : 10 ,
                                            borderRadius : 8 ,
                                            shadowOffset : {
                                                width : 0 ,
                                                height : 0
                                            } ,
                                            elevation : 45 ,
                                            shadowOpacity : 0.1 ,
                                            shadowRadius : 15 ,
                                        } }>
                                            <MenuOption value={ "Unread" }>
                                                <View style={ styles.menuItem }>
                                                    <UnseeIcon color={ "#000" }/><Text
                                                    style={ styles.menuItemText }>Unread</Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption value={ "Pin to top" }>
                                                <View style={ styles.menuItem }>
                                                    <PinToTopIcon width={16.67} height={16.67}/>
                                                    <Text style={ styles.menuItemText }>Pin to top</Text> </View>
                                            </MenuOption>
                                            <MenuOption value={ "Archive" }>
                                                <View style={ styles.menuItem }>
                                                    <BellMuteIcon width={16.67} height={16.67}/>
                                                    <Text style={ styles.menuItemText }>Mute</Text> </View>
                                            </MenuOption>
                                            <MenuOption
                                                style={ { borderBottomWidth : 1 , borderBottomColor : "#E5E5E5" } }
                                                value={ "Archive" }>
                                                <View style={ styles.menuItem }>
                                                    <ArchiveIcon width={16.67} height={16.67}/>
                                                    <Text style={ styles.menuItemText }>Archive</Text> </View>
                                            </MenuOption>

                                            <MenuOption value={ "Archive" }>
                                                <View style={ styles.menuItem }>
                                                    <DeleteIcon width={16.67} height={16.67}/>
                                                    <Text
                                                        style={ [styles.menuItemText , { color : "#CF0327" }] }>Delete</Text>
                                                </View>
                                            </MenuOption>
                                        </MenuOptions>

                                    </Menu>

                                </View> }

                            </View>


                        </View>


                    </ActivitySwipeable>

                </View>

            ) }
        </Hoverable>

    );
}

