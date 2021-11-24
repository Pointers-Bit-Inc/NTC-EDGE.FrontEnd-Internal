const { SET_USER } = require('./types').default;

export function setUser(payload) {
  return {
    type: SET_USER,
    payload,
  };
}
