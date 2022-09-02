const { SET_USER, UPDATE_USER, RESET_USER, SET_BIOMETRICS_LOGIN, SET_SESSION_TOKEN, SET_PERMISSION, SET_PERMISSION_ITEM} = require('./types').default;

export function setUser(payload) {
  return {
    type: SET_USER,
    payload,
  };
}

export function resetUser() {
  return {
    type: RESET_USER,
  };
}

export function updateUser(payload) {
  return {
    type: UPDATE_USER,
    payload,
  };
}

export function setBiometricsLogin(payload) {
  return {
    type: SET_BIOMETRICS_LOGIN,
    payload
  }
}
export function setSessionToken(payload) {
  return {
    type: SET_SESSION_TOKEN,
    payload
  }
}

export function setPermission(payload) {
  return {
    type: SET_PERMISSION,
    payload
  }
}

export function setPermissionItem(payload) {
  return {
    type: SET_PERMISSION_ITEM,
    payload
  }
}

