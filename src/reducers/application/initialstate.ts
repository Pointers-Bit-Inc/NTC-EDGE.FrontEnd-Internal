import {setRightLayoutComponent} from "./actions";

const { Record } = require('immutable');


const InitialState = Record({
  pinnedApplications: [],
  selectedYPos: {yPos: 0, type: 0},
  notPinnedApplications:[],
  applications: [],
  tabBarHeight: 0,
  hasChange: false,
  edit: false,
  rightLayoutComponent: {width: 0, height: 0, left: 0, top: 0},
  filterRect: {width: 0, height: 0, left: 0, top: 0},
  applicationItem: {},
  data: {},

  applicationItemId: 0,
  userProfileForm: {},
  userOriginalProfileForm: {},
  topBarNav: {width: 0, height: 0, left: 0, top: 0},
  activitySizeComponent: {width: 0, height: 0, left: 0, top: 0},


  calendarVisible: false,


});

export default InitialState;
