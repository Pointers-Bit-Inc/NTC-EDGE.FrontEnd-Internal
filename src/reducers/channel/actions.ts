import IMeetings from "src/interfaces/IMeetings";
import IMessages from "src/interfaces/IMessages";
import IRooms from "src/interfaces/IRooms";

const {
  SET_SELECTED_CHANNEL,
  SET_CHANNEL_LIST,
  ADD_TO_CHANNEL_LIST,
  ADD_CHANNEL,
  UPDATE_CHANNEL,
  REMOVE_CHANNEL,

  SET_MESSAGES,
  ADD_TO_MESSAGES,
  ADD_MESSAGES,
  UPDATE_MESSAGES,
  REMOVE_MESSAGES,

  SET_SELECTED_MESSAGES,
  REMOVE_SELECTED_MESSAGES,
  ADD_MEETING_CHANNEL,
  UPDATE_MEETING_CHANNEL,
  REMOVE_MEETING_CHANNEL,
  SET_MEETINGS_CHANNEL,

  SET_SEARCH_VALUE,
  RESET_CHANNEL,
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
  deleted: boolean;
  unSend: boolean;
  edited: boolean;
}

export function setSelectedChannel(payload:IRooms | {}, isChannelExist = false) {
  return {
    type: SET_SELECTED_CHANNEL,
    payload,
    isChannelExist,
  };
}

export function setChannelList(payload:Array<IRooms>) {
  return {
    type: SET_CHANNEL_LIST,
    payload,
  };
}

export function addToChannelList(payload:Array<IRooms>) {
  return {
    type: ADD_TO_CHANNEL_LIST,
    payload,
  };
}

export function addChannel(payload:IRooms) {
  return {
    type: ADD_CHANNEL,
    payload,
  }
}

export function updateChannel(payload:IRooms) {
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

export function setMessages(payload:IMessages) {
  return {
    type: SET_MESSAGES,
    payload,
  };
}

export function addToMessages(payload:Array<IMessages>) {
  return {
    type: ADD_TO_MESSAGES,
    payload,
  };
}

export function addMessages(payload:Array<IMessages>) {
  return {
    type: ADD_MESSAGES,
    payload,
  };
}

export function updateMessages(payload:Array<IMessages>) {
  return {
    type: UPDATE_MESSAGES,
    payload,
  };
}

export function removeMessages(payload:IMessages) {
  return {
    type: REMOVE_MESSAGES,
    payload,
  };
}

export function setSelectedMessage(payload:IMessages) {
  return {
    type: SET_SELECTED_MESSAGES,
    payload,
  };
}

export function removeSelectedMessage() {
  return {
    type: REMOVE_SELECTED_MESSAGES,
  };
}

export function setMeetings(payload:Array<IMeetings>) {
  return {
    type: SET_MEETINGS_CHANNEL,
    payload,
  };
}

export function addMeeting(payload:IMeetings) {
  return {
    type: ADD_MEETING_CHANNEL,
    payload,
  };
}

export function updateMeeting(payload:IMeetings) {
  return {
    type: UPDATE_MEETING_CHANNEL,
    payload,
  };
}

export function removeMeeting(payload:string) {
  return {
    type: REMOVE_MEETING_CHANNEL,
    payload,
  };
}

export function setSearchValue(payload:string) {
  return {
    type: SET_SEARCH_VALUE,
    payload,
  }
}

export function resetChannel() {
  return {
    type: RESET_CHANNEL,
  }
}

