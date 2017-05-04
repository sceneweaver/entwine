import React, { Component } from 'react';

import Scene from './Scene.js';

/* ----- COMPONENT ----- */

class Story extends Component {
  constructor() {
    super()
    this.getNewScene = this.getNewScene.bind(this)
  }
  render() {
    console.log("this.props @ Story component", this.props);
    return (
      <div>
        <h1>{this.props.title}</h1>
        <Scene />
        <div>
          {
            this.props.scenes ? this.props.scenes.map(scene => (
              <div className="buttonContainer" key={scene.id}>
                <button
                  name={scene.position}
                  className="btn btn-success"
                  onClick={this.getNewScene}
                >
                  Go to scene {scene.position}
                </button>
              </div>
            )) : null
          }
        </div>
      </div>
    )
  }
  getNewScene(evt) {
    evt.preventDefault()
    console.log("clicked button at position: ", evt.target.name)
    const newScene = this.props.scenes[evt.target.name - 1];
    this.props.setCurrScene(newScene);
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { setCurrScene } from '../reducers/allState'

const mapStateToProps = store => ({
  title: store.allState.title,
  scenes: store.allState.scenes
});

const mapDispatchToProps = dispatch => ({
  setCurrScene(scene) {
    dispatch(setCurrScene(scene));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Story);
