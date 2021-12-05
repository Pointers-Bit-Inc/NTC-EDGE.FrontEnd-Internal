const { Record } = require('immutable');

const InitialState = Record({
  username: '',
  email: '',
  password: '',
  userType: '',
  permitType: '',
  firstname: '',
  middlename: '',
  lastname: '',
  phone: '',
  address: '',
});

export default InitialState;
