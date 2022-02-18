import lodash from 'lodash';
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

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case CONNECTION_STATUS: {
      return state.setIn(['connectionStatus'], action.payload);
    }
    case SET_MEETINGS: {
      return state.setIn(['normalizedMeetingList'], action.payload);
    }
    case ADD_TO_MEETINGS: {
      return state.setIn(['normalizedMeetingList'], {...state.list, ...action.payload});
    }
    case ADD_MEETING: {
      let newState = state.setIn(['normalizedMeetingList', action.payload._id], action.payload);

      if (!action.payload.ended) {
        newState = newState.setIn(['normalizeActiveMeetings', action.payload._id], action.payload);
      }

      return newState;
    }
    case UPDATE_MEETING: {
      let newState = state.setIn(['normalizedMeetingList', action.payload._id], action.payload);

      if (state.meeting?._id === action.payload._id) {
        newState = newState.setIn(['meeting'], action.payload);
      }

      if (action.payload.ended) {
        newState = newState.removeIn(['normalizeActiveMeetings', action.payload._id]);
      }

      return newState;
    }
    case REMOVE_MEETING: {
      const updatedList = lodash.reject(state.list, l => l._id === action.payload);
      return state.setIn(['list'], updatedList);
    }
    case SET_MEETING: {
      return state.setIn(['meeting'], action.payload)
    }
    case SET_MEETING_ID: {
      return state.setIn(['meetingId'], action.payload);
    }
    case SET_MEETING_PARTICIPANTS: {
      return state.setIn(['meetingParticipants'], action.payload);
    }
    case ADD_MEETING_PARTICIPANTS: {
      const list = lodash.clone(state.meetingParticipants);
      list.push(action.payload);
      return state.setIn(['meetingParticipants'], list);
    }
    case UPDATE_MEETING_PARTICIPANTS: {
      const updatedList = lodash.reject(state.meetingParticipants, l => l._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['meetingParticipants'], updatedList);
    }
    case REMOVE_MEETING_PARTICIPANTS: {
      const updatedList = lodash.reject(state.meetingParticipants, l => l._id === action.payload);
      return state.setIn(['meetingParticipants'], updatedList);
    }
    case SET_ACTIVE_MEETING: {
      return state.setIn(['normalizeActiveMeetings'], action.payload);
    }
    case ADD_ACTIVE_MEETING: {
      return state.setIn(['normalizeActiveMeetings', action.payload._id], action.payload);
    }
    case UPDATE_ACTIVE_MEETING: {
      const updatedList = lodash.reject(state.activeMeetings, l => l._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['activeMeetings'], updatedList);
    }
    case REMOVE_ACTIVE_MEETING: {
      return state.removeIn(['normalizeActiveMeetings', action.payload]);
    }
    case RESET_MEETING: {
      return state.setIn(['normalizedMeetingList'], {})
        .setIn(['activeMeetings'], [])
        .setIn(['meeting'], {});
    }
    default:
      return state;
  }
}
