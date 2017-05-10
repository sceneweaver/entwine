import React, { Component } from 'react';
import ViewActors from './ViewActors';

/* ----- COMPONENT ----- */

class Scene extends Component {

  setInnerHTML(html) {
    return { __html: html }
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <div className="article-titles article-font col-md-offset-1">
              <h3>{this.props.storyTitle}</h3>
              <h1>{this.props.currScene.title}</h1>
            </div>
            <div
              className="article-text article-font col-md-offset-1"
              dangerouslySetInnerHTML={this.setInnerHTML(this.props.html)}
            />
          </div>
          <div className="col-md-8 pull-right actorsBlock">
            <ViewActors />
          </div>

        </div>


      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  html: store.displayState.currScene.paragraphsHTML[0],
  actors: store.displayState.currScene.actors,
  storyTitle: store.displayState.title,
  currScene: store.displayState.currScene
});

export default connect(mapStateToProps)(Scene);
