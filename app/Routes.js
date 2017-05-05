import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Root from './components/Root';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
// import { fetchUsers } from './redux/users';
// import { fetchStories, fetchStory } from './redux/stories';
// import { retrieveLoggedInUser } from './redux/auth';

import Editor from './components/Editor';
import Story from './components/Story';

/* -----------------    COMPONENT     ------------------ */

const Routes = ({ onStoryEnter }) => (
  <Router history={browserHistory}>
    <Route path="/" component={Root} >
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
      <Route path="stories/:storyId" component={Story} onEnter={onStoryEnter} />
      <Route path="editor" component={Editor} />
      <Route path="*" component={Home} />
    </Route>
  </Router>
);

/* -----------------    CONTAINER     ------------------ */

import { setFakeState } from './reducers/allState';

const mapProps = null;

const mapDispatch = dispatch => ({
  // fetchInitialData: () => {
  //   dispatch(retrieveLoggedInUser());
  //   dispatch(fetchUsers());
  //   dispatch(fetchStories());
  // },
  onStoryEnter: () => {
    dispatch(setFakeState());
  }
});

export default connect(mapProps, mapDispatch)(Routes);
