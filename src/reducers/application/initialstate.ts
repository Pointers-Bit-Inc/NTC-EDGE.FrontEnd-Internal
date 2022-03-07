const { Record } = require('immutable');


const InitialState = Record({
  pinnedApplications: [],
  notPinnedApplications:[],
  applications: [],
  tabBarHeight: 0,
  applicationItem: {}
});

export default InitialState;
