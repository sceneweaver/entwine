import React, { Component } from 'react';

import EditorActors from './EditorActors';

export default class EditorScene extends Component {
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
            name="fullStory"
            onChange={this.props.onSceneTextChange}
          />
        </div>
        <div className="col-md-6">
          <div className="generate-actors flex-container editor-actors">
            <button
              className="btn btn-default"
              onClick={this.props.onGenerateActors}
            >
              Generate Actors
                </button>
          </div>
          <EditorActors
            actors={this.props.nouns}
            handleFormChange={this.props.handleActorsChange}
          />
        </div>
      </div>
    )
  }
}
