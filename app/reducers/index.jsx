import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  allState: require('./allState').default
});

export default rootReducer;
