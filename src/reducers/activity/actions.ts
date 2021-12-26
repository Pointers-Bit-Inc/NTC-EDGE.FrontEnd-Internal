const { SET_ACTIVITY, ON_CHECKED, SELECTED_CHANGE_STATUS, SET_VISIBLE , UPDATE_ACTIVITY_STATUS,ADD_ACTIVITY} = require('./types').default;

export function setActivity(payload) {
  return {
    type: SET_ACTIVITY,
    payload,
  };
}

export function addActivity(payload) {
  return {
    type: ADD_ACTIVITY,
    payload,
  };
}
export function on_checked(payload) {
  return {
    type: ON_CHECKED,
    payload,
  };
}

export function updateActivityStatus(payload) {
  return {
    type: UPDATE_ACTIVITY_STATUS,
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
