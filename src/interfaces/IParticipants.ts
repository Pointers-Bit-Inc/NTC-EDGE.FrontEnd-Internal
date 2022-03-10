import IImage from "./IImage";

interface IParticipants {
  id: string;
  _id: string;
  email: string;
  ContactNumber: string;
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
  profilePicture: IImage
}

export default IParticipants;