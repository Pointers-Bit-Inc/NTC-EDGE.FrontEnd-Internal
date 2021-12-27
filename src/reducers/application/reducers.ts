import {CASHIER, DIRECTOR, EVALUATOR} from "../activity/initialstate";

const { SET_PINNED_APPLICATION, SET_NOT_PINNED_APPLICATION, UPDATE_APPLICATION_STATUS } = require('./types').default;

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
    case UPDATE_APPLICATION_STATUS: {

      const notPinned = [...state.notPinnedApplications];
      const pinned = [...state.pinnedApplications];
      const index = notPinned.findIndex((app:any) => {
        return app._id == action.payload.application._id
      })
      const pinnedIndex = pinned.findIndex((app:any) => {
        return app._id == action.payload.application._id
      })
      if(index != -1){
        if([CASHIER].indexOf(action.payload.userType) != -1){

          notPinned[index].paymentStatus = action.payload.status
        }else if([DIRECTOR, EVALUATOR].indexOf(action.payload.userType) != -1){
          notPinned[index].status = action.payload.status
          notPinned[index].assignedPersonnel = action.payload.assignedPersonnel
        }

        state = state.set("notPinnedApplications", notPinned)

      }else if(pinnedIndex != -1){

        if([CASHIER].indexOf(action.payload.userType) != -1){
          console.log(pinned[index].paymentStatus)
          pinned[index].paymentStatus = action.payload.status
        }else if([DIRECTOR, EVALUATOR].indexOf(action.payload.userType) != -1){

          pinned[index].status = action.payload.status
          pinned[index].assignedPersonnel = action.payload.assignedPersonnel
        }

        state = state.set("pinnedApplications", pinned)
      }

      return state
    }
    default:
      return state;
  }
}