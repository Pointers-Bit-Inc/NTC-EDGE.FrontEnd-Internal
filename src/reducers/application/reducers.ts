import {
    APPROVED,
    CASHIER,
    DECLINED,
    DIRECTOR,
    EVALUATOR,
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
    READ_UNREAD_APPLICATIONS
} = require('./types').default;

const InitialState = require('./initialstate').default;
const initialState = new InitialState();
export default function basket(state = initialState, action = {}) {


    switch (action.type) {
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

            if(pinned.some(o => o._id == action.payload)){
                state = state.set('pinnedApplications', pinned.filter(o => o._id !== action.payload));
            }
            if(notPinned.some(o => o._id == action.payload)){
                state = state.set('notPinnedApplications', notPinned.filter(o => o._id !== action.payload));
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

            if(pinnedIndex != -1){
                pinned[pinnedIndex] = action.payload.data
                state = state.set('pinnedApplications', pinned);

            }
            if(notPinnedIndex != -1){
                notPinned[notPinnedIndex] = action.payload.data
                state = state.set('notPinnedApplications', notPinned);
            }

            return state;
        }
        case SET_APPLICATIONS : {
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;
            const isNotPinned = []
            const isPinned = []
            for (let i = 0; i < action.payload?.data?.docs?.length; i++) {

                if ((action.payload?.data.docs[i].assignedPersonnel ==  action.payload?.user?._id)  && !(cashier ? ( action.payload?.data?.docs[i].paymentStatus == APPROVED || action.payload?.data?.docs[i].paymentStatus == DECLINED) : (action.payload?.data?.docs[i].status == DECLINED || action.payload?.data?.docs[i].status == APPROVED)) ) {
                    isPinned.push(action.payload?.data?.docs[i])
                } else {
                    isNotPinned.push(action.payload?.data?.docs[i])
                }
            }

            state = state.set('notPinnedApplications', isNotPinned);
            state = state.set('pinnedApplications', isPinned);

            return state
        }
        case HANDLE_LOAD: {

            const isNotPinned = []
            const isPinned = []
            const cashier = [CASHIER].indexOf(action.payload?.user?.role?.key) != -1;
            for (let i = 0; i < action.payload?.data.length; i++) {

                if (action.payload?.data[i].assignedPersonnel === action.payload?.user?._id && !(cashier ? (action.payload?.data[i].paymentStatus == PENDING  || action.payload?.data[i].paymentStatus == APPROVED || action.payload?.data[i].paymentStatus == DECLINED) : (action.payload?.data[i].status == DECLINED || action.payload?.data[i].status == APPROVED)) ) {
                    isPinned.push(action.payload?.data[i])
                } else {      
                    isNotPinned.push(action.payload?.data[i])
                }
            }
            state = state.set('notPinnedApplications', [
                ...state.notPinnedApplications.concat(...isNotPinned),
            ]);
            state = state.set('pinnedApplications', [
                ...state.pinnedApplications.concat(isPinned),
            ]);
            return state
        }
        case UPDATE_APPLICATION_STATUS: {
                              console.log( action.payload.application._id)
            const notPinned = [...state.notPinnedApplications];
            const pinned = [...state.pinnedApplications];
            const index = notPinned.findIndex((app: any) => {
                return app._id == action.payload.application._id
            })

            console.log(index)
            const pinnedIndex = pinned.findIndex((app: any) => {
                return app._id == action.payload.application._id
            })
            const cashier = [CASHIER].indexOf(action.payload.userType) != -1;
            const directorAndEvaluator = [DIRECTOR, EVALUATOR].indexOf(action.payload.userType) != -1;
            if (index != -1) {
                console.log("index")
                if (cashier) {
                    notPinned[index].paymentStatus = action.payload.status
                } else if (directorAndEvaluator) {
                    console.log("director and evaluator:", notPinned[index].status)

                    notPinned[index].status = action.payload.status
                    notPinned[index].assignedPersonnel = action.payload.assignedPersonnel
                }

                state = state.set("notPinnedApplications", notPinned)

            } else if (pinnedIndex != -1) {
                let _notPinned = {...pinned[pinnedIndex]}
                if (cashier) {
                    if(action.payload.status == VERIFIED ||
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
                      if(action.payload.status == APPROVED || action.payload.status == DECLINED) {

                          _notPinned.status = action.payload.status
                          _notPinned.assignedPersonnel = action.payload.assignedPersonnel

                          state = state.set('pinnedApplications', pinned.filter(o => o._id !== pinned[pinnedIndex]._id));
                          state = state.set('notPinnedApplications', [
                              ...notPinned.concat(_notPinned),
                          ]);
                      } else{
                          pinned[pinnedIndex].status = action.payload.status
                          pinned[pinnedIndex].assignedPersonnel = action.payload.assignedPersonnel
                          state = state.set("pinnedApplications", pinned)
                      }




                }
                console.log("pinned index 4")

            }

            return state
        }

        default:
            return state;
    }
}