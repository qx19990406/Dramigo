import {combineReducers} from 'redux';
import userReducer from './userReducer';
import historyReducer from './historyReducer';
import homeReducer from './homeReducer';

const rootReducer = combineReducers({
  user: userReducer,
  history: historyReducer,
  home: homeReducer,
});

export default rootReducer;
