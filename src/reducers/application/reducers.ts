import {CASHIER, DIRECTOR, EVALUATOR} from "../activity/initialstate";

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

                        console.log("im back", )
            const isNotPinned = []
            const isPinned = []
            for (let i = 0; i < action.payload?.docs.length; i++) {

                if (action.payload.docs[i].isPinned) {
                    isPinned.push(action.payload.docs[i])
                } else {
                    isNotPinned.push(action.payload.docs[i])
                }
            }

            state = state.set('notPinnedApplications', isNotPinned);
            state = state.set('pinnedApplications', isPinned);
           
            return state
        }
        case HANDLE_LOAD: {
            const isNotPinned = []
            const isPinned = []
            for (let i = 0; i < action.payload.length; i++) {

                if (action.payload[i].isPinned) {
                    isPinned.push(action.payload[i])
                } else {
                    isNotPinned.push(action.payload[i])
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
            console.log(pinnedIndex)
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
                if (cashier) {

                    pinned[pinnedIndex].paymentStatus = action.payload.status
                } else if (directorAndEvaluator) {

                    pinned[pinnedIndex].status = action.payload.status
                    pinned[pinnedIndex].assignedPersonnel = action.payload.assignedPersonnel
                }

                state = state.set("pinnedApplications", pinned)
            }

            return state
        }

        default:
            return state;
    }
}