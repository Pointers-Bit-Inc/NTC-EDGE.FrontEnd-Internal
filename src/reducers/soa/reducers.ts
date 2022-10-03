const { SET_AMNESTY } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_AMNESTY: {
      state = state.set('amnesty', action.payload);
      return state
    }
    default:
      return state;
  }
}
