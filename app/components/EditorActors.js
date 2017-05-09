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
              onClick={this.props.onRefreshActors.bind(this, event, this.props.position)}
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
              return (
                <div key={actor.title + index} className="actor-item">
                  <div className="actor-image">
                    <img className="img-circle" src={store.getState().editor.scenes[this.props.position].actors[index].image} alt="Actor image." />
                  </div>
                  <div className="actor-info">
                    <label>Name:</label>
                    <input
                      className="actorFormField"
                      name={`${this.props.position}-${index}-title`}
                      defaultValue={actor.title}
                      onChange={this.props.onActorsChange.bind(this)}
                    /><br />
                    <label>Description:</label>
                    <input
                      className="actorFormField"
                      name={`${this.props.position}-${index}-description`}
                      defaultValue={actor.description}
                      onChange={this.props.onActorsChange.bind(this)}
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
                      name={`${this.props.position}-${index}`}
                      onClick={this.props.onRegenActor}
                    >GRAB IMAGE
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
  onRefreshActors(event, position) {
    event.preventDefault();
    dispatch(generateActors(position));
  },
  onActorsChange(event) {
    event.preventDefault();
    const eventNameArray = event.target.name.split('-')
      , position = eventNameArray[0]
      , actorIndex = eventNameArray[1]
      , field = eventNameArray[2]
      , input = event.target.value;
    dispatch(changeActor(position, actorIndex, field, input));
  },
  onAddActor(event, position) {
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
  onRegenActor(event) {
    event.preventDefault();
    const eventNameArray = event.target.name.split('-')
      , position = eventNameArray[0]
      , actorIndex = eventNameArray[1]
      , title = store.getState().editor.scenes[position].actors[actorIndex].title;
    return wiki().page(title)
      .then(page => page.mainImage())
      .then(image => {
        dispatch(changeActor(position, actorIndex, 'image', image));
      });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);

