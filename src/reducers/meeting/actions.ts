const {
  SET_MEETINGS,
  ADD_TO_MEETINGS,
  ADD_MEETING,
  UPDATE_MEETING,
  REMOVE_MEETING,
  SET_MEETING,
  SET_MEETING_ID,
  SET_MEETING_PARTICIPANTS,
  ADD_MEETING_PARTICIPANTS,
  UPDATE_MEETING_PARTICIPANTS,
  REMOVE_MEETING_PARTICIPANTS,
  SET_ACTIVE_MEETING,
  ADD_ACTIVE_MEETING,
  UPDATE_ACTIVE_MEETING,
  REMOVE_ACTIVE_MEETING,
  RESET_MEETING,
  CONNECTION_STATUS,
} = require('./types').default;

export function setConnectionStatus(payload) {
  return {
    type: CONNECTION_STATUS,
    payload,
  };
}

export function setMeetings(payload) {
  return {
    type: SET_MEETINGS,
    payload,
  };
}

export function addToMeetings(payload) {
  return {
    type: ADD_TO_MEETINGS,
    payload,
  };
}

export function addMeeting(payload) {
  return {
    type: ADD_MEETING,
    payload,
  };
}

export function updateMeeting(payload) {
  return {
    type: UPDATE_MEETING,
    payload,
  };
}

export function removeMeeting(payload) {
  return {
    type: REMOVE_MEETING,
    payload,
  };
}

export function setMeeting(payload) {
  return {
    type: SET_MEETING,
    payload,
  };
}

export function setMeetingId(payload) {
  return {
    type: SET_MEETING_ID,
    payload,
  };
}

export function setMeetingParticipants(payload) {
  return {
    type: SET_MEETING_PARTICIPANTS,
    payload,
  };
}

export function addMeetingParticipants(payload) {
  return {
    type: ADD_MEETING_PARTICIPANTS,
    payload,
  };
}

export function updateMeetingParticipants(payload) {
  return {
    type: UPDATE_MEETING_PARTICIPANTS,
    payload,
  };
}

export function removeMeetingParticipants(payload) {
  return {
    type: REMOVE_MEETING_PARTICIPANTS,
    payload,
  };
}

export function setActiveMeetings(payload) {
  return {
    type: SET_ACTIVE_MEETING,
    payload,
  };
}

export function addActiveMeeting(payload) {
  return {
    type: ADD_ACTIVE_MEETING,
    payload,
  };
}

export function updateActiveMeeting(payload) {
  return {
    type: UPDATE_ACTIVE_MEETING,
    payload,
  };
}

export function removeActiveMeeting(payload) {
  return {
    type: REMOVE_ACTIVE_MEETING,
    payload,
  };
}

export function resetMeeting() {
  return {
    type: RESET_MEETING
  }
}