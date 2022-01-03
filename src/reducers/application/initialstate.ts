const { Record } = require('immutable');


const InitialState = Record({
  pinnedApplications: [],
  notPinnedApplications:[],
});

export default InitialState;
