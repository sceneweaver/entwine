import React, { Component } from 'react';

import EditorScene from './EditorScene';
import findPronouns from '../../server/utils/findPronouns';

/* ----- COMPONENT ----- */

class Editor extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div id="storyEditor">
        <form onSubmit={this.props.submitStory}>
          <div className="row titleRow">
            <div className="col-md-6">
              <input
                name="storyTitle"
                type="text"
                placeholder="Story Title"
                className="titleInput"
              />
            </div>
            <div className="col-md-3">
              <div className="addScene">
                <button
                  className="btn btn-success"
                  onClick={this.props.addScene}
                >
                  Add Scene
                </button>
              </div>
            </div>
            <div className="col-md-3">
              <div className="publish">
                <button
                  className="btn btn-success"
                  type="submit"
                >
                  Publish My Story
                </button>
              </div>
            </div>
          </div>

          {
            this.props.scenes.length ? (this.props.scenes.map(scene => (
              <EditorScene
                key={scene.position}
                position={scene.position}
              />
            )))
              : null
          }

        </form>
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addScene, submitStory } from '../reducers/editor'

const mapStateToProps = store => ({
  scenes: store.editor.scenes
});

const mapDispatchToProps = dispatch => ({
  addScene(event) {
    event.preventDefault();
    dispatch(addScene());
  },
  submitStory(event) {
    event.preventDefault();
    dispatch(event.target.storyTitle.value);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
