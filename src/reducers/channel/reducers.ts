import lodash from 'lodash';
import IMeetings from 'src/interfaces/IMeetings';
import IMessages from 'src/interfaces/IMessages';
const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  ADD_TO_CHANNEL_LIST,
  ADD_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,

  SET_MESSAGES,
  ADD_TO_MESSAGES,
  ADD_MESSAGES,
  UPDATE_MESSAGES,

  SET_SELECTED_MESSAGES,
  REMOVE_SELECTED_MESSAGES,
  ADD_MEETING_CHANNEL,
  UPDATE_MEETING_CHANNEL,
  REMOVE_MEETING_CHANNEL,
  SET_MEETINGS_CHANNEL,

  RESET_CHANNEL,
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action:any) {
  switch (action.type) {
    case SET_SELECTED_CHANNEL: {
      if (!action.isChannelExist) {
        return state.setIn(['selectedChannel'], action.payload)
        .setIn(['normalizedMessages'], {});
      }
      return state.setIn(['selectedChannel'], action.payload);
    }
    case SET_CHANNEL_LIST: {
      return state.setIn(['normalizedChannelList'], action.payload);
    }
    case ADD_TO_CHANNEL_LIST: {
      return state.setIn(['normalizedChannelList'], {...state.normalizedChannelList, ...action.payload});
    }
    case ADD_CHANNEL: {
      return state.setIn(['normalizedChannelList', action.payload._id], action.payload);
    }
    case UPDATE_CHANNEL: {
      let newState = state;
      const channel = state.normalizedChannelList[action.payload._id];

      if(channel.updatedAt > action.payload.updatedAt) {
        return newState;
      }

      if(channel) {
        newState = newState.setIn(['normalizedChannelList', action.payload._id, 'name'], action.payload.name);
        if (action.payload.lastMessage) newState = newState.setIn(['normalizedChannelList', action.payload._id, 'lastMessage'], action.payload.lastMessage);
        newState = newState.setIn(['normalizedChannelList', action.payload._id, 'participants'], action.payload.participants);
        newState = newState.setIn(['normalizedChannelList', action.payload._id, 'participantsId'], action.payload.participantsId);
        newState = newState.setIn(['normalizedChannelList', action.payload._id, 'updatedAt'], action.payload.updatedAt);

        if (state.selectedChannel._id === action.payload._id) {
          newState = newState.setIn(['selectedChannel', 'participants'], action.payload.participants)
          .setIn(['selectedChannel', 'participantsId'], action.payload.participantsId);
        }
      }

      return newState;
    }
    case REMOVE_CHANNEL: {
      return state.removeIn(['normalizedChannelList', action.payload]);
    }
    case SET_MESSAGES: {
      return state.setIn(['normalizedMessages'], action.payload);
    }
    case ADD_TO_MESSAGES: {
      return state.setIn(['normalizedMessages'], {...state.normalizedMessages, ...action.payload});
    }
    case ADD_MESSAGES: {
      let newState = state;

      if (state.selectedChannel._id === action.payload.roomId) {
        newState = newState.setIn(['normalizedMessages', action.payload._id], action.payload)
        .setIn(['selectedChannel', 'lastMessage'], action.payload)
        .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      }

      newState = newState.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
      .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt)

      return newState;
    }
    case UPDATE_MESSAGES: {
      let newState = state;

      if (state.selectedChannel._id === action.payload.roomId) {
        newState = newState.setIn(['normalizedMessages', action.payload._id], action.payload)
        .setIn(['selectedChannel', 'lastMessage'], action.payload)
        .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      }

      if (state.normalizedChannelList[action.payload.roomId].lastMessage._id === action.payload._id) {
          newState = newState.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
          .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt);
      }

      return newState;
    }
    case SET_SELECTED_MESSAGES: {
      return state.setIn(['selectedMessage'], action.payload);
    }
    case REMOVE_SELECTED_MESSAGES: {
      return state.setIn(['selectedMessage'], {});
    }
    case SET_MEETINGS_CHANNEL: {
      return state.setIn(['meetingList'], action.payload);
    }
    case ADD_MEETING_CHANNEL: {
      const list = lodash.clone(state.meetingList);
      list.push(action.payload);
      return state.setIn(['meetingList'], list);
    }
    case UPDATE_MEETING_CHANNEL: {
      const updatedList = lodash.reject(state.meetingList, (l:IMeetings) => l._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['meetingList'], updatedList);
    }
    case REMOVE_MEETING_CHANNEL: {
      const updatedList = lodash.reject(state.meetingList, (l:IMeetings) => l._id === action.payload);
      return state.setIn(['meetingList'], updatedList);
    }
    case RESET_CHANNEL: {
      return state.setIn(['selectedChannel'], {})
        .setIn(['agora'], {})
        .setIn(['normalizedChannelList'], [])
        .setIn(['normalizedMessages'], [])
        .setIn(['selectedMessage'], {})
        .setIn(['meetingList'], [])
        .setIn(['searchValue'], '');
    }
    default:
      return state;
  }
}
