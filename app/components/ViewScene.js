import React, { Component } from 'react';
import ViewActors from './ViewActors';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';

/* ----- COMPONENT ----- */

class Scene extends Component {

  setInnerHTML(html) {
    return { __html: html }
  }

  setMapJSX(jsx) {
    return { __html: jsx }
  }

  render() {
    console.log("mapcompo", this.props.mapComponent, this.props.currScene)
    let coords;
    if (this.props.maps.length > 0) coords = this.props.maps[0].coords.split(',');
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
          { this.props.maps.length > 0 ?
            <ReactMapboxGl
              style={`mapbox://styles/mapbox/${this.props.maps[0].style}-v9`}
              accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
              zoom={[this.props.maps[0].zoom]}
              pitch={30}
              center={coords}
              containerStyle={{
                height: "500px",
                width: "auto"
              }}>
          </ReactMapboxGl> : null}


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
  maps: store.displayState.currScene.maps
});

export default connect(mapStateToProps)(Scene);
