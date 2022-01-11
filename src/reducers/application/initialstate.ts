const { Record } = require('immutable');


const InitialState = Record({
  pinnedApplications: [],
  notPinnedApplications:[],
  applications: []
});

export default InitialState;
