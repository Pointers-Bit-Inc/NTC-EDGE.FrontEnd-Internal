const { Record } = require('immutable');

const InitialState = Record({
  selectedChannel: {},
  agora: {},
  channelList: [],
  messages: [],
  selectedMessage: {},
  meetingList: [],
  searchValue: '',
});

export default InitialState;
