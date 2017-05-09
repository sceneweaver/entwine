import React, { Component } from 'react';

import EditorActors from './EditorActors';

class EditorScene extends Component {
  render() {
    return (
      <div className="row">
        <div className="col-md-1">
          <button
            className="btn btn-default"
            name={this.props.position}
            onClick={this.props.onDeleteScene}
          >
            Delete Scene
          </button>
        </div>
        <div className="form-group col-md-5">
          <input
            placeholder="Scene Title"
            name={this.props.position}
            onChange={this.props.onSceneTitleChange}
            defaultValue={this.props.title}
          />
          <textarea
            rows="10"
            cols="78"
            type="text"
            className="form-control"
            placeholder="Scene Text"
            name={this.props.position}
            defaultValue={this.props.text}
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
              Show Actors
            </button>
          </div>
        </div>
        <div className="col-md-5">
          {this.props.displayActors ?
            <EditorActors
              position={this.props.position}
            /> :
            null}
        </div>
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { toggleActors, generateActors, setSceneText, setSceneTitle, deleteScene } from '../reducers/editor'

const mapStateToProps = (store, ownProps) => ({
  position: ownProps.position,
  title: store.editor.scenes[ownProps.position] && store.editor.scenes[ownProps.position].title,
  text: store.editor.scenes[ownProps.position] && store.editor.scenes[ownProps.position].paragraphs[0],
  displayActors: store.editor.scenes[ownProps.position] && store.editor.scenes[ownProps.position].displayActors
});

const mapDispatchToProps = dispatch => ({
  onGenerateActors(event) {
    event.preventDefault();
    dispatch(toggleActors(+event.target.name, true))
    dispatch(generateActors(+event.target.name));
  },
  onSceneTitleChange(event) {
    event.preventDefault();
    dispatch(setSceneTitle(+event.target.name, event.target.value))
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
