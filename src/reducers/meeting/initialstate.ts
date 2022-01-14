const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  activeMeetings: [],
  meetingId: null,
  meetingParticipants: [],
  meeting: {},
});

export default InitialState;
