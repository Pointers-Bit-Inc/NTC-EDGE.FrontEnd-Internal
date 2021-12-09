import lodash from 'lodash';
const {
  SET_MESSAGES,
  UPDATE_MESSAGES,
  REMOVE_MESSAGES,
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action:any) {
  switch (action.type) {
    case SET_MESSAGES: {
      return state.setIn(['messages'], action.payload);
    }
    case UPDATE_MESSAGES: {
      const updatedList = lodash.reject(state.messages, ch => ch._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['messages'], updatedList);
    }
    case REMOVE_MESSAGES: {
      const updatedList = lodash.reject(state.messages, ch => ch._id === action.payload);
      return state.setIn(['messages'], updatedList);
    }
    default:
      return state;
  }
}
