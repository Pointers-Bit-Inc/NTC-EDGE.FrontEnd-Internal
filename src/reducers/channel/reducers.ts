import lodash from 'lodash';
import IMeetings from 'src/interfaces/IMeetings';
import IMessages from 'src/interfaces/IMessages';
import IParticipants from 'src/interfaces/IParticipants';
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

  SET_FILES,
  ADD_TO_FILES,
  ADD_FILES,
  UPDATE_FILES,

  SET_SELECTED_MESSAGES,
  REMOVE_SELECTED_MESSAGES,
  ADD_MEETING_CHANNEL,
  UPDATE_MEETING_CHANNEL,
  REMOVE_MEETING_CHANNEL,
  SET_MEETINGS_CHANNEL,

  RESET_CHANNEL,

  RESET_PENDING_MESSAGES,
  ADD_PENDING_MESSAGE,
  SET_PENDING_MESSAGE_ERROR,
  REMOVE_PENDING_MESSAGE,

  UPDATE_PARTICIPANTS,
  UPDATE_PARTICIPANTS_STATUS,

    SET_HAS_NEW_CHAT

} = require('./types').default;

const InitialState = require('./initialstate').default;

const initialState = new InitialState();

export default function basket(state = initialState, action:any) {
  switch (action.type) {
    case SET_SELECTED_CHANNEL: {
      if (!!state.normalizedChannelList[action.payload._id]) {
        return state.setIn(['selectedChannel'], state.normalizedChannelList[action.payload._id]);
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

      if(channel && channel.updatedAt > action.payload.updatedAt) {
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
          .setIn(['selectedChannel', 'participantsId'], action.payload.participantsId)
          .setIn(['selectedChannel', 'name'], action.payload.name)
          .setIn(['selectedChannel', 'hasRoomName'], action.payload.hasRoomName)
          .setIn(['selectedChannel', 'isGroup'], action.payload.isGroup);
        }
      } else {
        newState = newState.setIn(['normalizedChannelList', action.payload._id], action.payload);
      }

      return newState;
    }
    case REMOVE_CHANNEL: {
      let newState = state.removeIn(['normalizedChannelList', action.payload]);

      if (state.selectedChannel?._id === action.payload) {
        newState = newState.setIn(['selectedChannel'], {});
      }

      return newState;
    }
    case SET_MESSAGES: {
      return state.setIn(['channelMessages', action.channelId, 'messages'], action.payload);
    }
    case ADD_TO_MESSAGES: {
      const messages = state.channelMessages[action.channelId]?.messages || {};
      return state.setIn(['channelMessages', action.channelId, 'messages'], {...messages, ...action.payload});
    }
    case ADD_MESSAGES: {
      let newState = state;

      if (state.selectedChannel._id === action.payload.roomId) {
        newState = newState.setIn(['channelMessages', action.channelId, 'messages', action.payload._id], action.payload)
        .setIn(['selectedChannel', 'lastMessage'], action.payload)
        .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      }

      if (state.normalizedChannelList[action.payload.roomId]) {
        newState = newState.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
        .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt)
      }

      return newState;
    }
    case UPDATE_MESSAGES: {
      let newState = state;

      if (state.selectedChannel._id === action.payload.roomId) {
        newState = newState.setIn(['channelMessages', action.channelId, 'messages', action.payload._id], action.payload)
        .setIn(['selectedChannel', 'lastMessage'], action.payload)
        .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);

        if (action.payload.deleted) {
          newState = newState.removeIn(['files', action.payload._id]);
        }
      }

      if (state.normalizedChannelList[action.payload.roomId]?.lastMessage?._id === action.payload._id) {
          newState = newState.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
          .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt);
      }

      return newState;
    }


    case SET_HAS_NEW_CHAT: {
      return state.setIn(['hasNewChat'], action.payload);
    }
    case SET_FILES: {
      return state.setIn(['files'], action.payload);
    }
    case ADD_TO_FILES: {
      return state.setIn(['files'], {...state.files, ...action.payload});
    }
    case ADD_FILES: {
      let newState = state;

      if (state.selectedChannel._id === action.payload.roomId) {
        newState = newState.setIn(['files', action.payload._id], action.payload)
        .setIn(['selectedChannel', 'lastMessage'], action.payload)
        .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      }

      newState = newState.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
      .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt)

      return newState;
    }
    case UPDATE_FILES: {
      let newState = state;

      if (state.selectedChannel._id === action.payload.roomId) {
        newState = newState.setIn(['files', action.payload._id], action.payload)
        .setIn(['selectedChannel', 'lastMessage'], action.payload)
        .setIn(['selectedChannel', 'updatedAt'], action.payload.updatedAt);
      }

      if (state.normalizedChannelList[action.payload.roomId]?.lastMessage?._id === action.payload._id) {
          newState = newState.setIn(['normalizedChannelList', action.payload.roomId, 'lastMessage'], action.payload)
          .setIn(['normalizedChannelList', action.payload.roomId, 'updatedAt'], action.payload.updatedAt);
      }

      return newState;
    }
    case SET_SELECTED_MESSAGES: {
      return state.setIn(['selectedMessage', action.channelId], action.payload);
    }
    case REMOVE_SELECTED_MESSAGES: {
      return state.setIn(['selectedMessage', action.channelId], {});
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
        .setIn(['normalizedChannelList'], {})
        .setIn(['normalizedMessages'], {})
        .setIn(['channelMessages'], {})
        .setIn(['selectedMessage'], {})
        .setIn(['selectedChannel'], {})
        .setIn(['pendingMessages'], {})
        .setIn(['files'], {})
        .setIn(['meetingList'], [])
        .setIn(['searchValue'], '');
    }
    case ADD_PENDING_MESSAGE: {
      return state.setIn(['pendingMessages', action.channelId], {...state.pendingMessages[action.channelId], ...action.payload});
    }
    case SET_PENDING_MESSAGE_ERROR: {
      return state.setIn(['pendingMessages', action.channelId, action.payload, 'error'], true);
    }
    case REMOVE_PENDING_MESSAGE: {
      let newState = state.removeIn(['pendingMessages', action.channelId, action.messageId]);

      if (action.message) {
        newState = newState.setIn(['channelMessages', action.channelId, 'messages', action.message._id], action.message)
        .setIn(['selectedChannel', 'lastMessage'], action.message)
        .setIn(['selectedChannel', 'updatedAt'], action.message.updatedAt);
      }

      return newState;
    }
    case RESET_PENDING_MESSAGES: {
      return state.setIn(['pendingMessages'], {});
    }
    case UPDATE_PARTICIPANTS: {
      let newState = state;

      if (action.payload?.participants) {
        if (state.normalizedChannelList[action.payload._id]) {
          newState = newState.setIn(['normalizedChannelList', action.payload._id, 'participants'], action.payload.participants)
          if (state.selectedChannel?._id === action.payload._id) {
            newState = newState.setIn(['selectedChannel', 'participants'], action.payload.participants);
          }
        }
      }

      return newState;
    }
    case UPDATE_PARTICIPANTS_STATUS: {
      let newState = state;

      if (action.payload?.participant) {
        if (state.normalizedChannelList[action.payload.roomId]) {
          const channelFromList = state.normalizedChannelList[action.payload.roomId];

          newState = newState.setIn(['normalizedChannelList', action.payload.roomId, 'participants'], (() => {
            return channelFromList.participants.map((p:IParticipants) => {
              if (action.payload.participant._id === p._id) {
                return action.payload.participant;
              }
              return p;
            });
          })());
          if (state.selectedChannel?._id === action.payload.roomId) {
            newState = newState.setIn(['selectedChannel', 'participants'], (() => {
              return state.selectedChannel.participants.map((p:IParticipants) => {
                if (action.payload.participant._id === p._id) {
                  return action.payload.participant;
                }
                return p;
              });
            })());
          }
        }
      }

      return newState;
    }
    default:
      return state;
  }
}
