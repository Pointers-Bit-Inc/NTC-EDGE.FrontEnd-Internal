import {CASHIER, DIRECTOR, EVALUATOR} from "../activity/initialstate";

const { SET_PINNED_APPLICATION, SET_NOT_PINNED_APPLICATION, UPDATE_ACTIVITY_STATUS } = require('./types').default;

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
    case UPDATE_ACTIVITY_STATUS: {

      const newArr = [...state.notPinnedApplications, ...state.pinnedApplications];
      const index = newArr.findIndex((app:any) => {

        return app._id == action.payload.application._id
      })

        console.log(index)
      if(index != -1){
        if([CASHIER].indexOf(action.payload.userType) != -1){

          newArr[index].application.paymentStatus = action.payload.status
        }else if([DIRECTOR, EVALUATOR].indexOf(action.payload.userType) != -1){
          newArr[index].status = action.payload.status
        }

        state = state.set("activities", newArr)
      }

      return state
    }
    default:
      return state;
  }
}