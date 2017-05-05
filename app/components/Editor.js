import React, { Component } from 'react';
import { fetchNouns, setNouns } from '../reducers/analyze';
import {addStory} from '../reducers/setText';
import {browserHistory} from 'react-router';
import Actors from './Actors';
import axios from 'axios';
import querystring from 'querystring';

/* ----- COMPONENT ----- */

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textBody: ''
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onSceneTextChange = this.onSceneTextChange.bind(this);
    this.onGenerateActors = this.onGenerateActors.bind(this);
  }

  // TO DO: figure out how to create multiple actors and do `setScenes` for each...
  onSubmit(event) {
    event.preventDefault();
    axios.post('/api/stories', {title: event.target.storyTitle.value})
    .then(newStory => {
      const storyId = newStory.data.id;
      return axios.post(`/api/stories/${storyId}/scenes`, {paragraphs: this.state.textBody})
    })
    .then(newScene => {
      // unsure why a newScene isn't returned to this .then, but the log does say a post request to /api/stories/:storyId/scenes was successful...
      const sceneId = newScene.data.id;
      axios.post(`/api/actors/${sceneId}/bulk`, {actors: this.props.nouns})
    })
  }

  onSceneTextChange (event) {
    this.setState({textBody: event.target.value});
  }
  onGenerateActors (event) {
    event.preventDefault();
    this.props.parseNouns(this.state.textBody);
  }
  render() {
    return (
      <div className="storyInput">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Enter Story Title Here" name="storyTitle"/>
            <textarea rows="100" cols="78" type="text" className="form-control" placeholder="Enter story here" name="fullStory" onChange={this.onSceneTextChange} />
          </div>
          <button className="btn btn-default" onClick={this.onGenerateActors} >Generate Actors</button>
          <button type="submit">Submit Scene</button>
        </form>
        <Actors />
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux'

const mapStateToProps = (store, ownProps) => {
  return {
    nouns: store.analyze.nouns,
  };
};

function mapDispatchToProps(dispatch) {
    return {
      parseNouns: (input) => {
        dispatch(fetchNouns(input));
      },
      setStory: (input) => {
        dispatch(addStory(input));
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
