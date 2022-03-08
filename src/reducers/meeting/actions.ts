import IMeetings from "src/interfaces/IMeetings";
import IParticipants from "src/interfaces/IParticipants";

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
  SET_NOTIFICATION,
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

export function removeMeeting(payload:string) {
  return {
    type: REMOVE_MEETING,
    payload,
  };
}

export function setMeeting(payload:IMeetings) {
  return {
    type: SET_MEETING,
    payload,
  };
}

export function setMeetingId(payload:string) {
  return {
    type: SET_MEETING_ID,
    payload,
  };
}

export function setMeetingParticipants(payload:Array<IParticipants>) {
  return {
    type: SET_MEETING_PARTICIPANTS,
    payload,
  };
}

export function addMeetingParticipants(payload:IParticipants) {
  return {
    type: ADD_MEETING_PARTICIPANTS,
    payload,
  };
}

export function updateMeetingParticipants(payload:IParticipants) {
  return {
    type: UPDATE_MEETING_PARTICIPANTS,
    payload,
  };
}

export function removeMeetingParticipants(payload:string) {
  return {
    type: REMOVE_MEETING_PARTICIPANTS,
    payload,
  };
}

export function setActiveMeetings(payload:NormalizedMeeting) {
  return {
    type: SET_ACTIVE_MEETING,
    payload,
  };
}

export function addActiveMeeting(payload:IMeetings) {
  return {
    type: ADD_ACTIVE_MEETING,
    payload,
  };
}

export function updateActiveMeeting(payload:IMeetings) {
  return {
    type: UPDATE_ACTIVE_MEETING,
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