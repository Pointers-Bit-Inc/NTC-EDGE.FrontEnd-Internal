const { Record } = require('immutable');
const InitialState = Record({
  configurations: [],
  configuration:{},
  region:{},
  regions:[],
  fee: {},
  feeFlatten: {},
  feeOriginalFlatten: {},
  hasChangeFee: false
});

export default InitialState;
