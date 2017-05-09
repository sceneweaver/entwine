import React, { Component } from 'react'

/* ----- COMPONENT ----- */

class EditorActors extends Component {
  render() {
    return (
      <div className="actors-module">
        <div className="buttonContainer">
          <button
            name={this.props.position}
            onClick={this.props.onAddActor}
            className="btn btn-default"
          >
            Add New Actor
          </button>
        </div>
        <div className="actors-box">
          { this.props.actors.length ? (
            this.props.actors.map((actor, index) => {
              return (
                <div key={} className="actor-item">
                  <div className="actor-image">
                    <img className="img-circle" src={actor.image} alt="Actor image." />
                  </div>
                  <div className="actor-info">
                    <label>Name:</label>
                    <input
                      className="actorFormField"
                      name={`${this.props.position}-${index}-title`}
                      defaultValue={actor.title}
                      onChange={this.props.onActorsChange}
                    /><br />
                    <label>Description:</label>
                    <input
                      className="actorFormField"
                      name={`${this.props.position}-${index}-description`}
                      defaultValue={actor.description}
                      onChange={this.props.onActorsChange}
                    />
                  </div>
                  <div className="actor-delete">
                    <button
                      className="btn btn-default"
                      name={`${this.props.position}-${index}`}
                      onClick={this.props.onDeleteActor}
                    >X
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
import { changeActor, deleteActor, addActor } from '../reducers/editor';

const mapStateToProps = (store, ownProps) => ({
  actors: store.editor.scenes[ownProps.position - 1].actors,
  position: ownProps.position
});

const mapDispatchToProps = dispatch => ({
  onActorsChange(event) {
    event.preventDefault();
    const eventNameArray = event.target.name.split('-')
      , position = eventNameArray[0]
      , actorIndex = eventNameArray[1]
      , field = eventNameArray[2]
      , input = event.target.value;
    dispatch(changeActor(position, actorIndex, field, input));
  },
  onAddActor(event) {
    event.preventDefault();
    dispatch(addActor(event.target.name))
  },
  onDeleteActor(event) {
    event.preventDefault();
    const eventNameArray = event.target.name.split('-')
      , position = eventNameArray[0]
      , actorIndex = eventNameArray[1];
    dispatch(deleteActor(position, actorIndex));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);

