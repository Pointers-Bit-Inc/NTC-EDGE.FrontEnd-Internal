const { SET_AMNESTY, SET_SOA } = require('./types').default;

export function setAmnesty(payload) {
  return {
    type: SET_AMNESTY,
    payload,
  };
}
export function setSoa(payload) {
  return {
    type: SET_SOA,
    payload,
  };
}
