import React, { Component } from 'react';

import EditorScene from './EditorScene';

/* ----- COMPONENT ----- */

class Editor extends Component {
  componentWillUnmount() {
    // when user navigates out of editor, remove title and locations from store
    this.props.editor.scenes.forEach((scene, idx) => {
      this.props.onDeleteLocation(idx);
    })
    this.props.changeStoryTitle('');
  }

  render() {
    return (
      <div id="storyEditor">

        <div className="title-row">
          <input
            name="storyTitle"
            className="story-title-input"
            type="text"
            placeholder="Title your story"
            onChange={this.props.onStoryTitleChange}
            value={this.props.storyTitle}
          />
        </div>

        <div className="title-row">
          <button
            className="btn btn-success titlerow-button"
            onClick={this.props.onAddScene}
          >
            Add Scene <span className="glyphicon glyphicon-plus"></span>
          </button>
          <button
            className="btn btn-success titlerow-button"
            onClick={this.props.onSubmitStory}
          >
            Publish Story  <span className="glyphicon glyphicon-share"></span>
          </button>
        </div>

        {
          this.props.editor.scenes.length ? (this.props.editor.scenes.map(scene => (
            <EditorScene
              position={scene.position}
              key={scene.key}
            />
          )))
            : null
        }

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addScene, changeStoryTitle, submitStory, deleteLocation} from '../../reducers/editor';
import store from '../../store';

const mapStateToProps = store => ({
  editor: store.editor,
  storyTitle: store.editor.title,
  user: store.auth
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
  },
  onDeleteLocation(position) {
    dispatch(deleteLocation(position));
  },
  changeStoryTitle(newTitle) {
    dispatch(changeStoryTitle(newTitle))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
