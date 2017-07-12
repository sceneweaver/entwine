import React, { Component } from 'react';
import ViewActors from './ViewActors';
import ReactMapboxGl, { Layer, Feature, Marker } from 'react-mapbox-gl';
import ReactTimeout from 'react-timeout';

/* ----- COMPONENT ----- */

class Scene extends Component {

  constructor() {
    super();
    this.state = {
      coords: [],
      style: '',
      zoom: 1,
    }
  }

  setInnerHTML(html) {
    return { __html: html }
  }

  setMapJSX(jsx) {
    return { __html: jsx }
  }

  componentWillReceiveProps(nextProps) {
    // to animate map, set initial zoom to something more zoomed out than the actual value
    if (nextProps.maps && nextProps.maps.length) {
      if (!this.state.coords.length) {
        let zoom = nextProps.maps[0].zoom;
        if (zoom > 12) zoom -= 9;
        else if (zoom > 6) zoom -= 3;
        else if (zoom > 2) zoom -= 2;

        this.setState({
          coords: nextProps.maps[0].coords.split(','),
          style: nextProps.maps[0].style,
          zoom: zoom
        });

      } else {
        this.setState({
          coords: nextProps.maps[0].coords.split(','),
          style: nextProps.maps[0].style,
          zoom: nextProps.maps[0].zoom
        });
      }
    } else {
      this.setState({
        coords: [],
        style: '',
        zoom: 1,
      });
    }
  }

  moveOnUp() {
    if (this.state.zoom !== this.props.maps[0].zoom) {
      this.setState({
        coords: this.props.maps[0].coords.split(','),
        style: this.props.maps[0].style,
        zoom: this.props.maps[0].zoom
      });
    }
  }

  render() {
    return (
      <div className="col m10">
        <div className="scene-hero">
          {
            this.state.style ? (
              <ReactMapboxGl
                style={`mapbox://styles/mapbox/${this.state.style}-v9`}
                accessToken="pk.eyJ1IjoiZm91cmVzdGZpcmUiLCJhIjoiY2oyY2VnbTN2MDJrYTMzbzgxNGV0OWFvdyJ9.whTLmuoah_lfoQhC_abI5w"
                zoom={[this.state.zoom]}
                pitch={30}
                center={this.state.coords}
                containerStyle={{
                  height: "100%",
                  width: "auto"
                }}
                onStyleLoad={this.moveOnUp.bind(this)}
              />
            ) : this.props.heroUnsplash ? (
                  <div className="scene-hero-img">
                    <div
                      className="scene-hero-img-container"
                      style={{ backgroundImage: `url(${this.props.heroURL})` }}
                    />
                    <div className="scene-hero-img-credit">
                      <h4>Photo by <a href={this.props.heroPhotogURL}>{this.props.heroPhotog}</a> / <a href="http://unsplash.com">Unsplash</a></h4>
                    </div>
                  </div>
                ) : this.props.heroURL && this.props.heroURL !== 'Not found' ? (
                      <div className="scene-hero-img">
                        <div
                          className="scene-hero-img-container"
                          style={{ backgroundImage: `url(${this.props.heroURL})` }}
                        />
                        <div className="scene-hero-img-credit">
                          <h4>Photo by <a href={this.props.heroPhotogURL}>{this.props.heroPhotog}</a></h4>
                        </div>
                      </div>
                    ) : null
          }
        </div>

        <div className="article-content col m4">

          <div className="article-titles">
            <h3 className="view-story-heading title-font story">{this.props.storyTitle}</h3>
            <h1 className="view-story-heading title-font">{this.props.currScene.title}</h1>
            <h4 className="view-story-heading title-font">by {this.props.user ? this.props.user.display_name || this.props.user.username : 'anonymous'}</h4>
          </div>

          <div
            className="article-text"
            dangerouslySetInnerHTML={this.setInnerHTML(this.props.html)}
          />

        </div>

        {
          this.props.actors.length ? (
            <div className="article-modules col m5 offset-m4">
              <h4>IN THIS SCENE</h4>
              <ViewActors />
            </div>
          ) : (
              null
            )
        }
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
  heroPhotogURL: store.displayState.currScene.heroPhotogURL,
  heroUnsplash: store.displayState.currScene.heroUnsplash
});

export default connect(mapStateToProps)(ReactTimeout(Scene));
