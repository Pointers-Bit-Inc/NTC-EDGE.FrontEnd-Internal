import {CASHIER, DIRECTOR, EVALUATOR} from "./initialstate";

const { SET_ACTIVITY, ON_CHECKED, SET_RESET_FILTER_STATUS,  SET_EDIT_MODAL_VISIBLE, SET_VISIBLE, ADD_ACTIVITY } = require('./types').default;

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
      newArr.push({...action.payload})
      state = state.set('activities', newArr)
      return state
    }

    case ON_CHECKED:{

      const newArr = state.get("statusCode");
      const index = newArr.findIndex((app:any) => {
        return app.id == action.payload.id
      })

      console.log("statusCode", newArr)

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
    case SET_EDIT_MODAL_VISIBLE:{
      return state.set('editModalVisible', action.payload)
    }
    case SET_RESET_FILTER_STATUS: {
      state = state.set("selectedChangeStatus", [])
       return state
    }
    default:
      return state;
  }
}
