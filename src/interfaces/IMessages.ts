import IParticipants from "./IParticipants";

interface IMessages {
  id: string;
  _id: string;
  roomId: string;
  sender: IParticipants;
  seen: Array<IParticipants>;
  participantsId: Array<string>;
  deleted: boolean;
  system: boolean;
  edited: boolean;
  unSend: boolean;
  hasSeen: boolean;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export default IMessages;