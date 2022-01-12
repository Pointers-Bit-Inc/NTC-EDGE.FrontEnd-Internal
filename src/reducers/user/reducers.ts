const { SET_USER, UPDATE_USER } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USER: {
      return {
        ...action.payload
      };
    }
    case UPDATE_USER:{

      let payload = {}

     if(state.email != action.payload?.email){
       payload.email = action.payload?.email
     }
      if(state.contactNumber != action.payload?.contactNumber){
        payload.contactNumber = action.payload?.contactNumber
      }

      return {
        ...state,
        ...payload
      }
    }
    default:
      return state;
  }
}
