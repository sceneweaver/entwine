import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorMapsLocation extends Component {
  constructor() {
    super()
    this.onChanges.bind(this);
    this.state = {
      location: ''
    }
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
            onClick={this.props.onChangeLocation.bind(this, index, this.state.location)}
          >
          <span className="glyphicon glyphicon-refresh" ></span>
          </button>
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
              onKeyPress={this.props.onChangeLocation.bind(this, index, null)}
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
    this.setState({location: event.target.value})
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeLocation(ownProps.position, locationIndex, field, event.target.value));
  },
  onChangeLocation(index, valueOnClick, event) {
    let value;
    if (valueOnClick) value = valueOnClick;
    else if (event.key === 'Enter') value = event.target.value;
    if (event.key === 'Enter' || valueOnClick) {
      console.log(valueOnClick, event.target.value)
      event.preventDefault();
      event.stopPropagation();
      dispatch(generateSingleMapLocation(ownProps.position, value));
    }
  },
  onDeleteLocation(locationIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteLocation(ownProps.position, locationIndex));
  },

});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMapsLocation);
