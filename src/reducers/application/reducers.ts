import {
    ACCOUNTANT,
    APPROVED,
    CASHIER,
    DECLINED,
    DIRECTOR,
    EVALUATOR,
    FORAPPROVAL,
    FOREVALUATION,
    PAID,
    PENDING,
    UNVERIFIED,
    VERIFIED
} from "../activity/initialstate";
import _ from "lodash";

const {
    SET_PINNED_APPLICATION,
    SET_NOT_PINNED_APPLICATION,
    UPDATE_APPLICATION_STATUS,
    SET_APPLICATIONS,
    DELETE_APPLICATIONS,
    HANDLE_LOAD,
    READ_UNREAD_APPLICATIONS,
    SET_FILTER_RECT,
    SET_APPLICATION_ITEM,
    SET_RIGHT_LAYOUT_COMPONENT,
    SET_TOPBARNAV,
    SET_ACTIVITY_SIZE,
    SET_SELECTED_YPOS,
    UPDATE_APPLICATIONS,
    SET_HAS_CHANGE,
    SET_EDIT,
    SET_USER_PROFILE_FORM,
    SET_USER_ORIGINAL_PROFILE_FORM,
    UPDATE_CHANGE_EVENT,
    SET_DATA,
    SET_CALENDAR_VISIBLE,
    SET_DATE_END,
    SET_DATE_START,
    SET_PREV_DATE_END,
    SET_PREV_DATE_START,
    SET_DATA_ID,
    SET_SCENE_INDEX,
    SET_PROVINCES,
    FETCHING_PROVINCES,
    FETCHING_CITIES,
    SET_CITIES,
    FETCHING_SCHEDULES,
    SET_SCHEDULES,
    UPLOADING_REQUIREMENT,
    FETCHING_REGIONS,
    SET_REGIONS,
    FETCHING_SOA,
    SET_SOA,
    FETCH_SOA_SUCCESS,
    FETCH_SOA_ERROR,
    SAVING_APPLICATION,
    SAVE_APPLICATION_ERROR,
    SAVE_APPLICATION_SUCCESS,
    SET_REVIEWED,
    SET_COMPLETED,
    SET_REALTIME_COUNT,
    RESET_REALTIME_COUNT,
    SET_DECREMENT_REALTIME_COUNT,
    SET_DELETE_PINNED_APPLICATION,
    SET_MODAL_VISIBLE
} = require('./types').default;

const InitialState = require('./initialstate').default;
const initialState = new InitialState();

function isCashier(cashier: boolean, action: {}, i: number) {
    return (
        cashier ? ( action.payload?.data[i].paymentStatus == APPROVED
                || action.payload?.data[i].paymentStatus == PAID
                || action.payload?.data[i].paymentStatus == DECLINED)
            : (
                action.payload?.data[i].status == DECLINED || action.payload?.data[i].status == APPROVED
            ));
}

export default function basket(state = initialState, action = {}) {
    switch (action.type) {
        case SET_SELECTED_YPOS: {
            state = state.set('selectedYPos', action.payload);
            return state
        }
            case SET_SCENE_INDEX:{
                state = state.set('sceneIndex', action.payload);
                return state
            }
        case SET_DATA: {

            state = state.set('data', action.payload);
            return state
        }

        case SET_COMPLETED: {

            state = state.set('completed', action.payload);
            return state
        }

        case SET_REVIEWED: {

            state = state.set('reviewed', action.payload);
            return state
        }
        case FETCHING_REGIONS: {
            state = state.set('fetchingRegions', action.payload);
            return state

        }
        case SAVING_APPLICATION: {
            state = state.set('savingApplication', action.payload);
            return state

        }
        case SAVE_APPLICATION_ERROR: {
            state = state.set('saveApplicationError', action.payload);
            return state

        }
        case SAVE_APPLICATION_SUCCESS: {
            state = state.set('saveApplicationSuccess', action.payload);
            return state

        }
        case SET_REGIONS: {
            state = state.set('regions', action.payload);
            return state
        }
        case FETCHING_SCHEDULES: {
            state = state.set('fetchingSchedules', action.payload);
            return state

        }
        case SET_SCHEDULES: {
            state = state.set('schedules', action.payload);
            return state

        }
        case FETCHING_SOA: {
            state = state.set('fetchingSOA', action.payload);
            return state
        }
        case SET_SOA: {
            state = state.set('soa', action.payload);
            return state
        }
        case FETCH_SOA_SUCCESS: {
            state = state.set('fetchSOASuccess', action.payload);
            return state
        }
        case FETCH_SOA_ERROR: {
            state = state.set('fetchSOAError', action.payload);
            return state
        }
        case FETCHING_PROVINCES: {
            state = state.set('fetchingProvinces', action.payload);
            return state

        }
        case SET_PROVINCES: {
            state = state.set('provinces', action.payload);
            return state

        }
        case FETCHING_CITIES: {
            state = state.set('fetchingCities', action.payload);
            return state

        }
        case SET_CITIES: {
            state = state.set('cities', action.payload);
            return state

        }
        case SET_RIGHT_LAYOUT_COMPONENT: {

            state = state.set('rightLayoutComponent', action.payload);
            return state
        }
        case SET_ACTIVITY_SIZE: {
            state = state.set('activitySizeComponent', action.payload);
            return state
        }
        case SET_HAS_CHANGE: {
            state = state.set('hasChange', action.payload);
            return state
        }
        case SET_DATA_ID: {
            state = state.set('dataId', action.payload);
            return state
        }


        case SET_EDIT: {
            state = state.set('edit', action.payload);
            return state
        }
        case SET_FILTER_RECT: {

            state = state.set('filterRect', action.payload);
            return state
        }
        case SET_TOPBARNAV: {

            state = state.set('topBarNav', action.payload);
            return state
        }
        case SET_MODAL_VISIBLE: {

            if(action?.id == state.applicationItem?._id ) {
                state = state.set('modalVisible', action.payload);
            }else if(!action?.id){
                state = state.set('modalVisible', action.payload);
            }



            return state
        }
        case SET_USER_PROFILE_FORM: {
            state = state.set('userProfileForm', action.payload);
            return state
        }
        case SET_CALENDAR_VISIBLE: {
            state = state.set('calendarVisible', action.payload);
            return state
        }
        case SET_DATE_END: {
            state = state.set('dateEnd', action.payload);
            return state
        }
        case SET_DATE_START: {
            state = state.set('dateStart', action.payload);
            return state
        }

        case SET_PREV_DATE_END: {
            state = state.set('prevDateEnd', action.payload);
            return state
        }
        case SET_PREV_DATE_START: {
            state = state.set('prevDateStart', action.payload);
            return state
        }
        case SET_USER_ORIGINAL_PROFILE_FORM: {
            state = state.set('userOriginalProfileForm', action.payload);
            return state
        }
        case SET_APPLICATION_ITEM: {
            if(action.id == state.applicationItem?._id ) {
                state = state.set('applicationItemId', action.payload._id);
                state = state.set('applicationItem', action.payload);
            }else if(!action?.id){
                state = state.set('applicationItemId', action.payload._id);
                state = state.set('applicationItem', action.payload);
            }

            return state
        }


        case SET_PINNED_APPLICATION: {
            let pinned = [...state.pinnedApplications];
            const _updatePinnedCount = state.updatePinnedCount + 1;
            const pinnedIndex = pinned.findIndex((app: any) => {
                return app._id == action.payload._id
            })

            console.log(_updatePinnedCount, "SET_PINNED_APPLICATION - _updatePinnedCount")

            if(pinnedIndex > -1){
                pinned[pinnedIndex] = action.payload

            }else{

                if(( action.payload instanceof Object && !( action.payload instanceof Array))){
                    pinned = [...state.pinnedApplications, action.payload];
                }

            }


            state = state.set('pinnedApplications',pinned);
            state = state.set('updatePinnedCount',_updatePinnedCount);
            return state;
        }

        case SET_DELETE_PINNED_APPLICATION: {

            const _updatePinnedCount = state.updatePinnedCount + 1;

            const pinned = [...state.pinnedApplications];


            if (pinned.some(o => o._id == action.payload)) {
                const pinnedApplications =  pinned.filter(o => o._id !== action.payload)
                console.log(pinnedApplications, "pinnedApplications")
                state = state.set('pinnedApplications', pinnedApplications );
                state = state.set('updatePinnedCount', _updatePinnedCount );
            }
            return state;
        }

        case SET_REALTIME_COUNT: {
            const realtimecounts = (+state.realtimecounts)  + (action.payload);

            console.log(realtimecounts, "realtimecounts", action.payload, "action.payload")

            state = state.set('realtimecounts', realtimecounts );
            return state;
        }
        case RESET_REALTIME_COUNT: {
            state = state.set('realtimecounts', 0 );
            return state;
        }
        case SET_DECREMENT_REALTIME_COUNT: {

            const realtimecounts = (+state.realtimecounts)  - (action.payload);
            if(realtimecounts > -1){
                state = state.set('realtimecounts', realtimecounts );
            }

            return state;
        }
        case SET_NOT_PINNED_APPLICATION: {
            state = state.set('notPinnedApplications', action.payload);
            return state;
        }
        case DELETE_APPLICATIONS: {
            const notPinned = [...state.notPinnedApplications];
            const pinned = [...state.pinnedApplications];

            if (pinned.some(o => o._id == action.payload)) {
                state = state.set('pinnedApplications', pinned.filter(o => o._id !== action.payload));
            }
            if (notPinned.some(o => o._id == action.payload)) {
                state = state.set('notPinnedApplications', notPinned.filter(o => o._id !== action.payload));
            }

            return state;
        }

        case UPDATE_CHANGE_EVENT:{
            let _notPinnedApplications = [...state.notPinnedApplications]
            let _pinnedApplications = [...state.pinnedApplications]
            let flag = 1
            for (let i = 0; i < _notPinnedApplications?.length; i++) {

                if (_notPinnedApplications?.[i]?._id == action.payload?._id) {

                    _notPinnedApplications[i] = action.payload
                    state = state.set('notPinnedApplications', _notPinnedApplications);

                }
            }
            flag = 1
            for (let i = 0; i < _pinnedApplications?.length; i++) {


                if (_pinnedApplications?.[i]?._id == action.payload?._id) {
                    _pinnedApplications[i] = action.payload
                    state = state.set('pinnedApplications', _pinnedApplications);
                }
            }

            return state;
        }
        case UPLOADING_REQUIREMENT: {
            state = state.set('uploadingRequirement', action.payload);
            return state;
        }

        case READ_UNREAD_APPLICATIONS: {
            const notPinned = [...state.notPinnedApplications];
            const pinned = [...state.pinnedApplications];
            const notPinnedIndex = notPinned.findIndex((app: any) => {
                return app._id == action.payload.id
            })
            const pinnedIndex = pinned.findIndex((app: any) => {
                return app._id == action.payload.id
            })

            if (pinnedIndex != -1) {
                pinned[pinnedIndex] = action.payload.data
                state = state.set('pinnedApplications', pinned);

            }
            if (notPinnedIndex != -1) {
                notPinned[notPinnedIndex] = action.payload.data
                state = state.set('notPinnedApplications', notPinned);
            }

            return state;
        }
        case SET_APPLICATIONS: {
            console.log("SET_APPLICATIONS")
            const isNotPinned = []
            const isPinned = []
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;

            for (let i = 0; i < action.payload?.data?.length; i++) {

                if ((
                        (action.payload?.data?.[i]?.assignedPersonnel?.role || action.payload?.data?.[i]?.assignedPersonnel) == (action.payload?.user?.role?.key )) &&
                    !isCashier(cashier, action, i)) {

                    isPinned.push(action.payload?.data?.[i])
                } else {
                    isNotPinned.push(action.payload?.data?.[i])
                }
            }

            state = state.set('notPinnedApplications', [
                ..._.uniqBy(isNotPinned, "_id"),
            ]);
            state = state.set('pinnedApplications', [
                ..._.uniqBy(isPinned, "_id"),
            ]);

            return state
        }
        case HANDLE_LOAD: {

            const isNotPinned = []
            const isPinned = []
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;
            for (let i = 0; i < action.payload?.data.length; i++) {

                if (((action.payload?.data[i]?.assignedPersonnel?.role || action.payload?.data[i]?.assignedPersonnel) === action.payload?.user?.role?.key ) &&
                    !isCashier(cashier, action, i)) {
                    isPinned.push(action.payload?.data[i])
                } else {
                    isNotPinned.push(action.payload?.data[i])
                }
            }


            state = state.set('notPinnedApplications', [
                ..._.uniqBy(state.notPinnedApplications.concat(...isNotPinned), "_id"),
            ]);
            state = state.set('pinnedApplications', [
                ..._.uniqBy(state.pinnedApplications.concat(isPinned), "_id"),
            ]);
            return state
        }
        case UPDATE_APPLICATIONS: {

            const isNotPinned = []
            const isPinned = []
            for (let i = 0; i < action.payload?.data.length; i++) {
                if (((action.payload?.data[i]?.assignedPersonnel?._id || action.payload?.data[i]?.assignedPersonnel) === action.payload?.user?._id) &&
                    !isCashier(cashier, action, i)) {
                    isPinned.push(action.payload?.data[i])
                } else {
                    isNotPinned.push(action.payload?.data[i])
                }
            }


            state = state.set('notPinnedApplications', isNotPinned);
            state = state.set('pinnedApplications',isPinned);
            return state
        }
        case UPDATE_APPLICATION_STATUS: {
            const notPinned = [...state.notPinnedApplications];
            const pinned = [...state.pinnedApplications];
            const index = notPinned.findIndex((app: any) => {
                return app._id == action.payload.application._id
            })
            const pinnedIndex = pinned.findIndex((app: any) => {
                return app._id == action.payload.application._id
            })
            const cashier = [CASHIER].indexOf(action.payload.userType) != -1;
            const directorAndEvaluator = [ACCOUNTANT, DIRECTOR, EVALUATOR].indexOf(action.payload.userType) != -1;


            if (index != -1) {
                if (cashier) {
                    notPinned[index].paymentStatus = action.payload.status
                } else if (directorAndEvaluator) {
                    notPinned[index].status = action.payload.status
                    notPinned[index].assignedPersonnel = action.payload.assignedPersonnel
                }
                state = state.set("notPinnedApplications", notPinned)

            } else if (pinnedIndex != -1) {
                let _notPinned = {...pinned[pinnedIndex]}
                if (cashier) {
                    if (action.payload.status == VERIFIED ||
                        action.payload.status == UNVERIFIED ||
                        action.payload.status == PAID ||
                        action.payload.status == APPROVED ||
                        action.payload.status == DECLINED) {
                        _notPinned.paymentStatus = action.payload.status
                        state = state.set('pinnedApplications', pinned.filter(o => o._id !== pinned[pinnedIndex]._id));
                        state = state.set('notPinnedApplications', [
                            ...notPinned.concat(_notPinned),
                        ]);
                    } else {
                        pinned[pinnedIndex].paymentStatus = action.payload.status
                        state = state.set("pinnedApplications", pinned)
                    }
                } else if (directorAndEvaluator) {
                    if (action.payload.status == FORAPPROVAL || action.payload.status == FOREVALUATION || action.payload.status == APPROVED || action.payload.status == DECLINED) {
                        _notPinned.status = action.payload.status
                        _notPinned.assignedPersonnel = action.payload.assignedPersonnel?._id || action.payload.assignedPersonnel
                        state = state.set('pinnedApplications', pinned.filter(o => o._id !== pinned[pinnedIndex]._id));
                        state = state.set('notPinnedApplications', [
                            ...notPinned.concat(_notPinned),
                        ]);
                    } else {
                        pinned[pinnedIndex].status = action.payload.status
                        pinned[pinnedIndex].assignedPersonnel = action.payload.assignedPersonnel?._id || action.payload.assignedPersonnel
                        state = state.set("pinnedApplications", pinned)
                    }

                }

            }

            return state
        }
        default:
            return state;
    }
}
