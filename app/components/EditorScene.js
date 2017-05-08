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
        <div className="col-md-1">
          <div className="generate-actors flex-container editor-actors">
            <button
              className="btn btn-default"
              name={this.props.position}
              onClick={this.props.onGenerateActors}
            >
              Generate Actors
            </button>
          </div>
        </div>
        <div className="col-md-4">
          { this.props.displayActors ?
            <EditorActors
              position={this.props.position}
            /> :
            null }
        </div>
        <div className="col-md-1">
          <button
            className="btn btn-default"
            name={this.props.position}
            onClick={this.props.onDeleteScene}
          >
            Delete Scene
          </button>
        </div>
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { toggleActors, generateActors, setSceneText, deleteScene } from '../reducers/editor'

const mapStateToProps = (store, ownProps) => ({
  position: ownProps.position,
  displayActors: store.editor.scenes[ownProps.position - 1].displayActors
});

const mapDispatchToProps = dispatch => ({
  onGenerateActors(event) {
    event.preventDefault();
    dispatch(toggleActors(+event.target.name, true))
    dispatch(generateActors(+event.target.name));
  },
  onSceneTextChange(event) {
    event.preventDefault();
    dispatch(setSceneText(+event.target.name, event.target.value))
  },
  onDeleteScene(event) {
    event.preventDefault();
    dispatch(deleteScene(+event.target.name))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
