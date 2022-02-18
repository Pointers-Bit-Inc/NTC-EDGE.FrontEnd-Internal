import lodash from 'lodash';
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
  REMOVE_MESSAGES,

  SET_SELECTED_MESSAGES,
  REMOVE_SELECTED_MESSAGES,
  ADD_MEETING_CHANNEL,
  UPDATE_MEETING_CHANNEL,
  REMOVE_MEETING_CHANNEL,
  SET_MEETINGS_CHANNEL,

  SET_SEARCH_VALUE,
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
      return state.setIn(['normalizedChannelList', action.payload._id], action.payload);
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
      // if (state.selectedChannel._id === action.payload.roomId) {
      //   return state.setIn(['normalizedMessages', action.payload._id], action.payload)
      //   .setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
      //   .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt)
      //   .setIn(['selectedChannel', 'lastMessage'], action.payload)
      //   .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      // } else {
      //   return state.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
      //   .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt)
      // }
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
      // if (state.selectedChannel._id === action.payload.roomId) {
      //   if (state.normalizedChannelList[action.payload.roomId].lastMessage._id === action.payload._id) {
      //     return state.setIn(['normalizedMessages', action.payload._id], action.payload)
      //     .setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
      //     .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt)
      //     .setIn(['selectedChannel', 'lastMessage'], action.payload)
      //     .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      //   } else {
      //     return state.setIn(['normalizedMessages', action.payload._id], action.payload)
      //     .setIn(['selectedChannel', 'lastMessage'], action.payload)
      //     .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      //   }
      // } else {
      //   if (state.normalizedChannelList[action.payload.roomId].lastMessage._id === action.payload._id) {
      //     return state.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
      //     .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt)
      //   }
      //   return state;
      // }
    }
    case REMOVE_MESSAGES: {
      const updatedList = lodash.reject(state.messages, m => m._id === action.payload);
      return state.setIn(['messages'], updatedList);
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
      const updatedList = lodash.reject(state.meetingList, l => l._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['meetingList'], updatedList);
    }
    case REMOVE_MEETING_CHANNEL: {
      const updatedList = lodash.reject(state.meetingList, l => l._id === action.payload);
      return state.setIn(['meetingList'], updatedList);
    }
    case SET_SEARCH_VALUE: {
      return state.setIn(['searchValue'], action.payload);
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
