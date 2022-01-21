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
  phone: '',
  address: '',
  profileImage: ''
});

export default InitialState;
