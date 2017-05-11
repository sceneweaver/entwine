import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorActorItem extends Component {
  render() {
    const actor = this.props.actor
        , index = this.props.index;
    console.log(actor, index);
    return (<div className="actor-item">

      <div className="actor-btns">
        <button
          className="btn btn-default delete-actor-btn"
          onClick={this.props.onDeleteActor.bind(this, index)}
        >
          <span className="glyphicon glyphicon-trash" ></span>
        </button>
        <button
          className="btn btn-default"
          onClick={this.props.onGrabImage.bind(this, index)}
        >
          <span className="glyphicon glyphicon-camera"></span>
        </button>
      </div>

      <div className="actor-info">

        <div className="actor-name-field-container">
          <label>Name:</label>
          <input
            type="text"
            className="actor-form-field actor-name-field"
            value={actor.name}
            onChange={this.props.onActorsChange.bind(this, index, 'name')}
          />
         </div>
        <br />
        <div className="actor-desc-field-container">
          <label>Description:</label>
          <textarea
            type="text"
            className="actor-form-field actor-desc-field"
            value={actor.description}
            onChange={this.props.onActorsChange.bind(this, index, 'description')}
          />
        </div>
      </div>

      {actor.image ?
        <div className="img-circle" style={{ backgroundImage: `url(${actor.image})` }} />
        :
        <div className="img-circle-letter" style={{ backgroundColor: '#0090FF' }} >
            {actor.name[0]}
        </div>
      }

    </div>);
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeActor, deleteActor } from '../reducers/editor';
import wiki from 'wikijs';
import store from '../store';
import $ from 'jquery';

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
