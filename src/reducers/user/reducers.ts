const { SET_USER } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_USER: {
      return {
        ...action.payload,
      };
    }
    default:
      return state;
  }
}
