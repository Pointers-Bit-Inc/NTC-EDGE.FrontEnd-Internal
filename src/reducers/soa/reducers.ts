const { SET_AMNESTY, SET_SOA } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_AMNESTY: {
      state = state.set('amnesty', action.payload);
      return state
    }
    case SET_SOA: {
      state = state.set('soa', action.payload);
      return state
    }
    default:
      return state;
  }
}
