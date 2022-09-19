import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import user from './user/reducers';
import theme from './theme/reducers';
import activity from './activity/reducers';
import application from './application/reducers';
import channel from './channel/reducers';
import meeting from './meeting/reducers';
import role from './role/reducers';
import layout from "./layout/reducers";
import schedule from "./schedule/reducers";
import configuration from "./configuration/reducers";
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

export default combineReducers({
  user: persistReducer(persistConfig, user),
  layout,
  theme,
  activity,
  application,
  channel,
  meeting,
  role,
  schedule,
  configuration
});
