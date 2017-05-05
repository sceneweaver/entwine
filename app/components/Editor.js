import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import axios from 'axios';
import querystring from 'querystring';

import EditorScene from './EditorScene';


/* ----- COMPONENT ----- */

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      textBody: '',
      nouns: [],
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onSceneTextChange = this.onSceneTextChange.bind(this);
    this.onGenerateActors = this.onGenerateActors.bind(this);
    this.handleActorsChange = this.handleActorsChange.bind(this);
  }
  onSubmit(event) {
    event.preventDefault();
    axios.post('/api/stories', {
      title: event.target.storyTitle.value,
      sceneText: this.state.textBody,
      actors: this.state.nouns
    })
      .then(newStory => {
        browserHistory.push(`/stories/${newStory.data.id}`)
      })
  }
  onSceneTextChange(event) {
    this.setState({ textBody: event.target.value });
  }
  onGenerateActors(event) {
    event.preventDefault();
    axios.post('/api/compromise/nouns', { text: this.state.textBody })
      .then(nouns => {
        this.setState({
          nouns: nouns.data
        })
      })
  }
  handleActorsChange(event) {
    const eventNameArray = event.target.name.split('-')
      , noun = eventNameArray[0]
      , type = eventNameArray[1]
      , actors = this.state.nouns;
    let index
      , actor;
    actors.forEach((a, i) => {
      if (a.title === noun) {
        index = i;
        actor = a;
      }
    })
    actor[type] = event.target.value;
    const newActors = actors.slice(0, index).concat(actor).concat(actors.slice(index + 1));
    this.setState({ nouns: newActors });
  }
  render() {
    console.log("this.state on Editor", this.state);
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
              <div className="publish">
                <button
                  className="btn btn-success"
                  type="submit"
                >
                  Publish My Story
                </button>
              </div>
            </div>
          </div>
          <EditorScene
            onSceneTextChange={this.onSceneTextChange}
            onGenerateActors={this.onGenerateActors}
            nouns={this.state.nouns}
            handleActorsChange={this.handleActorsChange}
           />
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
