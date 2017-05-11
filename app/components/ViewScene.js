import React, { Component } from 'react';
import ViewActors from './ViewActors';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';

/* ----- COMPONENT ----- */

class Scene extends Component {

  setInnerHTML(html) {
    return { __html: html }
  }

  render() {
    console.log("mapcompo", this.props.mapComponent, this.props.currScene)
    return (

      <div className="col-md-10">

        <div className="col-md-11 article-titles article-font">
          <h3>
            {this.props.storyTitle}</h3>
          <h1>
            {this.props.currScene.title}</h1>
        </div>

        <div className="col-md-4 article-text article-font">
          <div
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
  mapComponent: store.displayState.currScene.maps
});

export default connect(mapStateToProps)(Scene);
