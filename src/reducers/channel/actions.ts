const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,
} = require('./types').default;

interface ChannelProps {
  _id: string;
  createdAt: any;
  updatedAt: any;
  channelId: string;
  channelName: string;
  isGroup: boolean;
  lastMessage: any;
  participants: any;
  participantsId: any;
  seen: any
}

export function setSelectedChannel(payload:ChannelProps) {
  return {
    type: SET_SELECTED_CHANNEL,
    payload,
  };
}

export function setChannelList(payload:[ChannelProps]) {
  return {
    type: SET_CHANNEL_LIST,
    payload,
  };
}

export function updateChannel(payload:ChannelProps) {
  return {
    type: UPDATE_CHANNEL,
    payload,
  };
}

export function removeChannel(payload:string) {
  return {
    type: REMOVE_CHANNEL,
    payload,
  };
}
