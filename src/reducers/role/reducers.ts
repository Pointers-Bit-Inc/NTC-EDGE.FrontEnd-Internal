const { SET_ROLES, SET_ROLE } = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_ROLES: {
      state = state.set('roles', action.payload);
      return state
    }
    case SET_ROLE: {
      state = state.set('role', action.payload);
      return state
    }
    default:
      return state;
  }
}
