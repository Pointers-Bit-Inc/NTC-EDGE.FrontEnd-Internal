const {
  SET_MESSAGES,
  UPDATE_MESSAGES,
  REMOVE_MESSAGES,
} = require('./types').default;

interface MessageProps {
  _id: string;
  createdAt: any;
  updatedAt: any;
  channelId: string;
  message: string;
  seen: any;
  sender: any;
}

export function setMessages(payload:MessageProps) {
  return {
    type: SET_MESSAGES,
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
