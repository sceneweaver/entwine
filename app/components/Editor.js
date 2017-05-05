import React, { Component } from 'react';
import { fetchNouns, setNouns } from '../reducers/analyze';
import { addStory } from '../reducers/setText';
import { browserHistory } from 'react-router';
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
  onSubmit(event) {
    event.preventDefault();
    axios.post('/api/stories', { title: event.target.storyTitle.value })
      .then(newStory => {
        const storyId = newStory.data.id;
        return axios.post(`/api/stories/${storyId}/scenes`, { paragraphs: this.state.textBody })
      })
      .then(newScene => {
        const sceneId = newScene.data.id;
        axios.post(`/api/actors/${sceneId}/bulk`, { actors: this.props.nouns })
      })
  }
  onSceneTextChange(event) {
    this.setState({ textBody: event.target.value });
  }
  onGenerateActors(event) {
    event.preventDefault();
    this.props.parseNouns(this.state.textBody);
  }
  render() {
    return (
      <div className="storyEditor">
        <form onSubmit={this.onSubmit}>
          <div className="row">
            <div className="form-group col-md-6">
              <input
                type="text"
                placeholder="Enter Story Title Here"
                name="storyTitle"
              />
              <textarea
                rows="10"
                cols="78"
                type="text"
                className="form-control"
                placeholder="Enter story here"
                name="fullStory"
                onChange={this.onSceneTextChange}
              />
            </div>
            <div className="col-md-6">
              <div className="buttonContainer">
                <button
                  className="btn btn-default"
                  onClick={this.onGenerateActors}
                >
                  Generate Actors
              </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="buttonContainer">
              <button
                className="btn btn-default"
                type="submit"
              >
                Publish
            </button>
            </div>
          </div>
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
