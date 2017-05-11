import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorMapsLocationItem extends Component {
  render() {
    const location = this.props.location
        , index = this.props.index;
    return (
      <div className="location-item">

        <div className="module-btns">
          <button
            className="btn btn-default"
            onClick={this.props.onDeleteLocation.bind(this, this.props.index)}
          >
            <span className="glyphicon glyphicon-trash" ></span>
          </button>
        </div>

        <div className="location-info">
          <div className="location-name-field-container">
            <label>Location:</label>
            <input
              type="text"
              className="location-name-field"
              value={this.props.name}
              onChange={this.props.onLocationsChange.bind(this, index, 'name')}
            />
          </div>
        </div>

    </div>);
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeLocation, deleteLocation } from '../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  position: ownProps.position,
  index: ownProps.index,
  name: ownProps.location.name
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onLocationsChange(locationIndex, field, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeLocation(ownProps.position, locationIndex, field, event.target.value));
  },
  onDeleteLocation(locationIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteLocation(ownProps.position, locationIndex));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMapsLocationItem);
