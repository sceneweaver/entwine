import React, { Component } from 'react';
import store from '../store';
import findPlaces from '../../server/utils/findPlaces'

/* ----- COMPONENT ----- */

class EditorMaps extends Component {
  render() {
    return (
      <div className="maps-module">
        <div className="flexcontainer-module-header">
          <div className="module-header">
            <h4>Map</h4>
          </div>
          <div className="button-container flex-self-right">
            <button
              onClick={this.props.onRefreshLocations}
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-refresh" />
            </button>
            <button
              onClick={this.props.onAddLocation}
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-plus" />
            </button>
          </div>
        </div>
        <div className="locations-box">
          {this.props.locations.length ? (
            this.props.locations.map((location, index) => {
              console.log("HIYA", location.name)
              return (
                <div key={index} className="location-item">
                  <div className="location-info">
                    <label>Location:</label>
                    <input
                      type="text"
                      name="location-name-field"
                      value={location.name}
                      onChange={this.props.onLocationsChange.bind(this, index, 'name')}
                    /><br />
                  </div>
                  <div className="location-delete">
                    <button
                      className="btn btn-default"
                      onClick={this.props.onDeleteLocation.bind(this, index)}
                    >X
                      </button>
                  </div>
                </div>
              );
            })) : (<p>No locations yet</p>)
          }
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeLocation, deleteLocation, addLocation, generateMapLocations } from '../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  locations: state.editor.scenes[ownProps.position].locations,
  position: ownProps.position
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefreshLocations(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(generateMapLocations(ownProps.position));
  },
  onLocationsChange(locationIndex, field, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeLocation(ownProps.position, locationIndex, field, event.target.value));
  },
  onAddLocation(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addLocation(ownProps.position));
  },
  onDeleteLocation(locationIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteLocation(ownProps.position, locationIndex));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMaps);
