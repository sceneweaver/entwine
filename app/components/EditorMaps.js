import React, { Component } from 'react';
import store from '../store';

/* ----- COMPONENT ----- */

class EditorMaps extends Component {
  render() {
    return (
      <div className="actors-module">
        <div className="flexcontainer-module-header">
          <div className="module-header">
            <h4>Map</h4>
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
                <div key={index} className="actor-item">
                  {this.props.actors[index].image ?
                    <div className="actor-image">
                      <img className="img-circle" src={this.props.actors[index].image} alt="Actor image." />
                    </div> : null}
                  <div className="actor-info">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="actor-name-field"
                      value={actor.name}
                      onChange={this.props.onActorsChange.bind(this, index, 'name')}
                    /><br />
                    <label>Description:</label>
                    <input
                      type="text"
                      name="actor-description-field"
                      value={actor.description}
                      onChange={this.props.onActorsChange.bind(this, index, 'description')}
                    />
                  </div>
                  <div className="actor-delete">
                    <button
                      className="btn btn-default"
                      onClick={this.props.onDeleteActor.bind(this, index)}
                    >X
                      </button>
                  </div>
                  <div className="actor-gen-info">
                    <button
                      className="btn btn-default"
                      onClick={this.props.onGrabImage.bind(this, index)}
                    >
                      GRAB IMAGE
                      </button>
                  </div>
                </div>
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
import { changeActor, deleteActor, addActor, generateActors } from '../reducers/editor';
import wiki from 'wikijs';

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
  onActorsChange(actorIndex, field, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeActor(ownProps.position, actorIndex, field, event.target.value));
  },
  onAddActor(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addActor(ownProps.position));
  },
  onDeleteActor(actorIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(deleteActor(ownProps.position, actorIndex));
  },
  onGrabImage(actorIndex, event) {
    event.preventDefault();
    event.stopPropagation();
    const name = store.getState().editor.scenes[ownProps.position].actors[actorIndex].name;
    return wiki().page(name)
      .then(page => page.mainImage())
      .then(image => {
        dispatch(changeActor(ownProps.position, actorIndex, 'image', image));
      });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMaps);