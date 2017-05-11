import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  displayState: require('./displayState').default,
  analyze: require('./analyze').default,
  editor: require('./editor').default,
  stories: require('./stories').default
});

export default rootReducer;

