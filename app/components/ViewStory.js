import React, { Component } from 'react';

import ViewScene from './ViewScene.js';

/* ----- COMPONENT ----- */

class Story extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <h1 className="col-md-7 col-md-offset-2 article-font">{this.props.title}</h1>
        </div>
        <div className="navButtons">
          {
            this.props.scenes ? this.props.scenes.map(scene => (
              <div className="buttonContainer" key={scene.id}>
                <button
                  className="btn btn-success"
                  onClick={this.props.getNewScene.bind(this, event, scene.position)}
                >
                  Go to scene {scene.position + 1}
                </button>
              </div>
            )) : null
          }
        </div>
        <ViewScene />
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { setCurrScene } from '../reducers/displayState'

const mapStateToProps = store => ({
  title: store.displayState.title,
  scenes: store.displayState.scenes
});

const mapDispatchToProps = dispatch => ({
  getNewScene(event, position) {
    event.preventDefault();
    dispatch(setCurrScene(this.props.scenes[position]));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Story);
