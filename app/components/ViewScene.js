import React, { Component } from 'react';
import ViewActors from './ViewActors';

/* ----- COMPONENT ----- */

class Scene extends Component {

  setInnerHTML(html) {
    return { __html: html }
  }

  render() {
    return (

      <div className="col-md-10">
        
      <div className="col-md-11 article-titles">
          <h3 className="view-story-heading story">{this.props.storyTitle} by {this.props.user ? this.props.user.username : 'anonymous'}</h3>
          <h1 className="view-story-heading">{this.props.currScene.title}</h1>
        </div>

        <div className="col-md-4 article-text">
          <div
            className="article-text"
            dangerouslySetInnerHTML={this.setInnerHTML(this.props.html)}
          />
        </div>

        <div className="col-md-5 col-md-offset-1">
          <ViewActors />
        </div>

      </div>

    );
  }
}


/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  html: store.displayState.currScene.paragraphsHTML[0],
  actors: store.displayState.currScene.actors,
  storyTitle: store.displayState.title,
  currScene: store.displayState.currScene,
  user: store.displayState.user
});

export default connect(mapStateToProps)(Scene);
