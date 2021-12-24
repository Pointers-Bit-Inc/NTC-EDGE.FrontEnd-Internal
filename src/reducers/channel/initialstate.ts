const { Record } = require('immutable');

const InitialState = Record({
  selectedChannel: {},
  agora: {},
  channelList: [],
  messages: [],
  selectedMessage: {},
});

export default InitialState;
