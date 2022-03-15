import IMessages from "./IMessages";
import IParticipants from "./IParticipants";

interface IRooms {
  id: string;
  _id: string;
  name: string;
  author: IParticipants;
  participants: Array<IParticipants>;
  participantsId: Array<string>;
  lastMessage: IMessages;
  deleted: Boolean;
  hasRoomName: boolean;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default IRooms;