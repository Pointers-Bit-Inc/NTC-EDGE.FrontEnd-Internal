import {setRightLayoutComponent} from "./actions";

const { Record } = require('immutable');


const InitialState = Record({
  pinnedApplications: [],
  notPinnedApplications:[],
  applications: [],
  tabBarHeight: 0,
  rightLayoutComponent: {width: 0, height: 0, left: 0, top: 0},
  filterRect: {width: 0, height: 0, left: 0, top: 0},
  applicationItem: {},
  topBarNav: {width: 0, height: 0, left: 0, top: 0},
});

export default InitialState;
