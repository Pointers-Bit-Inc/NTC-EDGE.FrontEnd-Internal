const { Record } = require('immutable');

const InitialState = Record({
  selectedChannel: {},
  channelList: [],
});

export default InitialState;
