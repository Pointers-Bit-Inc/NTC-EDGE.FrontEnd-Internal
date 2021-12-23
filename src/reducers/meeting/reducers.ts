import lodash from 'lodash';
const {
  SET_MEETINGS,
  ADD_MEETING,
  UPDATE_MEETING,
  REMOVE_MEETING,
  SET_MEETING_ID,
  SET_MEETING_PARTICIPANTS,
  ADD_MEETING_PARTICIPANTS,
  REMOVE_MEETING_PARTICIPANTS,
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action = {}) {
  switch (action.type) {
    case SET_MEETINGS: {
      return state.setIn(['list'], action.payload);
    }
    case ADD_MEETING: {
      const list = lodash.clone(state.list);
      list.push(action.payload);
      return state.setIn(['list'], list);
    }
    case UPDATE_MEETING: {
      const updatedList = lodash.reject(state.list, l => l._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['list'], updatedList);
    }
    case REMOVE_MEETING: {
      const updatedList = lodash.reject(state.list, l => l._id === action.payload);
      return state.setIn(['list'], updatedList);
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
    case REMOVE_MEETING_PARTICIPANTS: {
      const updatedList = lodash.reject(state.meetingParticipants, l => l._id === action.payload);
      return state.setIn(['meetingParticipants'], updatedList);
    }
    default:
      return state;
  }
}
