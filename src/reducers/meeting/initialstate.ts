const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  meetingId: null,
  meetingParticipants: [],
});

export default InitialState;
