const { SET_ACTIVITY, ON_CHECKED, SELECTED_CHANGE_STATUS, SET_VISIBLE } = require('./types').default;

export function setActivity(payload) {
  return {
    type: SET_ACTIVITY,
    payload,
  };
}
export function on_checked(payload) {
  return {
    type: ON_CHECKED,
    payload,
  };
}
export function selectChangeStatus(payload) {
  return {
    type: SELECTED_CHANGE_STATUS,
    payload,
  };
}

export function setVisible(payload) {

  return {
    type: SET_VISIBLE,
    payload,
  };
}
