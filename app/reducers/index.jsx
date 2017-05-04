import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  scene: require('./scene').default,
  story: require('./story').default
});

export default rootReducer;
