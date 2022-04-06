const { Record } = require('immutable');

const InitialState = Record({
  selectedChannel: {},
  agora: {},
  channelList: [],
  normalizedChannelList: {},
  messages: [],
  normalizedMessages: {},
  selectedMessage: {},
  meetingList: [],
  normalizedMeetingList: {},
  searchValue: '',
  pendingMessages: {},
  channelMessages: {}
});

export default InitialState;
