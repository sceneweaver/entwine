import React from 'react';

/* ----- COMPONENT ----- */

const EditorActorItem = props => {
  const index = props.index;
  const name = props.name;
  const description = props.description;
  const image = props.image;
  return (
    <div className="actor-item">
      <div className="actor-buttons btn-group-vertical">
        <button
          className="btn btn-default"
          onClick={props.onDeleteActor.bind(this, index)}
        >
          <span className="glyphicon glyphicon-trash" ></span>
        </button>
        <button
          className="btn btn-default"
          onClick={props.onGrabImage.bind(this, index)}
        >
          <span className="glyphicon glyphicon-refresh"></span>
        </button>
      </div>

      <div className="actor-info">
        <label>Name:</label>
        <input
          type="text"
          className="actor-form-field"
          value={name}
          onChange={props.onActorsChange.bind(this, index, 'name')}
        /><br />
        <label>Description:</label>
        <input
          type="text"
          className="actor-form-field"
          value={description}
          onChange={props.onActorsChange.bind(this, index, 'description')}
        />
      </div>

      {
        image ? (
          <div className="img-circle" style={{ backgroundImage: `url(${image})` }} />
        ) : (
          <div className="img-circle-letter" style={{ backgroundColor: 'rgb(14, 186, 100)' }} >
              {name[0]}
          </div>
        )
      }

    </div>
  );
};


/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeActor, deleteActor } from '../reducers/editor';
import wiki from 'wikijs';
import store from '../store';

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
