const {  SET_FEE_FLATTEN,
  SET_FEE_ORIGINAL_FLATTEN,
  SET_HAS_CHANGE_FEE,SET_COMMISSION,
  SET_FEE, SET_REGIONS, SET_REGION, SET_EDIT_CONFIGURATION, SET_CONFIGURATIONS, SET_CONFIGURATION, SET_DELETE_CONFIGURATION , SET_ADD_CONFIGURATION, SET_COMMISSIONER} = require('./types').default;

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

export function setCommissioner(payload) {
  return {
    type: SET_COMMISSIONER,
    payload,
  };
}
export function setRegion(payload) {
  return {
    type: SET_REGION,
    payload,
  };
}

export function setFee(payload) {
  return {
    type: SET_FEE,
    payload,
  };
}
export function setFeeFlatten(payload) {
  return {
    type: SET_FEE_FLATTEN,
    payload,
  };
}
export function setFeeOriginalFlatten(payload) {
  return {
    type: SET_FEE_ORIGINAL_FLATTEN,
    payload,
  };
}


export function setHasChangeFee(payload) {
  return {
    type: SET_HAS_CHANGE_FEE,
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
