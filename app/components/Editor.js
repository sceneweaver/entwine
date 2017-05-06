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
      scenes: [{
        position: 1,
        title: '',
        paragraphs: [''],
        actors: []
      }],
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onSceneTextChange = this.onSceneTextChange.bind(this);
    this.onGenerateActors = this.onGenerateActors.bind(this);
    this.handleActorsChange = this.handleActorsChange.bind(this);
    this.addScene = this.addScene.bind(this);
  }
  onSubmit(event) {
    event.preventDefault();
    axios.post('/api/stories', {
      title: event.target.storyTitle.value,
      scenes: this.state.scenes
    })
      .then(newStory => {
        browserHistory.push(`/stories/${newStory.data.id}`)
      })
  }
  onSceneTextChange(event) {
    const position = event.target.name
      , newScenes = this.state.scenes;
    newScenes[position - 1].paragraphs[0] = event.target.value;
    this.setState({
      scenes: newScenes
    });
  }
  onGenerateActors(event) {
    event.preventDefault();
    const position = event.target.name;
    axios.post('/api/compromise/nouns', { text: this.state.scenes[position - 1].paragraphs[0] })
      .then(nouns => {
        const newScenes = this.state.scenes;
        newScenes[position - 1].actors = nouns.data;
        this.setState({
          scenes: newScenes
        });
      })
  }
  handleActorsChange(event) {
    const eventNameArray = event.target.name.split('-')
      , scene = eventNameArray[0] - 1
      , changedActorTitle = eventNameArray[1]
      , type = eventNameArray[2]
      , actors = this.state.scenes[scene].actors
      , newScenes = this.state.scenes;
    let index
      , actor;
    actors.forEach((a, i) => {
      if (a.title === changedActorTitle) {
        index = i;
        actor = a;
      }
    })
    actor[type] = event.target.value;
    newScenes[scene].actors = actors.slice(0, index).concat(actor).concat(actors.slice(index + 1));
    this.setState({
      scenes: newScenes
    });
  }
  addScene(event) {
    event.preventDefault()
    const newScenes = this.state.scenes;
    newScenes.push({
      position: this.state.scenes.length + 1,
      title: '',
      paragraphs: [''],
      actors: []
    })
    this.setState({
      scenes: newScenes
    })
  }
  render() {
    return (
      <div id="storyEditor">
        <form onSubmit={this.onSubmit}>
          <div className="row titleRow">
            <div className="col-md-6">
              <input
                name="storyTitle"
                type="text"
                placeholder="Story Title"
                className="titleInput"
              />
            </div>
            <div className="col-md-3">
              <div className="addScene">
                <button
                  className="btn btn-success"
                  onClick={this.addScene}
                >
                  Add Scene
                </button>
              </div>
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

          {
            this.state.scenes.length ? (this.state.scenes.map(scene => (
              <EditorScene
                key={scene.position}
                position={scene.position}
                actors={scene.actors}
                onSceneTextChange={this.onSceneTextChange}
                onGenerateActors={this.onGenerateActors}
                handleActorsChange={this.handleActorsChange}
              />
            )))
              : null
          }

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
