import React, { Component } from 'react';
import store from '../store';

/* ----- COMPONENT ----- */

class EditorActors extends Component {
  render() {
    return (
      <div className="actors-module">
        <div className="flexcontainer-module-header">
          <div className="module-header">
            <h4>Actors</h4>
          </div>
          <div className="button-container flex-self-right">
            <button
              onClick={this.props.onRefreshActors.bind(this, this.props.position)}
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-refresh" />
            </button>
            <button
              onClick={this.props.onAddActor.bind(this, event, this.props.position)}
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-plus" />
            </button>
          </div>
        </div>
        <div className="actors-box">
          {this.props.actors.length ? (
            this.props.actors.map((actor, index) => {
              console.log(actor);
              return (
                <div key={index} className="actor-item">
                 { this.props.actors[index].image ?
                   <div className="actor-image">
                    <img className="img-circle" src={this.props.actors[index].image} alt="Actor image." />
                  </div> : null}
                  <div className="actor-info">
                    <label>Name:</label>
                    <input
                      name="actor-name-field"
                      value={actor.name}
                      onChange={this.props.onActorsChange.bind(this, event, this.props.position, index, 'name')}
                    /><br />
                    <label>Description:</label>
                    <input
                      name="actor-description-field"
                      value={actor.description}
                      onChange={this.props.onActorsChange.bind(this, event, this.props.position, index, 'description')}
                    />
                  </div>
                  <div className="actor-delete">
                    <button
                      className="btn btn-default"
                      name={`${this.props.position}-${index}`}
                      onClick={this.props.onDeleteActor.bind(this)}
                    >X
                      </button>
                  </div>
                  <div className="actor-gen-info">
                    <button
                      className="btn btn-default"
                      onClick={this.props.onGrabImage.bind(this, this.props.position, index)}
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

const mapStateToProps = (store, ownProps) => ({
  actors: store.editor.scenes[ownProps.position].actors,
  position: ownProps.position
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefreshActors(position) {
    dispatch(generateActors(position));
  },
  onActorsChange(event, position, actorIndex, field) {
    const keyChange = [].slice.call(arguments)[4]
        , newInput = keyChange.target.value;
    event.preventDefault();
    keyChange.preventDefault();
    event.stopPropagation();
    keyChange.stopPropagation();
    dispatch(changeActor(position, actorIndex, field, newInput));
  },
  onAddActor(event, position) {
    console.log(event);
    event.preventDefault();
    dispatch(addActor(position));
  },
  onDeleteActor(event) {
    event.preventDefault();
    const eventNameArray = event.target.name.split('-')
      , position = +eventNameArray[0]
      , actorIndex = eventNameArray[1];
    dispatch(deleteActor(position, actorIndex));
  },
  onGrabImage(position, actorIndex) {
    const event = [].slice.call(arguments)[3];
    event.preventDefault();
    event.stopPropagation();
    const name = store.getState().editor.scenes[position].actors[actorIndex].name;
    return wiki().page(name)
      .then(page => page.mainImage())
      .then(image => {
        dispatch(changeActor(position, actorIndex, 'image', image));
      });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);

