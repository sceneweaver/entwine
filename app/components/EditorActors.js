import React, { Component } from 'react';

import EditorActorItem from './EditorActorItem';

/* ----- COMPONENT ----- */

class EditorActors extends Component {
  render() {
    return (
      <div className="actors-module">
        <div className="flexcontainer-module-header">
          <div className="module-header">
            <h3>Actors</h3>
          </div>
          <div className="button-container flex-self-right">
            <button
              onClick={this.props.onRefreshActors}
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-refresh" />
            </button>
            <button
              onClick={this.props.onAddActor}
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-plus" />
            </button>
          </div>
        </div>
        <div className="actors-box">
          {this.props.actors.length ? (
            this.props.actors.map((actor, index) => {
              return (
                <EditorActorItem
                  key={index}
                  actor={actor}
                  index={index}
                  position={this.props.position}
                />
              );
            })) : (<p>No actors yet</p>)
          }
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addActor, generateActors } from '../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
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
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);
