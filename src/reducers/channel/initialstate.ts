const { Record } = require('immutable');

const InitialState = Record({
  selectedChannel: {},
  channelList: [],
  messages: [],
});

export default InitialState;
