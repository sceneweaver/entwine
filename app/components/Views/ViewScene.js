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
    let coords, style, zoom;
    if (this.props.maps && this.props.maps.length) {
      coords = this.props.maps[0].coords.split(',');
      style = this.props.maps[0].style;
      zoom = this.props.maps[0].zoom;
    }
    return (
      <div className="col-md-12">

        <div className="scene-hero">

          {
            this.props.maps && this.props.maps.length
            ? (<ReactMapboxGl
              style={`mapbox://styles/mapbox/${style}-v9`}
              accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
              zoom={[zoom]}
              pitch={30}
              center={coords}
              containerStyle={{
                height: "500px",
                width: "auto"
              }}>
              </ReactMapboxGl>)
            : (
              <div className="scene-hero-img">
                <div className="scene-hero-img-container">
                  <img src={this.props.heroURL} />
                </div>
                <div className="scene-hero-img-credit">
                  <h4>Photo by <a href={this.props.heroPhotogURL}>{this.props.heroPhotog}</a> / <a href="http://unsplash.com">Unsplash</a></h4>
                </div>
              </div>
            )

          }

        </div>

        <div className="article-content col-md-4 col-md-offset-2">

          <div className="article-titles">
            <h3 className="view-story-heading story">{this.props.storyTitle}</h3>
            <h1 className="view-story-heading">{this.props.currScene.title}</h1>
            <h3>by {this.props.user ? this.props.user.display_name || this.props.user.username : 'anonymous'}</h3>
          </div>

          <div
            className="article-text"
            dangerouslySetInnerHTML={this.setInnerHTML(this.props.html)}
          />

        </div>

        <div className="article-modules col-md-5 col-md-offset-1">

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
  maps: store.displayState.currScene.maps,
  user: store.displayState.user,
  heroURL: store.displayState.currScene.heroURL,
  heroPhotog: store.displayState.currScene.heroPhotog,
  heroPhotogURL: store.displayState.currScene.heroPhotogURL
});

export default connect(mapStateToProps)(Scene);
