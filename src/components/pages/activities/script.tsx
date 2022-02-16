import {
    ACCOUNTANT ,
    APPROVED , CASHIER ,
    DECLINE ,
    DECLINED , DIRECTOR , EVALUATOR , FORAPPROVAL ,
    FOREVALUATION ,
    FORVERIFICATION ,
    PAID ,
    PENDING ,
    UNVERIFIED ,
    VERIFICATION ,
    VERIFIED
} from "../../../reducers/activity/initialstate";
import EvaluationStatus from "@assets/svg/evaluationstatus";
import {styles} from "@pages/activities/styles";
import CheckMarkIcon from "@assets/svg/checkmark";
import DeclineStatusIcon from "@assets/svg/declineStatus";
import React from "react";
import CheckIcon from "@assets/svg/check";
import axios from "axios";
import {BASE_URL} from "../../../services/config";
import {Alert} from "react-native";
import {readUnreadApplications} from "../../../reducers/application/actions";
import {Dispatch} from "redux";
import {Regular500} from "@styles/font";
import {Role , UserApplication} from "@pages/activities/interface";

export const PaymentStatusText = (status: string) => {

    switch (status) {
        case PAID :
            return VERIFIED;
        case PENDING:
            return FORVERIFICATION;
        case FOREVALUATION:
            return FORVERIFICATION;
        case DECLINED:
            return UNVERIFIED;
        case APPROVED:
            return VERIFIED;
        default:
            return status
    }
};
export const StatusText = (status: string) => {

    switch (status) {
        case PENDING:
            return FORAPPROVAL;
        case FOREVALUATION:
            return FORAPPROVAL;
        default:
            return status
    }
};


export const formatDate = (date: string) => {

    date = !date?.split("T") ? checkFormatIso(date) : date;
    let d = new Date(date) ,
        month = '' + (d.getMonth() + 1) ,
        day = '' + d.getDate() ,
        year = d.getFullYear()?.toString()?.slice(-2);
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [month , day,  year].join('/');
};
export const checkFormatIso = (date: string , separator?: string) => {

    if (!date) return;
    let isoStringSplit = date?.split("T")[0].split("-");

    let checkIfCorrectMonth = isoStringSplit[2] ,
        checkIfCorrectDay = isoStringSplit[1];

    if (checkIfCorrectMonth?.length == 3) {
        isoStringSplit[2] = checkIfCorrectMonth.substr(checkIfCorrectMonth.length - 2)
    }
    if (checkIfCorrectDay?.length == 3) {
        isoStringSplit[1] = checkIfCorrectMonth.substr(checkIfCorrectDay.length - 2)
    }
    let newDate = "";
    for (let i = 0; i < isoStringSplit.length; i++) {
        newDate += isoStringSplit[i] + (i != isoStringSplit.length - 1 ? (separator ? separator : "/") : "")
    }
    return newDate
};

export const statusColor = (status: string) => {

    if (status == FOREVALUATION) {

        return { color : "#F79E1B" ,   fontFamily: Regular500   }
    } else if (status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) {

        return { color : "#00AB76" ,   fontFamily: Regular500   , }
    } else if (status == DECLINED || status == DECLINE || status == UNVERIFIED) {

        return { color : "#CF0327" ,   fontFamily: Regular500   }
    } else {

        return { color : "#F79E1B" ,   fontFamily: Regular500   }
    }
};

export const statusIcon = (status: string , icon: any = styles.icon3 , item: any = 0) => {

    if (status == FOREVALUATION) {

        return <EvaluationStatus style={ [icon , { flex: 1, color : "#f66500" , }] }/>
    } else if ((status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) && item == 0) {
        return <CheckMarkIcon style={ [icon, {flex: 1} ]}/>
    } else if ((status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) && item == 1) {
        return <CheckIcon style={ [icon, {flex: 1} ] }/>
    } else if (status == DECLINED || status == DECLINE || status == UNVERIFIED) {
        return <DeclineStatusIcon style={ [icon, {flex: 1} ] }/>
    } else {
        return <EvaluationStatus style={ [icon , { flex: 1 , color : "#f66500" , }] }/>
    }
};
export const statusBackgroundColor = (status: string) => {

    if (status == FOREVALUATION) {
        return { backgroundColor : "#fef5e8" , }
    } else if (status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) {
        return { backgroundColor : "rgba(229,247,241,1)" , }
    } else if (status == DECLINED || status == DECLINE || status == UNVERIFIED) {
        return { backgroundColor : "#fae6e9" , }
    } else {
        return { backgroundColor : "#fef5e8" , }
    }
};

export const statusDimension = (status: any) => {
    if (status == FOREVALUATION) {
        return {}
    } else if (status == APPROVED) {
        return {}
    } else if (status == DECLINED || status == DECLINE) {
        return {}
    }
};

export const handleInfinityScroll = (event: any) => {
    let mHeight = event.nativeEvent.layoutMeasurement.height;
    let cSize = event.nativeEvent.contentSize.height;
    let Y = event.nativeEvent.contentOffset.y;
    if (Math.ceil(mHeight + Y) >= cSize) return true;
    return false;
};

interface FilterList {
    list: any;
    user: any;
    selectedClone: any;
    cashier: boolean;
    director: boolean;
    checker: boolean;
    evaluator: boolean;
    accountant: boolean;
}

export const getFilter = ({
                              list ,
                              user ,
                              selectedClone ,
                              cashier ,
                              director ,
                              checker ,
                              evaluator ,
                              accountant
                          }: FilterList) => list?.filter((item: any) => {
    let _approvalHistory = false;
    if (item?.approvalHistory.length) {
        _approvalHistory = item?.approvalHistory[0].userId == user?._id
    }
    const search =
        (selectedClone?.length ? selectedClone.indexOf(cashier ? PaymentStatusText(item.paymentStatus) : StatusText(item.status)) != -1 : true);
    if (cashier) {
        return (item?.status == APPROVED || item?.status == DECLINED && (item?.assignedPersonnel == user?._id || item?.assignedPersonnel === null || _approvalHistory) && search)
    } else if (director) {
        return (item?.status == FORAPPROVAL  || item?.status == FOREVALUATION || item?.status == PENDING || item?.status == APPROVED || item?.status == DECLINED) && (item?.assignedPersonnel == user?._id || item?.assignedPersonnel === null || _approvalHistory) && search
    } else if (checker || accountant) {
        return (item?.assignedPersonnel == user?._id || item?.status == APPROVED || item?.status == DECLINED || _approvalHistory) || search
    } else if (evaluator) {
        return item?.status.length > 0 || item?.assignedPersonnel == user?._id || item?.assignedPersonnel === null || _approvalHistory
    }
});

interface UnreadReadApplicationParams {
    unReadBtn: any;
    dateRead: any;
    id: any;
    config: { headers: { Authorization: string } };
    dispatch: Dispatch<any>;
    setUpdateUnReadReadApplication: (value: (((prevState: boolean) => boolean) | boolean)) => void;
    callback: (action: any) => void;
}

export const unreadReadApplication = ({unReadBtn, dateRead, id, config, dispatch, setUpdateUnReadReadApplication, callback}: UnreadReadApplicationParams) => {
    const action = unReadBtn ? (dateRead ? "unread" : "read") : "read";

    const params = {
        "action" : action
    };
    axios.post(BASE_URL + `/applications/${ id }/read-unread` , params , config).then((response) => {

        if (response?.data?.message) Alert.alert(response.data.message);

        return dispatch(readUnreadApplications({ id : id , data : response?.data?.doc }))
    }).then(() => {
        setUpdateUnReadReadApplication(true);
        callback(action)
    }).catch((err) => {
        console.warn(err)
    })
};
export const getRole = (user , arr) => arr.indexOf(user?.role?.key) != -1;


export const excludeStatus = (props: any , personnel: UserApplication) => getStatus(props , personnel) == FORVERIFICATION ||
    getStatus(props , personnel) == FORAPPROVAL ||
    getStatus(props , personnel) == FOREVALUATION;

export function getStatusText(props: any , personnel: UserApplication | undefined) {
    return getRole(props.user , [EVALUATOR , DIRECTOR]) && getStatus(props , personnel) == FORAPPROVAL && !!props?.approvalHistory?.[0]?.userId && props?.approvalHistory?.[0]?.status!==FOREVALUATION  ? StatusText(APPROVED) : getRole(props.user, [ACCOUNTANT]) && !!props.paymentMethod && !!props.paymentHistory?.[0]?.status ? StatusText(props.paymentHistory?.[0]?.status) :  getStatus(props , personnel);
}
export function getStatus(props: any , personnel: { _id: string | undefined; updatedAt: string | undefined; createdAt: string | undefined; username: string | undefined; role: Role | undefined; email: string | undefined; firstName: string | undefined; lastName: string | undefined; password: string | undefined; contactNumber: string | undefined; __v: number | undefined; address: string | undefined; profilePicture: ProfilePicture | undefined; avatar: string | undefined } , wordCase?: string) {

    return personnel &&
        (
            props?.user?.role?.key == CASHIER?
            (
                wordCase === "toUpperCase" ?
                PaymentStatusText(props?.paymentStatus).toUpperCase() :
                PaymentStatusText(props?.paymentStatus)) :
            (
                wordCase === "toUpperCase" ?
                (
                    StatusText(props.detailsStatus).toUpperCase()
                ) : (
                    StatusText(props.detailsStatus)
                )
            )
        );
}