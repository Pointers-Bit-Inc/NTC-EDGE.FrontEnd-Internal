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
});

export default InitialState;
