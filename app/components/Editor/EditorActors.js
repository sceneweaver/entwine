import React, { Component } from 'react';

import EditorActorItem from './EditorActorItem';

/* ----- COMPONENT ----- */

class EditorActors extends Component {
  render() {
    return (
      <div className="actors-module">
        <div className="flexcontainer-module-header actors-module-header">

          <div className="module-collapse-btn">
            <button
              onClick={this.props.onHideActors}
              className="btn actors-module-btn"
            >
              Close
            </button>
          </div>

          <h3 className="module-header">{this.props.sceneTitle ? this.props.sceneTitle : 'Scene ' + (+this.props.position + 1).toString() + ' '} >> Characters</h3>

          <div className="flex-self-right">
            <button
              onClick={this.props.onRefreshActors}
              className="btn actors-module-btn actors-gen-btn"
            >
              Generate &nbsp; <i className="fa fa-refresh" aria-hidden="true" />
            </button>
            <button
              onClick={this.props.onAddActor}
              className="btn actors-module-btn actors-add-btn"
            >
              Add New &nbsp; <i className="fa fa-plus" aria-hidden="true" />
            </button>
          </div>

        </div>

        <div className="actors-box">
          {this.props.actors.length ? (
            this.props.actors.map((actor, index) => {
              return (
                <EditorActorItem
                  key={index}
                  index={index}
                  actor={actor}
                  position={this.props.position}
                />
              );
            })) : (<div>
              <h3>Who are the characters in your story?</h3> <p>Use our generator to find the key players in your piece and create informational blurbs for each.</p>
            </div>)
          }
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addActor, generateActors, deselectModule } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  sceneTitle: state.editor.scenes[ownProps.position].title,
  actors: state.editor.scenes[ownProps.position].actors,
  position: ownProps.position
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefreshActors(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(generateActors(ownProps.position));
  },
  onAddActor(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addActor(ownProps.position));
  },
  onHideActors(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).removeClass('toggled');
    $('.editorscene-sidebar-bg').removeClass('toggled');
    dispatch(deselectModule(ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);
