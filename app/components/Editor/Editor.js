import React, { Component } from 'react';

import EditorScene from './EditorScene';
import EditorScenesMenuItem from './EditorScenesMenuItem';

/* ----- COMPONENT ----- */

class Editor extends Component {
  render() {
    return (
      <div id="storyEditor" className="container">

        <div className="title-row">

          <button
            className="btn btn-success publish-btn"
            onClick={this.props.onSubmitStory}
          >
            Publish Story  <span className="glyphicon glyphicon-share"></span>
          </button>


          <input
            name="storyTitle"
            className="story-title-input"
            type="text"
            placeholder="Title your story"
            onChange={this.props.onStoryTitleChange}
            value={this.props.storyTitle}
          />

        </div>

        <div className="editorscene-wrapper">

          <div className="editor-scenes-menu">

            <div className="editor-scenes-menu-label">
              <h4>Scenes</h4>
            </div>

            <div className="editor-scenes-menu-items-container">
              {
                this.props.scenes && this.props.scenes.map((scene, index) => (
                  <EditorScenesMenuItem
                    position={index}
                    key={index}
                    sceneTitle={scene.title}
                  />
                ))
              }
            </div>

            <div className="editor-scenes-menu-add">
              <button
                className="btn btn-success titlerow-button"
                onClick={this.props.onAddScene}
              >
                Add Scene <span className="glyphicon glyphicon-plus"></span>
              </button>
            </div>

          </div>

          <EditorScene />

        </div>

        {/*
          this.props.editor.scenes.length ? (this.props.editor.scenes.map(scene => (
            <EditorScene
              position={scene.position}
              key={scene.key}
            />
          )))
            : null
        */}

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addScene, changeStoryTitle, submitStory } from '../../reducers/editor';
import store from '../../store';

const mapStateToProps = state => ({
  editor: state.editor,
  storyTitle: state.editor.title,
  user: state.auth,
  scenes: state.editor.scenes
});

const mapDispatchToProps = dispatch => ({
  onAddScene(event) {
    event.preventDefault();
    dispatch(addScene());
  },
  onStoryTitleChange(event) {
    event.preventDefault();
    dispatch(changeStoryTitle(event.target.value));
  },
  onSubmitStory(user, event) {
    event.preventDefault();
    if (!store.getState().editor.title) {
      return alert('Please enter a title for your story.');
    }
    dispatch(submitStory());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
