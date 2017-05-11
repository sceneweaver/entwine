import React, { Component } from 'react';
import EditorMapModule from './EditorMapModule';
import EditorMapsLocationItem from './EditorMapsLocationItem';

/* ----- COMPONENT ----- */

class EditorMaps extends Component {
  constructor(props) {
    super(props)
    this.state = {
      coords: [],
      locationTypes: [],
      locationAddress: '',
      mapboxStyle: 'light',
      mapboxZoom: 13,
      mapboxPitch: 30,
      mapboxInteractivity: true,
      mapboxAnimationMethod: 'flyTo',
    }

    this.onFindCoordsClick = this.onFindCoordsClick.bind(this);
    this.changeMapboxStyle = this.changeMapboxStyle.bind(this);
    this.changeMapboxZoom = this.changeMapboxZoom.bind(this);
    this.changeMapboxAnimationMethod = this.changeMapboxAnimationMethod.bind(this);
    this.toggleMapboxInteractivity = this.toggleMapboxInteractivity.bind(this);
  }

   onFindCoordsClick(event) {
    event.preventDefault();
    this.findCoordinates(event.target.location.value);
  }

  changeMapboxStyle(event) {
    event.preventDefault();
    this.setState({ mapboxStyle: event.target.value })
  }

  changeMapboxZoom(event) {
    event.preventDefault();
    this.setState({ mapboxZoom: event.target.value })
  }

  changeMapboxAnimationMethod(event) {
    event.preventDefault();
    this.setState({ mapboxAnimationMethod: event.target.value })
  }

  toggleMapboxInteractivity(event) {
    event.preventDefault();
    this.setState({ mapboxInteractivity: event.target.value })
  }

  render() {
    return (
      <div className="maps-module">
        <div className="flexcontainer-module-header">

          <div className="module-collapse-btn">
            <button
              onClick={this.props.onHideMaps}
              className="btn maps-module-btn"
            >
              <span className="glyphicon glyphicon-menu-right"></span>
            </button>
          </div>

          <h3 className="module-header">{this.props.sceneTitle ? this.props.sceneTitle : 'Scene ' + (+this.props.position + 1).toString() + " "} >> Map</h3>

          <div className="flex-self-right">
            <button
              onClick={this.props.onRefreshLocations}
              className="btn maps-module-btn"
            >
              Regenerate All &nbsp; <span className="glyphicon glyphicon-refresh" />
            </button>
            {/*
            <button
              onClick={this.props.onAddLocation}
              className="btn maps-module-btn"
            >
              Add Location &nbsp; <span className="glyphicon glyphicon-plus" />
            </button>
            */}
          </div>

        </div>

        <div className="locations-box">
        {
          this.props.locations.length ? this.props.locations.map((location, index) => {
            return (
              <EditorMapsLocationItem
                location={location}
                index={index}
                key={index}
                position={this.props.position}
              />
            );
          })
            : <p>Generate locations to generate map</p>
        }
        </div>

        {
          this.props.locations.length ?
            <EditorMapModule
              position={this.props.position}
            />
            : null
        }

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addLocation, generateMapLocations, toggleMaps } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  locations: state.editor.scenes[ownProps.position].locations,
  position: ownProps.position,
  sceneTitle: state.editor.scenes[ownProps.position].title,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHideMaps(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).toggleClass("toggled");
    dispatch(toggleMaps(ownProps.position, true));
  },
  onRefreshLocations(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(generateMapLocations(ownProps.position));
  },
  onAddLocation(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addLocation(ownProps.position));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMaps);
