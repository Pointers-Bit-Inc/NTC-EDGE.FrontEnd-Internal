const { SET_ROLES, SET_ROLE, SET_DELETE_ROLE, SET_ADD_ROLE } = require('./types').default;

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
    case SET_DELETE_ROLE: {
      let roles = [...state.roles]

      let exist = state?.roles?.findIndex((role) => action?.payload == role.id)
      if (exist > -1) {
        roles.splice(exist, 1);
      }
      state = state.set('roles', roles);
      return state
    }

    case SET_ADD_ROLE: {
      let roles = [...state.roles]
      roles.push(action?.payload)
      state = state.set('roles', roles);
    }
    default:
      return state;
  }
}
