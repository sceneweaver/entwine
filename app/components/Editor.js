import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import querystring from 'querystring';

import EditorActors from './EditorActors';

/* ----- COMPONENT ----- */

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textBody: '',
      nouns: []
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onSceneTextChange = this.onSceneTextChange.bind(this);
    this.onGenerateActors = this.onGenerateActors.bind(this);
  }
  onSubmit(event) {
    event.preventDefault();
    axios.post('/api/stories', {
      title: event.target.storyTitle.value,
      sceneText: this.state.textBody,
      actors: this.props.nouns
    })
    .then(newStory => {
      console.log(newStory)
      browserHistory.push(`/stories/${newStory.data.id}`)
    })
  }
  onSceneTextChange(event) {
    this.setState({ textBody: event.target.value });
  }
  onGenerateActors(event) {
    event.preventDefault();
    axios.post('/api/compromise/nouns', {text: this.state.textBody})
    .then(nouns => {
      this.setState({
        nouns: nouns.data
      })
    })
  }
  render() {
    console.log("this.state", this.state);
    return (
      <div id="storyEditor">
        <form onSubmit={this.onSubmit}>
          <div className="row titleRow">
            <div className="col-md-9">
              <input
                name="storyTitle"
                type="text"
                placeholder="Story Title"
                className="titleInput"
              />
            </div>
            <div className="col-md-3">
              <div className="buttonContainer">
                <button
                  className="btn btn-success"
                  type="submit"
                >
                  Publish My Story
                </button>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6">
              <textarea
                rows="10"
                cols="78"
                type="text"
                className="form-control"
                placeholder="Scene"
                name="fullStory"
                onChange={this.onSceneTextChange}
              />
            </div>
            <div className="col-md-6">
              <div className="buttonContainer flex-container">
                <button
                  className="btn btn-default"
                  onClick={this.onGenerateActors}
                >
                  Generate Actors
                </button>
              </div>
              <EditorActors actors={this.state.nouns} />
            </div>
          </div>
        </form>
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { setCurrScene } from '../reducers/allState';
import { fetchNouns, setNouns } from '../reducers/analyze';
import { addStory } from '../reducers/setText';

const mapStateToProps = (store, ownProps) => {
  return {
    nouns: store.analyze.nouns
  };
};

function mapDispatchToProps(dispatch) {
  return {
    parseNouns: (input) => {
      dispatch(fetchNouns(input));
    },
    setStory: (input) => {
      dispatch(addStory(input));
    },
    setCurrScene: (scene) => {
      dispatch(setCurrScene(scene))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
