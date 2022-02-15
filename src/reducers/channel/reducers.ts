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
        .setIn(['messages'], []);
      }
      return state.setIn(['selectedChannel'], action.payload);
    }
    case SET_CHANNEL_LIST: {
      return state.setIn(['channelList'], action.payload);
    }
    case ADD_TO_CHANNEL_LIST: {
      return state.setIn(['channelList'], [...state.channelList, ...action.payload]);
    }
    case ADD_CHANNEL: {
      const channelList = lodash.clone(state.channelList);
      channelList.push(action.payload);
      return state.setIn(['channelList'], channelList);
    }
    case UPDATE_CHANNEL: {
      const updatedList = lodash.reject(state.channelList, ch => ch._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['channelList'], updatedList)
      .setIn(['selectedChannel'], action.payload);
    }
    case REMOVE_CHANNEL: {
      const updatedList = lodash.reject(state.channelList, ch => ch._id === action.payload);
      return state.setIn(['channelList'], updatedList);
    }
    case SET_MESSAGES: {
      return state.setIn(['messages'], action.payload);
    }
    case ADD_TO_MESSAGES: {
      return state.setIn(['messages'], [...state.messages, ...action.payload]);
    }
    case ADD_MESSAGES: {
      const messageList = lodash.clone(state.messages);
      messageList.push(action.payload);
      return state.setIn(['messages'],messageList);
    }
    case UPDATE_MESSAGES: {
      const updatedList = lodash.reject(state.messages, ch => ch._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['messages'], updatedList);
    }
    case REMOVE_MESSAGES: {
      const updatedList = lodash.reject(state.messages, ch => ch._id === action.payload);
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
        .setIn(['channelList'], [])
        .setIn(['messages'], [])
        .setIn(['selectedMessage'], {})
        .setIn(['meetingList'], [])
        .setIn(['searchValue'], '');
    }
    default:
      return state;
  }
}
