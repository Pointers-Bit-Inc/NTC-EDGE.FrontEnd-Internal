const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  normalizedMeetingList: {},
  activeMeetings: [],
  meetingId: null,
  meetingParticipants: [],
  meeting: {},
});

export default InitialState;
