import React, { Component } from 'react';

import Scene from './Scene.js';

/* ----- COMPONENT ----- */

class Story extends Component {
  constructor() {
    super()
    this.getNewScene = this.getNewScene.bind(this);
  }
  getNewScene(evt) {
    evt.preventDefault();
    const newScene = this.props.scenes[evt.target.name - 1];
    this.props.setCurrScene(newScene);
  }
  render() {
    return (
      <div className="container">
        <div className="row">
          <h1 className="col-md-6 col-md-offset-3 article-font">{this.props.title}</h1>
        </div>
        <div className="navButtons">
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
        <Scene />
      </div>
    );
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
