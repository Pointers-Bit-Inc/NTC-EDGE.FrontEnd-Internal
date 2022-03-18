import { schema } from 'normalizr';

const schemas = {
  room: new schema.Entity('rooms', {}, { idAttribute: '_id' }),
  message: new schema.Entity('messages', {}, { idAttribute: '_id' }),
  pendingMessage: new schema.Entity('pendingMessage', {}, { idAttribute: '_id' }),
  meeting: new schema.Entity('meetings', {}, { idAttribute: '_id' }),
};

const roomSchema = schemas.room;
const messageSchema = schemas.message;
const pendingMessageSchema = schemas.pendingMessage;
const meetingSchema = schemas.meeting;

export {
  roomSchema,
  messageSchema,
  pendingMessageSchema,
  meetingSchema,
};
