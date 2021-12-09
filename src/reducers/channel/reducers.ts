import lodash from 'lodash';
const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,
} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action:any) {
  switch (action.type) {
    case SET_SELECTED_CHANNEL: {
      return state.setIn(['selectedChannel'], action.payload);
    }
    case SET_CHANNEL_LIST: {
      return state.setIn(['channelList'], action.payload);
    }
    case UPDATE_CHANNEL: {
      const updatedList = lodash.reject(state.channelList, ch => ch._id === action.payload._id);
      updatedList.push(action.payload);
      return state.setIn(['channelList'], updatedList);
    }
    case REMOVE_CHANNEL: {
      const updatedList = lodash.reject(state.channelList, ch => ch._id === action.payload);
      return state.setIn(['channelList'], updatedList);
    }
    default:
      return state;
  }
}
