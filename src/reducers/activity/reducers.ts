const { SET_ACTIVITY, ON_CHECKED, SELECTED_CHANGE_STATUS, SET_VISIBLE } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {

  switch (action.type) {
    case SET_ACTIVITY: {
      return {
        ...action.payload,
      };
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
