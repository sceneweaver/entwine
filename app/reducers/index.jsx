import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  displayState: require('./displayState').default,
  analyze: require('./analyze').default,
  editor: require('./editor').default
});

export default rootReducer;

