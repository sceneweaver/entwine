import React, { Component } from 'react';

import EditorActors from './EditorActors';

class EditorScene extends Component {
  render() {
    console.log("editorscene props", this.props);
    return (
      <div className="row">
        <div className="col-md-1">
          <button
            className="btn btn-default"
            onClick={this.props.onDeleteScene.bind(this, event, this.props.position)}
          >
            Delete Scene
          </button>
        </div>
        <div className="form-group col-md-5">
          <input
            placeholder="Scene Title"
            name={this.props.position}
            onChange={this.props.onSceneTitleChange}
            value={this.props.title}
          />
          <textarea
            rows="10"
            cols="78"
            type="text"
            className="form-control"
            placeholder="Scene Text"
            name={this.props.position}
            value={this.props.text}
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
            <button
              className="btn btn-default"
              name={this.props.position}
              onClick={this.props.onGenerateMaps}
            >
              Generate Map
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
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { toggleActors, generateActors, setSceneText, setSceneTitle, deleteScene, generateMapLocations } from '../reducers/editor'

const mapStateToProps = (store, ownProps) => ({
  editor: store.editor,
  position: ownProps.position,
  title: store.editor.scenes[ownProps.position].title,
  text: store.editor.scenes[ownProps.position].paragraphs[0],
  //position is not right here for text
  displayActors: store.editor.scenes[ownProps.position].displayActors
});

const mapDispatchToProps = dispatch => ({
  onGenerateActors(event) {
    event.preventDefault();
    dispatch(toggleActors(+event.target.name, true))
    dispatch(generateActors(+event.target.name));
  },
  onSceneTitleChange(event) {
    event.preventDefault();
    dispatch(setSceneTitle(+event.target.name, event.target.value));
  },
  onSceneTextChange(event) {
    event.preventDefault();
    dispatch(setSceneText(+event.target.name, event.target.value));
  },
  onDeleteScene(event, position) {
    event.preventDefault();
    dispatch(deleteScene(position))
  },
  onGenerateMaps(event) {
    event.preventDefault();
    dispatch(generateMapLocations(+event.targe.name));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
