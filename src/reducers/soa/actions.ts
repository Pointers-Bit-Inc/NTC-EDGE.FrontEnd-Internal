const { SET_AMNESTY } = require('./types').default;

export function setAmnesty(payload) {
  return {
    type: SET_AMNESTY,
    payload,
  };
}
