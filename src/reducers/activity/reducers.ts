import {APPROVED} from "./initialstate";

const { SET_ACTIVITY, ON_CHECKED, UPDATE_ACTIVITY_STATUS, SET_VISIBLE, ADD_ACTIVITY } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {

  switch (action.type) {
    case SET_ACTIVITY: {
      state = state.set('activities', action.payload);
      return state
    }
    case ADD_ACTIVITY: {
      const newArr = [...state.activities]
      newArr.push(action.payload)
     state = state.set('activities', newArr)
      return state
    }
    case UPDATE_ACTIVITY_STATUS: {
      const newArr = state.activities;
      const index = newArr.findIndex((app:any) => {
        return app.activityDetails.application._id == action.payload.application._id
      })
      if(index != -1){
        newArr[index].activityDetails.status = action.payload.status
        state = state.set("activities", newArr)
      }

      return state
    }
    case ON_CHECKED:{
      const newArr = state.get("statusCode");
      const index = newArr.findIndex((app:any) => {
        return app.id == action.payload.id
      })

      newArr[index].checked = !newArr[index].checked
      state = state.set("statusCode", newArr)
      let selectChangeStatus = []
      for (let i = 0; i < newArr.length; i++) {
        if (newArr[i].checked) {
          selectChangeStatus.push(newArr[i].status)
        }
      }
      state = state.set("selectedChangeStatus", selectChangeStatus)

      return state
    }
    case SET_VISIBLE:{
      return state.set('visible', action.payload)
    }
    default:
      return state;
  }
}
