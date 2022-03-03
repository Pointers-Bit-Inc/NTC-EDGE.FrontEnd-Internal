const { SET_USER, UPDATE_USER, RESET_USER } = require('./types').default;

export function setUser(payload) {
  return {
    type: SET_USER,
    payload,
  };
}

export function resetUser() {
  return {
    type: RESET_USER,
  };
}

export function updateUser(payload) {
  return {
    type: UPDATE_USER,
    payload,
  };
}

