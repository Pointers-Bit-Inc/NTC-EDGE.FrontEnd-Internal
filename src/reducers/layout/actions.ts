const { SET_CHAT_LAYOUT, SET_DRAWER_LAYOUT } = require('./types').default;

export function setChatLayout(payload) {
  return {
    type: SET_CHAT_LAYOUT,
    payload,
  };
}
export function setDrawerLayout(payload) {
  return {
    type: SET_DRAWER_LAYOUT,
    payload,
  };
}
