const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  meetingId: null,
  meetingParticipants: [],
  meeting: {},
});

export default InitialState;
