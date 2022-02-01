import {
    APPROVED,
    DECLINE,
    DECLINED,
    FOREVALUATION, FORVERIFICATION,
    PAID, PENDING,
    UNVERIFIED,
    VERIFICATION,
    VERIFIED
} from "../../../reducers/activity/initialstate";
import EvaluationStatus from "@assets/svg/evaluationstatus";
import {styles} from "@pages/activities/styles";
import CheckMarkIcon from "@assets/svg/checkmark";
import DeclineStatusIcon from "@assets/svg/declineStatus";
import React from "react";
import CheckIcon from "@assets/svg/check";

export const PaymentStatusText = (status: string) => {

    switch (status) {
        case PAID :
            return VERIFIED
        case PENDING:
            return FORVERIFICATION
        case FOREVALUATION:
            return FORVERIFICATION
        case DECLINED:
            return UNVERIFIED
        case APPROVED:
            return VERIFIED
        default:
            return status
    }
}
export const StatusText = (status: string) => {

    switch (status) {
        case PENDING:
            return FOREVALUATION
        default:
            return status
    }
}



export const formatDate = (date: string) => {

    date = !date?.split("T") ? checkFormatIso(date) : date
    let d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('/');
}
export const checkFormatIso = (date: string, separator?: string) => {

          if(!date) return
    let isoStringSplit = date?.split("T")[0].split("-")

    let checkIfCorrectMonth = isoStringSplit[2],
        checkIfCorrectDay = isoStringSplit[1]

    if (checkIfCorrectMonth?.length == 3) {
        isoStringSplit[2] = checkIfCorrectMonth.substr(checkIfCorrectMonth.length - 2)
    }
    if (checkIfCorrectDay?.length == 3) {
        isoStringSplit[1] = checkIfCorrectMonth.substr(checkIfCorrectDay.length - 2)
    }
    let newDate = ""
    for (let i = 0; i < isoStringSplit.length; i++) {
        newDate += isoStringSplit[i] + (i != isoStringSplit.length - 1 ? (separator ? separator : "/") : "")
    }
    return newDate
}

export const statusColor = (status: string) => {

    if (status == FOREVALUATION) {

        return {color: "#f66500"}
    } else if (status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) {

        return {color: "#34c759"}
    } else if (status == DECLINED || status == DECLINE) {

        return {color: "#cf0327"}
    } else {

        return {color: "#f66500"}
    }
}

export const statusIcon = (status: string, icon: any = styles.icon3, item:any = 0) => {

    if (status == FOREVALUATION) {

        return <EvaluationStatus style={[icon, {color: "#f66500",}]}/>
    } else if ((status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) && item == 0) {
        return <CheckMarkIcon style={[icon]}/>
    }else if ((status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) && item == 1) {
        return <CheckIcon style={[icon]}/>
    } else if (status == DECLINED || status == DECLINE) {
        return <DeclineStatusIcon style={[icon]}/>
    } else {
        return <EvaluationStatus style={[icon, {color: "#f66500",}]}/>
    }
}
export const statusBackgroundColor = (status: string) => {

    if (status == FOREVALUATION) {
        return {backgroundColor: "#fef5e8",}
    } else if (status == VERIFIED || status == APPROVED || status == PAID || status == VERIFICATION) {
        return {backgroundColor: "rgba(229,247,241,1)",}
    } else if (status == DECLINED || status == DECLINE) {
        return {backgroundColor: "#fae6e9",}
    } else {
        return {backgroundColor: "#fef5e8",}
    }
}

export const statusDimension = (status: any) => {
    if (status == FOREVALUATION) {
        return {}
    } else if (status == APPROVED) {
        return {}
    } else if (status == DECLINED || status == DECLINE) {
        return {}
    }
}

export function handleInfinityScroll(event: any) {
    let mHeight = event.nativeEvent.layoutMeasurement.height;
    let cSize = event.nativeEvent.contentSize.height;
    let Y = event.nativeEvent.contentOffset.y;
    if (Math.ceil(mHeight + Y) >= cSize) return true;
    return false;
}