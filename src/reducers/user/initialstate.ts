const { Record } = require('immutable');

const InitialState = Record({
  username: '',
  email: '',
  password: '',
  userType: '',
  permitType: '',
  firstName: '',
  middleName: '',
  lastName: '',
  contactNumber: '',
  address: '',
  profileImage: '',
  image: '',
  name: '',
  profilePicture: {},
  profilePictureObj: {},
  biometrics: null,
  sessionToken: null,
});

export default InitialState;
