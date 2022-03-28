import lodash from 'lodash';
import IParticipants from 'src/interfaces/IParticipants';
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
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function Meeting(state = initialState, action:any = {}) {
  switch (action.type) {
    case CONNECTION_STATUS: {
      return state.setIn(['connectionStatus'], action.payload);
    }
    case SET_NOTIFICATION: {
      return state.setIn(['meeting', 'notification'], action.payload);
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
      if (!action?.payload?.room?.lastMessage) {
        const meeting = state.normalizedMeetingList[action.payload._id];
        if (!meeting) {
          return state;
        }
        const leavingParticipant = lodash.find(meeting.participants, (p:IParticipants) => !lodash.find(action.payload.participants, (pt:IParticipants) => pt._id === p._id));
        const participants = action.payload.participants;
        const participantsId = action.payload.participantsId;

        let newState = state.setIn(['normalizedMeetingList', action.payload._id, 'participants'], participants)
        .setIn(['normalizedMeetingList', action.payload._id, 'participantsId'], participantsId);

        if (state.meeting?._id === action.payload._id) {
          newState = newState.setIn(['meeting', 'participants'], participants)
          .setIn(['meeting', 'participantsId'], participantsId);

          if (leavingParticipant) {
            const message = `${leavingParticipant.title || ''} ${leavingParticipant.firstName} is currently busy`;
            newState = newState.setIn(['meeting', 'notification'], message);
          }
        }
  
        if (action.payload.ended) {
          newState = newState.removeIn(['normalizeActiveMeetings', action.payload._id]);
        }
  
        return newState;
      } else {
        let newState = state.setIn(['normalizedMeetingList', action.payload._id], action.payload);

        if (state.meeting?._id === action.payload._id) {
          newState = newState.setIn(['meeting'], action.payload);
        }
  
        if (action.payload.ended) {
          newState = newState.removeIn(['normalizeActiveMeetings', action.payload._id]);
        }
  
        return newState;
      }
    }
    case SET_MEETING: {
      return state.setIn(['meeting'], action.payload)
    }
    case UPDATE_MEETING_PARTICIPANTS: {
      const meeting = state.normalizedMeetingList[action.payload._id];

      if (!meeting) {
        return state;
      }
      
      const participants = action.payload.participants;

      let newState = state.setIn(['normalizedMeetingList', action.payload._id, 'participants'], participants)

      if (!action.payload.ended) {
        newState = state.setIn(['normalizeActiveMeetings', action.payload._id, 'participants'], participants)
      }

      return newState;
    }
    case SET_ACTIVE_MEETING: {
      return state.setIn(['normalizeActiveMeetings'], action.payload);
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
