import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Root from './components/Root';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import MapTest from './components/Views/Map';
import StoriesList from './components/Views/StoriesList';

import Editor from './components/Editor/Editor';
import ViewStory from './components/Views/ViewStory';

/* -----------------    COMPONENT     ------------------ */

const Routes = (props) => (
  <Router history={browserHistory}>
    <Route path="/" component={Root} onEnter={props.fetchInitialData}>
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
      <Route path="stories/fakeStory" component={ViewStory} onEnter={props.onFakeStoryEnter} />
      <Route path="stories/:storyId" component={ViewStory} onEnter={props.onRealStoryEnter} />
      <Route path="editor" component={Editor} />
      <Route path="stories" component={StoriesList} />
      <Route path="maptest" component={MapTest} />
      <Route path="*" component={Home} />
    </Route>
  </Router>
);

/* -----------------    CONTAINER     ------------------ */
import { fetchStories } from './reducers/stories';
import { setFakeState, fetchStory } from './reducers/displayState';

const mapProps = null;

const mapDispatch = dispatch => ({
  onFakeStoryEnter: () => {
    dispatch(setFakeState());
  },
  onRealStoryEnter: (nextRouterState) => {
    const storyId = nextRouterState.params.storyId;
    dispatch(fetchStory(storyId));
  },
  fetchInitialData: () => {
    dispatch(fetchStories());
  }
});

export default connect(mapProps, mapDispatch)(Routes);
