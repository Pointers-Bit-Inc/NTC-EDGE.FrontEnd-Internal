const { SET_CHAT_LAYOUT } = require('./types').default;

export function setChatLayout(payload) {
  return {
    type: SET_CHAT_LAYOUT,
    payload,
  };
}
