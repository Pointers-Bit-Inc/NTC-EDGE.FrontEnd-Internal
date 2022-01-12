const { SET_USER, UPDATE_USER } = require('./types').default;

export function setUser(payload) {
  return {
    type: SET_USER,
    payload,
  };
}

export function updateUser(payload) {
  return {
    type: UPDATE_USER,
    payload,
  };
}

