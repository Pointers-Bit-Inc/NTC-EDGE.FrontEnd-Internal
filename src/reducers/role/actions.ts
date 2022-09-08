const { SET_ROLES, SET_ROLE, SET_DELETE_ROLE , SET_ADD_ROLE} = require('./types').default;

export function setRoles(payload) {
  return {
    type: SET_ROLES,
    payload,
  };
}

export function setRole(payload) {
  return {
    type: SET_ROLE,
    payload,
  };
}

export function setDeleteRole(payload) {
  return {
    type: SET_DELETE_ROLE,
    payload,
  };
}
export function setAddRole(payload) {
  return {
    type: SET_ADD_ROLE,
    payload,
  };
}
