import React, { Component } from 'react';

/* ----- COMPONENT ----- */

const EditorActorItem = props => {
  const actor = props.actor
    , index = props.index;
  return (
    <div className="actor-module-item">
      <div className="actor-image-container">
        {
          actor.image ? (
            <div
              className="img-circle img-icon"
              style={{ backgroundImage: `url(${actor.image})` }}
            />
          ) : (
            <div
              className="img-circle-letter img-icon"
              style={{ backgroundColor: '#0090FF' }}
            >
              {actor.name[0]}
            </div>
          )
        }
      </div>

      <div className="actor-info">
        <div className="actor-name-field-container">
          <h5>Name:</h5>
          <input
            type="text"
            className="actor-form-field actor-name-field"
            value={actor.name}
            onChange={props.onActorsChange.bind(this, index, 'name')}
          />
        </div>
        <br />
        <div className="actor-image-field-container">
          <h5>Image URL:</h5>
          <input
            type="text"
            className="actor-form-field actor-image-field"
            value={actor.image}
            onChange={props.onActorsChange.bind(this, index, 'image')}
          />
          <button
            className="btn btn-default actor-grab-image-btn"
            onClick={props.onGrabImage.bind(this, index)}
          >
            <i className="fa fa-file-image-o" aria-hidden="true" />
          </button>
        </div>
        <div className="actor-desc-field-container">
          <h5>Description:</h5>
          <textarea
            type="text"
            className="actor-form-field actor-desc-field"
            value={actor.description}
            onChange={props.onActorsChange.bind(this, index, 'description')}
          />
        </div>
      </div>

      <button
        className="btn btn-default delete-actor-btn"
        onClick={props.onDeleteActor.bind(this, index)}
      >
        <span className="glyphicon glyphicon-trash" />
      </button>

    </div>
  );
};


/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeActor, deleteActor } from '../../reducers/editor';
import wiki from 'wikijs';
import store from '../../store';

const mapStateToProps = (state, ownProps) => ({
  position: ownProps.position,
  index: ownProps.index,
  name: state.editor.scenes[ownProps.position].actors[ownProps.index].name,
  description: state.editor.scenes[ownProps.position].actors[ownProps.index].description,
  image: state.editor.scenes[ownProps.position].actors[ownProps.index].image
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onActorsChange(actorIndex, field, event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(changeActor(ownProps.position, actorIndex, field, event.target.value));
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

export default connect(mapStateToProps, mapDispatchToProps)(EditorActorItem);
