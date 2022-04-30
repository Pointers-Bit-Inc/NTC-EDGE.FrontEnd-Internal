const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  normalizedMeetingList: {},
  activeMeetings: [],
  normalizeActiveMeetings: {},
  meetingId: null,
  meetingParticipants: [],
  meeting: {},
  options: {
    isHost: false,
    isVoiceCall: false,
    isMute: false,
    isVideoEnable: true,
  },
  connectionStatus: "",
});

export default InitialState;
