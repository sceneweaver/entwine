import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  allState: require('./allState').default,
  analyze: require('./analyze').default
});

export default rootReducer;
