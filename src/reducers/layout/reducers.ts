const { SET_CHAT_LAYOUT, SET_DRAWER_LAYOUT } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_CHAT_LAYOUT: {
      state = state.set('chatLayout', action.payload);
      return state
    }
    case SET_DRAWER_LAYOUT: {
      state = state.set('drawerLayout', action.payload);
      return state
    }
    default:
      return state;
  }
}
