import React, { Component } from 'react';

import ViewScene from './ViewScene.js';

/* ----- COMPONENT ----- */

class Story extends Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-1 scenes-nav col-md-offset-1">
            <h4 className="scenes-nav-title">Navigate<br />Scenes</h4>
            <input
              type="range"
              className="scene-navigator"
              min={0}
              max={this.props.scenes.length - 1}
              step={1}
              defaultValue={this.props.currScene.position}
              onChange={this.props.getNewScene}
            />
          </div>
          <ViewScene />
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { fetchScene } from '../reducers/displayState'

const mapStateToProps = store => ({
  currScene: store.displayState.currScene,
  scenes: store.displayState.scenes
});

const mapDispatchToProps = dispatch => ({
  getNewScene(event) {
    event.preventDefault();
    dispatch(fetchScene(event.target.value));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Story);
