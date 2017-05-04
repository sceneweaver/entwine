import React, { Component } from 'react';

import StoryNav from './StoryNav.js';
import Scene from './Scene.js';

/* ----- COMPONENT ----- */

class Story extends Component {
  render() {
    console.log("this.props @ Story component", this.props);
    return (
      <div>
        <h1>{this.props.title}</h1>
        <StoryNav />
        <Scene />
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  title: store.story.title
})

export default connect(mapStateToProps)(Story);
