import React, { Component } from 'react';

import ViewStorySlider from './ViewStorySlider.js';
import ViewStoryStepper from './ViewStoryStepper.js';
import ViewScene from './ViewScene.js';

/* ----- COMPONENT ----- */

class Story extends Component {
  render() {
    return (
      <div className="story-wrapper">

          <div className="col-md-2 scenes-nav">

            <ViewStoryStepper />

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
