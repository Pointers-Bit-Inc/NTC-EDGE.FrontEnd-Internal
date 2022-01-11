const { SET_PINNED_APPLICATION, SET_NOT_PINNED_APPLICATION, UPDATE_APPLICATION_STATUS, SET_APPLICATIONS} = require('./types').default;

export function setPinnedApplication(payload) {
  return {
    type: SET_PINNED_APPLICATION,
    payload,
  };
}

export function updateApplicationStatus(payload) {
  return {
    type: UPDATE_APPLICATION_STATUS,
    payload,
  };
}

export function setNotPinnedApplication(payload) {
  return {
    type: SET_NOT_PINNED_APPLICATION,
    payload,
  };
}

export function setApplications(payload) {
  return {
    type: SET_APPLICATIONS,
    payload,
  };
}