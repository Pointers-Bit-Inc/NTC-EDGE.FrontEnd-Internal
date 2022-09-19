const { Record } = require('immutable');
const InitialState = Record({
  configurations: [],
  configuration:{},
  region:{},
  regions:[]
});

export default InitialState;
