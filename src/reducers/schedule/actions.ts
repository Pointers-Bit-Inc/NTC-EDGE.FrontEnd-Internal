const { SET_EDIT_SCHEDULE, SET_SCHEDULES, SET_SCHEDULE, SET_DELETE_SCHEDULE , SET_ADD_SCHEDULE} = require('./types').default;

export function setSchedules(payload) {
  return {
    type: SET_SCHEDULES,
    payload,
  };
}

export function setSchedule(payload) {
  return {
    type: SET_SCHEDULE,
    payload,
  };
}

export function setDeleteSchedule(payload) {
  return {
    type: SET_DELETE_SCHEDULE,
    payload,
  };
}
export function setEditSchedule(payload) {
  return {
    type: SET_EDIT_SCHEDULE,
    payload,
  };
}

export function setAddSchedule(payload) {
  return {
    type: SET_ADD_SCHEDULE,
    payload,
  };
}
