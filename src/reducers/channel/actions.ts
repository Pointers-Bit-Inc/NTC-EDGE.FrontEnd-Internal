const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  ADD_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,

  SET_MESSAGES,
  ADD_MESSAGES,
  UPDATE_MESSAGES,
  REMOVE_MESSAGES,
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
  otherParticipants: any;
  hasSeen: boolean,
  participantsId: any;
  seen: any
}

interface MessageProps {
  _id: string;
  createdAt: any;
  updatedAt: any;
  channelId: string;
  message: string;
  seen: any;
  sender: any;
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

export function addChannel(payload:ChannelProps) {
  return {
    type: ADD_CHANNEL,
    payload,
  }
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

export function setMessages(payload:MessageProps) {
  return {
    type: SET_MESSAGES,
    payload,
  };
}

export function addMessages(payload:[MessageProps]) {
  return {
    type: ADD_MESSAGES,
    payload,
  };
}

export function updateMessages(payload:[MessageProps]) {
  return {
    type: UPDATE_MESSAGES,
    payload,
  };
}

export function removeMessages(payload:MessageProps) {
  return {
    type: REMOVE_MESSAGES,
    payload,
  };
}

