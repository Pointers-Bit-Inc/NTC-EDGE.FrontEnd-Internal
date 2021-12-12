const { Record } = require('immutable');

const InitialState = Record({
  selectedChannel: {},
  agora: {},
  channelList: [],
  messages: [],
});

export default InitialState;
