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
        <div className="actors-box">
          {this.props.locations.length ? (
            this.props.locations.map((location, index) => {
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
import { changeActor, deleteActor, addActor, generateMapLocations } from '../reducers/editor';
import wiki from 'wikijs';

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
  onLocationsChange(actorIndex, field, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeActor(ownProps.position, actorIndex, field, event.target.value));
  },
  onAddLocation(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addActor(ownProps.position));
  },
  onDeleteActor(actorIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteActor(ownProps.position, actorIndex));
  },
  onGrabImage(actorIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    const name = store.getState().editor.scenes[ownProps.position].actors[actorIndex].name;
    return wiki().page(name)
      .then(page => page.mainImage())
      .then(image => {
        dispatch(changeActor(ownProps.position, actorIndex, 'image', image));
      });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMaps);
