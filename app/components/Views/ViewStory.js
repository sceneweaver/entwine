import React, { Component } from 'react';

import ViewStorySlider from './ViewStorySlider.js';
import ViewScene from './ViewScene.js';

/* ----- COMPONENT ----- */

class Story extends Component {
  render() {
    return (
      <div className="story-wrapper">

          <div className="col-md-1 col-md-offset-1 scenes-nav">
            <h4 className="scenes-nav-title">Navigate<br />Scenes</h4>

            <ViewStorySlider />

          </div>

          <ViewScene />

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  currScene: store.displayState.currScene,
  scenes: store.displayState.scenes
});

export default connect(mapStateToProps)(Story);
