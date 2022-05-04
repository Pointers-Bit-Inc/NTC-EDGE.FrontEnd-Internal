const { Record } = require('immutable');

const InitialState = Record({
  list: [],
  normalizedMeetingList: {},
  activeMeetings: [],
  normalizeActiveMeetings: {},
  meetingId: null,
  meetingParticipants: [],
  meeting: null,
  options: {
    isHost: false,
    isVoiceCall: false,
    isMute: false,
    isVideoEnable: true,
  },
  isFullScreen: true,
  connectionStatus: "",
  pinnedParticipant: "",
});

export default InitialState;
