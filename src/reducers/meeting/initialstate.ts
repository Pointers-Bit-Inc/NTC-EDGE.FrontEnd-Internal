const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  normalizedMeetingList: {},
  activeMeetings: [],
  normalizeActiveMeetings: {},
  meetingId: null,
  meetingParticipants: [],
  meeting: {},
  connectionStatus: "",
});

export default InitialState;
