const { SET_REGIONS, SET_REGION, SET_EDIT_CONFIGURATION, SET_CONFIGURATIONS, SET_CONFIGURATION, SET_DELETE_CONFIGURATION , SET_ADD_CONFIGURATION} = require('./types').default;

export function setConfigurations(payload) {
  return {
    type: SET_CONFIGURATIONS,
    payload,
  };
}


export function setConfiguration(payload) {
  return {
    type: SET_CONFIGURATION,
    payload,
  };
}
export function setRegions(payload) {
  return {
    type: SET_REGIONS,
    payload,
  };
}
export function setRegion(payload) {
  return {
    type: SET_REGION,
    payload,
  };
}
export function setDeleteConfiguration(payload) {
  return {
    type: SET_DELETE_CONFIGURATION,
    payload,
  };
}
export function setEditConfiguration(payload) {
  return {
    type: SET_EDIT_CONFIGURATION,
    payload,
  };
}

export function setAddConfiguration(payload) {
  return {
    type: SET_ADD_CONFIGURATION,
    payload,
  };
}
