import {CASHIER, DIRECTOR, EVALUATOR} from "../activity/initialstate";

const { SET_PINNED_APPLICATION, SET_NOT_PINNED_APPLICATION, UPDATE_APPLICATION_STATUS, SET_APPLICATIONS, HANDLE_LOAD } = require('./types').default;

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
    case SET_APPLICATIONS :{
      const isNotPinned = []
      const isPinned = []
      for (let i = 0; i < action.payload.docs.length; i++) {

          if(action.payload.docs[i].isPinned){
            isPinned.push(action.payload.docs[i])
          }  else{
            isNotPinned.push(action.payload.docs[i])
          }
      }
            
      state = state.set('notPinnedApplications', isNotPinned);
      state = state.set('pinnedApplications', isPinned);
      return state
    }
    case HANDLE_LOAD:{
      const isNotPinned = []
      const isPinned = []
      for (let i = 0; i < action.payload.docs.length; i++) {

        if(action.payload.docs[i].isPinned){
          isPinned.push(action.payload.docs[i])
        }  else{
          isNotPinned.push(action.payload.docs[i])
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

      const notPinned = [...state.notPinnedApplications];
      const pinned = [...state.pinnedApplications];
      const index = notPinned.findIndex((app:any) => {
        return app._id == action.payload.application._id
      })
      const pinnedIndex = pinned.findIndex((app:any) => {
        return app._id == action.payload.application._id
      })
      const cashier = [CASHIER].indexOf(action.payload.userType) != -1;
      const directorAndEvaluator = [DIRECTOR, EVALUATOR].indexOf(action.payload.userType) != -1;
      if(index != -1){
        if(cashier){

          notPinned[index].paymentStatus = action.payload.status
        }else if(directorAndEvaluator){
          notPinned[index].status = action.payload.status
          notPinned[index].assignedPersonnel = action.payload.assignedPersonnel
        }

        state = state.set("notPinnedApplications", notPinned)

      }else if(pinnedIndex != -1){

        if(cashier){

          pinned[pinnedIndex].paymentStatus = action.payload.status
        }else if(directorAndEvaluator){

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