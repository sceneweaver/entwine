import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorActorItem extends Component {
  render() {
    const actor = this.props.actor;
    const index = this.props.index;
    return (<div className="actor-item">

      <div className="actor-buttons btn-group-vertical">
        <button
          className="btn btn-default"
          onClick={this.props.onDeleteActor.bind(this, index)}
        >
          <span className="glyphicon glyphicon-trash" ></span>
        </button>
        <button
          className="btn btn-default"
          onClick={this.props.onGrabImage.bind(this, index)}
        >
          <span className="glyphicon glyphicon-refresh"></span>
        </button>
      </div>

      <div className="actor-info">
        <label>Name:</label>
        <input
          type="text"
          className="actor-form-field"
          value={actor.name}
          onChange={this.props.onActorsChange.bind(this, index, 'name')}
        /><br />
        <label>Description:</label>
        <input
          type="text"
          className="actor-form-field"
          value={actor.description}
          onChange={this.props.onActorsChange.bind(this, index, 'description')}
        />
      </div>

      { actor.image ?
          <div className="img-circle" style={{ backgroundImage: `url(${actor.image})` }} />
        : <p>No image</p> }

    </div>);
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeActor, deleteActor } from '../reducers/editor';
import wiki from 'wikijs';
import store from '../store';

const mapStateToProps = (state, ownProps) => ({
  position: ownProps.position
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
