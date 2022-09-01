const { SET_ROLES, SET_ROLE } = require('./types').default;

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

