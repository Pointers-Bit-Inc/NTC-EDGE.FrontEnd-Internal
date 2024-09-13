import IImage from "./IImage";

interface IParticipants {
  id: string;
  _id: string;
  email: string;
  contactNumber: string;
  firstName: string;
  lastName: string;
  name: string;
  image?: string;
  title?: string;
  suffix?: string;
  designation?: string;
  position?: string;
  uid?: 0;
  hasJoined: false;
  isFocused: false;
  profilePicture: IImage,
  isOnline: boolean;
  lastOnline?: Date;
  status: string;
  isAdmin?: boolean;
  muted?: boolean;
  waitingInLobby?: boolean;
}

export default IParticipants;