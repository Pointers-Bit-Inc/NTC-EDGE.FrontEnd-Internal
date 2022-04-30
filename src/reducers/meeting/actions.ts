import IMeetings from "src/interfaces/IMeetings";
import IParticipants from "src/interfaces/IParticipants";

const {
  SET_MEETINGS,
  ADD_TO_MEETINGS,
  ADD_MEETING,
  UPDATE_MEETING,
  SET_MEETING,
  UPDATE_MEETING_PARTICIPANTS,
  SET_ACTIVE_MEETING,
  REMOVE_ACTIVE_MEETING,
  RESET_MEETING,
  CONNECTION_STATUS,
  SET_NOTIFICATION,
  SET_OPTIONS,
} = require('./types').default;

interface NormalizedMeeting {
  [x:string]: IMeetings
}

export function setConnectionStatus(payload:string) {
  return {
    type: CONNECTION_STATUS,
    payload,
  };
}

export function setNotification(payload:string) {
  return {
    type: SET_NOTIFICATION,
    payload,
  };
}

export function setMeetings(payload:NormalizedMeeting) {
  return {
    type: SET_MEETINGS,
    payload,
  };
}

export function addToMeetings(payload:IMeetings) {
  return {
    type: ADD_TO_MEETINGS,
    payload,
  };
}

export function addMeeting(payload:IMeetings) {
  return {
    type: ADD_MEETING,
    payload,
  };
}

export function updateMeeting(payload:IMeetings) {
  return {
    type: UPDATE_MEETING,
    payload,
  };
}

export function setMeeting(payload:IMeetings|null) {
  return {
    type: SET_MEETING,
    payload,
  };
}

export function updateMeetingParticipants(payload:IParticipants) {
  return {
    type: UPDATE_MEETING_PARTICIPANTS,
    payload,
  };
}

export function setActiveMeetings(payload:NormalizedMeeting) {
  return {
    type: SET_ACTIVE_MEETING,
    payload,
  };
}

export function removeActiveMeeting(payload:string) {
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

export function setOptions(payload:any) {
  return {
    type: SET_OPTIONS,
    payload,
  }
}