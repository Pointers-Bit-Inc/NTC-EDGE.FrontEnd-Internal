const { SET_THEME } = require('./types').default;

export function setTheme(payload) {
  return {
    type: SET_THEME,
    payload,
  };
}
