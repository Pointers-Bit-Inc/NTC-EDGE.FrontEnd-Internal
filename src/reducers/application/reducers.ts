import {
    APPROVED,
    CASHIER,
    DECLINED,
    DIRECTOR,
    EVALUATOR, FOREVALUATION,
    FORVERIFICATION,
    PAID,
    PENDING,
    UNVERIFIED, VERIFIED
} from "../activity/initialstate";

const {
    SET_PINNED_APPLICATION,
    SET_NOT_PINNED_APPLICATION,
    UPDATE_APPLICATION_STATUS,
    SET_APPLICATIONS,
    DELETE_APPLICATIONS,
    HANDLE_LOAD,
    READ_UNREAD_APPLICATIONS,
    SET_TAB_BAR_HEIGHT
} = require('./types').default;

const InitialState = require('./initialstate').default;
const initialState = new InitialState();
export default function basket(state = initialState, action = {}) {


    if (action.type === SET_TAB_BAR_HEIGHT) {
        {
            state = state.set('tabBarHeight' , action.payload);
            return state
        }
    } else if (action.type === SET_PINNED_APPLICATION) {
        {
            state = state.set('pinnedApplications' , action.payload);
            return state;
        }
    } else if (action.type === SET_NOT_PINNED_APPLICATION) {
        {
            state = state.set('notPinnedApplications' , action.payload);
            return state;
        }
    } else if (action.type === DELETE_APPLICATIONS) {
        {
            const notPinned = [...state.notPinnedApplications];
            const pinned = [...state.pinnedApplications];

            if (pinned.some(o => o._id == action.payload)) {
                state = state.set('pinnedApplications' , pinned.filter(o => o._id !== action.payload));
            }
            if (notPinned.some(o => o._id == action.payload)) {
                state = state.set('notPinnedApplications' , notPinned.filter(o => o._id !== action.payload));
            }

            return state;
        }
    } else if (action.type === READ_UNREAD_APPLICATIONS) {
        {
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
                state = state.set('pinnedApplications' , pinned);

            }
            if (notPinnedIndex != -1) {
                notPinned[notPinnedIndex] = action.payload.data
                state = state.set('notPinnedApplications' , notPinned);
            }

            return state;
        }
    } else if (action.type === SET_APPLICATIONS) {
        {
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;
            const isNotPinned = []
            const isPinned = []
            for (let i = 0; i < action.payload?.data?.docs?.length; i++) {
                if ((action.payload?.data.docs[i].assignedPersonnel == action.payload?.user?._id) &&
                    !(cashier ?
                        (action.payload?.data?.docs[i].paymentStatus == PAID || action.payload?.data?.docs[i].paymentStatus == APPROVED || action.payload?.data?.docs[i].paymentStatus == DECLINED) : (action.payload?.data?.docs[i].status == DECLINED || action.payload?.data?.docs[i].status == APPROVED))) {

                    isPinned.push(action.payload?.data?.docs[i])
                } else {
                    isNotPinned.push(action.payload?.data?.docs[i])
                }
            }

            state = state.set('notPinnedApplications' , isNotPinned);
            state = state.set('pinnedApplications' , isPinned);

            return state
        }
    } else if (action.type === HANDLE_LOAD) {
        {

            const isNotPinned = []
            const isPinned = []
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;
            for (let i = 0; i < action.payload?.data.length; i++) {

                if (action.payload?.data[i].assignedPersonnel === action.payload?.user?._id &&
                    !(cashier ? (action.payload?.data[i].paymentStatus == PENDING
                            || action.payload?.data[i].paymentStatus == APPROVED
                            || action.payload?.data[i].paymentStatus == PAID
                            || action.payload?.data[i].paymentStatus == DECLINED)
                        : (action.payload?.data[i].status == DECLINED || action.payload?.data[i].status == APPROVED))) {
                    isPinned.push(action.payload?.data[i])
                } else {
                    isNotPinned.push(action.payload?.data[i])
                }
            }
            state = state.set('notPinnedApplications' , [
                ...state.notPinnedApplications.concat(...isNotPinned) ,
            ]);
            state = state.set('pinnedApplications' , [
                ...state.pinnedApplications.concat(isPinned) ,
            ]);
            return state
        }
    } else if (action.type === UPDATE_APPLICATION_STATUS) {
        {

            const notPinned = [...state.notPinnedApplications];
            const pinned = [...state.pinnedApplications];
            const index = notPinned.findIndex((app: any) => {
                return app._id == action.payload.application._id
            })
            const pinnedIndex = pinned.findIndex((app: any) => {
                return app._id == action.payload.application._id
            })
            const cashier = [CASHIER].indexOf(action.payload.userType) != -1;
            const directorAndEvaluator = [DIRECTOR , EVALUATOR].indexOf(action.payload.userType) != -1;


            if (index != -1) {
                if (cashier) {
                    notPinned[index].paymentStatus = action.payload.status
                } else if (directorAndEvaluator) {
                    notPinned[index].status = action.payload.status
                    notPinned[index].assignedPersonnel = action.payload.assignedPersonnel
                }
                state = state.set("notPinnedApplications" , notPinned)

            } else if (pinnedIndex != -1) {
                let _notPinned = { ...pinned[pinnedIndex] }
                if (cashier) {
                    if (action.payload.status == VERIFIED ||
                        action.payload.status == UNVERIFIED ||
                        action.payload.status == PAID ||
                        action.payload.status == APPROVED ||
                        action.payload.status == DECLINED) {
                        _notPinned.paymentStatus = action.payload.status
                        state = state.set('pinnedApplications' , pinned.filter(o => o._id !== pinned[pinnedIndex]._id));
                        state = state.set('notPinnedApplications' , [
                            ...notPinned.concat(_notPinned) ,
                        ]);
                    } else {
                        pinned[pinnedIndex].paymentStatus = action.payload.status
                        state = state.set("pinnedApplications" , pinned)
                    }
                } else if (directorAndEvaluator) {
                    console.log("outside directoe and evaluator")
                    if (action.payload.status == FOREVALUATION || action.payload.status == APPROVED || action.payload.status == DECLINED) {
                        console.log("if directoe and evaluator")
                        _notPinned.status = action.payload.status
                        _notPinned.assignedPersonnel = action.payload.assignedPersonnel
                        console.log(_notPinned.assignedPersonnel , action.payload.assignedPersonnel)
                        state = state.set('pinnedApplications' , pinned.filter(o => o._id !== pinned[pinnedIndex]._id));
                        state = state.set('notPinnedApplications' , [
                            ...notPinned.concat(_notPinned) ,
                        ]);
                    } else {
                        console.log("else directoe and evaluator")
                        pinned[pinnedIndex].status = action.payload.status
                        pinned[pinnedIndex].assignedPersonnel = action.payload.assignedPersonnel
                        state = state.set("pinnedApplications" , pinned)
                    }

                }

            }

            return state
        }
    } else {
        return state;
    }
}