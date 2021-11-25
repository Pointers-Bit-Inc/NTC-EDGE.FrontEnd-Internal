import { combineReducers } from 'redux';
import user from './user/reducers';
import theme from './theme/reducers';

export default combineReducers({
  user,
  theme,
});
