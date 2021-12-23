const { Record } = require('immutable');

const InitialState = Record({username: '',
  email: '',
  password: '',
  userType: '',
  permitType: '',
  firstname: '',
  middlename: '',
  lastname: '',
  phone: '',
  address: '',
  profileImage: ''
});

export default InitialState;
