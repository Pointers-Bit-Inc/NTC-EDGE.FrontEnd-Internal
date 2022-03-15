import IParticipants from "./IParticipants";
import IRooms from "./IRooms";

interface IMeetings {
  id: string;
  _id: string;
  roomId: string;
  name: string;
  hasRoomName: boolean;
  isGroup: boolean;
  isVoiceCall: boolean;
  host: IParticipants;
  room: IRooms;
  participants: Array<IParticipants>;
  participantsId: Array<string>;
  ended: boolean;
  createdAt: Date;
  updatedAt: Date;
  endedAt: Date;
}

export default IMeetings;