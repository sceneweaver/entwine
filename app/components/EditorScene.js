import React, { Component } from 'react';

import EditorActors from './EditorActors';

class EditorScene extends Component {
  render() {
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
            onChange={this.props.onSceneTitleChange.bind(this, event, this.props.position)}
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
          <div className="generate-actors flexcontainer-vertical editor-actors">
            <div className="row">
              <button
                className="btn btn-default"
                onClick={this.props.onShowActors.bind(this, event, this.props.position)}
              >
                Show Actors
            </button>
            </div>
            <div className="row">
              <button
                className="btn btn-default"
                name={this.props.position}
                onClick={this.props.onGenerateMaps.bind(this, event, this.props.position)}
              >
                Generate Map
            </button>
            </div>
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
  displayActors: store.editor.scenes[ownProps.position].displayActors
});

const mapDispatchToProps = dispatch => ({
  onShowActors(event, position) {
    event.preventDefault();
    dispatch(toggleActors(+position, true));
  },
  onSceneTitleChange(event, position) {
    event.preventDefault();
    dispatch(setSceneTitle(+position, event.target.value));
  },
  onSceneTextChange(event) {
    event.preventDefault();
    dispatch(setSceneText(+event.target.name, event.target.value));
  },
  onDeleteScene(event, position) {
    event.preventDefault();
    dispatch(deleteScene(+position));
  },
  onGenerateMaps(event, position) {
    event.preventDefault();
    dispatch(generateMapLocations(+position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
