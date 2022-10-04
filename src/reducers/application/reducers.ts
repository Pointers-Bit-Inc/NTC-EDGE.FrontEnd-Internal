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
    SET_DATE_START
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

        case SET_DATA: {

            state = state.set('data', action.payload);
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
        case SET_USER_ORIGINAL_PROFILE_FORM: {
            state = state.set('userOriginalProfileForm', action.payload);
            return state
        }
        case SET_APPLICATION_ITEM: {
            state = state.set('applicationItemId', action.payload._id);
            state = state.set('applicationItem', action.payload);
            return state
        }
        case SET_PINNED_APPLICATION: {
            state = state.set('pinnedApplications', action.payload);
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
            const isNotPinned = []
            const isPinned = []
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;


            for (let i = 0; i < action.payload?.data?.length; i++) {

                if ((
                        (action.payload?.data?.[i]?.assignedPersonnel?._id || action.payload?.data?.[i]?.assignedPersonnel) == action.payload?.user?._id) &&
                    !isCashier(cashier, action, i)) {

                    isPinned.push(action.payload?.data?.[i])
                } else {
                    isNotPinned.push(action.payload?.data?.[i])
                }
            }

            state = state.set('notPinnedApplications', [
                ...isNotPinned
            ]);
            state = state.set('pinnedApplications', [
                ...isPinned
            ]);

            return state
        }
        case HANDLE_LOAD: {

            const isNotPinned = []
            const isPinned = []
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;
            for (let i = 0; i < action.payload?.data.length; i++) {
                if (((action.payload?.data[i]?.assignedPersonnel?._id || action.payload?.data[i]?.assignedPersonnel) === action.payload?.user?._id) &&
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
