const {
  SET_MEETINGS,
  ADD_MEETING,
  UPDATE_MEETING,
  REMOVE_MEETING,
  SET_MEETING,
  SET_MEETING_ID,
  SET_MEETING_PARTICIPANTS,
  ADD_MEETING_PARTICIPANTS,
  UPDATE_MEETING_PARTICIPANTS,
  REMOVE_MEETING_PARTICIPANTS
} = require('./types').default;

export function setMeetings(payload) {
  return {
    type: SET_MEETINGS,
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