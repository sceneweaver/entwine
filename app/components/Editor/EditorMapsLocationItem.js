import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorMapsLocationItem extends Component {
  constructor() {
    super()
    this.onChanges.bind(this);
  }
  onChanges(index, event) {
    this.props.onLocationsChange(index, event.target.value);
  }

  render() {
    const index = this.props.index;
    return (
      <div className="location-item">

        <div className="module-btns">
          <button
            className="btn btn-default"
            onClick={this.props.onDeleteLocation.bind(this, index)}
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
              onChange={this.props.onFieldChange.bind(this, index, 'name')}
              onKeyPress={this.props.onChangeLocation.bind(this, index)}
            />
          </div>
        </div>

    </div>);
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeLocation, deleteLocation, generateSingleMapLocation } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  position: ownProps.position,
  index: ownProps.index,
  name: ownProps.location.name
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFieldChange(locationIndex, field, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeLocation(ownProps.position, locationIndex, field, event.target.value));
  },
  onChangeLocation(index, event) {
    if(event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      console.log(event.target.value)
      dispatch(generateSingleMapLocation(ownProps.position, event.target.value));

    }
  },
  onDeleteLocation(locationIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteLocation(ownProps.position, locationIndex));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMapsLocationItem);
