import React, { Component } from 'react';

import EditorActors from './EditorActors';

class EditorScene extends Component {
  render() {
    return (
      <div className="row">
        <div className="form-group col-md-6">
          <textarea
            rows="10"
            cols="78"
            type="text"
            className="form-control"
            placeholder="Scene"
            name={this.props.position}
            onChange={this.props.onSceneTextChange}
          />
        </div>
        <div className="col-md-6">
          <div className="generate-actors flex-container editor-actors">
            <button
              className="btn btn-default"
              name={this.props.position}
              onClick={this.props.onGenerateActors}
            >
              Generate Actors
            </button>
          </div>
          <EditorActors
            position={this.props.position}
          />
        </div>
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { generateActors, setSceneText } from '../reducers/editor'

const mapStateToProps = (store, ownProps) => ({
  position: ownProps.position
});

const mapDispatchToProps = dispatch => ({
  onGenerateActors(event) {
    event.preventDefault();
    dispatch(generateActors(+event.target.name));
  },
  onSceneTextChange(event) {
    const position = event.target.name
        , input = event.target.value;
    dispatch(setSceneText(position, input))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
