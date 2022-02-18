const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  normalizedMeetingList: {},
  activeMeetings: [],
  meetingId: null,
  meetingParticipants: [],
  meeting: {},
  connectionStatus: "",
});

export default InitialState;
