const {ON_CHECKED_FILTER, SET_UPDATE_INCREMENT, SET_TAB_NAME, SET_FEED_VISIBLE, SET_DROPDOWN_VISIBLE, SET_ACTIVITY, ON_CHECKED, SELECTED_CHANGE_STATUS, SET_VISIBLE , SET_RESET_FILTER_STATUS,SET_EDIT_MODAL_VISIBLE, ADD_ACTIVITY} = require('./types').default;

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
export function onCheckedFilter(payload) {
  return {
    type: ON_CHECKED_FILTER,
    payload,
  };
}


export function selectChangeStatus(payload) {
  return {
    type: SELECTED_CHANGE_STATUS,
    payload,
  };
}
export function setEditModalVisible(payload) {

  return {
    type: SET_EDIT_MODAL_VISIBLE,
    payload,
  };
}
export function setVisible(payload) {

  return {
    type: SET_VISIBLE,
    payload,
  };
}

export function setFeedVisible(payload) {

  return {
    type: SET_FEED_VISIBLE,
    payload,
  };
}
export function setTabName(payload) {

  return {
    type: SET_TAB_NAME,
    payload,
  };
}
export function setUpdateIncrement(payload) {

  return {
    type: SET_UPDATE_INCREMENT,
    payload,
  };
}
export function setDropdownVisible(payload) {

  return {
    type: SET_DROPDOWN_VISIBLE,
    payload,
  };
}
export function setResetFilterStatus(payload) {

  return {
    type: SET_RESET_FILTER_STATUS,
    payload,
  };
}
