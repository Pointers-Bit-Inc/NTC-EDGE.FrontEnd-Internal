import lodash from 'lodash';
const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  ADD_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,

  SET_MESSAGES,
  ADD_MESSAGES,
  UPDATE_MESSAGES,
  REMOVE_MESSAGES,

  SET_SELECTED_MESSAGES,
  REMOVE_SELECTED_MESSAGES,
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action:any) {
  switch (action.type) {
    case SET_SELECTED_CHANNEL: {
      return state.setIn(['selectedChannel'], action.payload)
      .setIn(['messages'], []);
    }
    case SET_CHANNEL_LIST: {
      return state.setIn(['channelList'], action.payload);
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
    default:
      return state;
  }
}
