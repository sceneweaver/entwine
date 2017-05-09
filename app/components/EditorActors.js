import React, { Component } from 'react'

/* ----- COMPONENT ----- */

class EditorActors extends Component {
  render() {
    console.log("this.props.position", this.props.position)
    return (
      <div className="actors-module">
        <div className="flexcontainer-module-header">
          <div className="module-header">
            <h4>Actors</h4>
          </div>
          <div className="button-container flex-self-right">
            <button
              name={this.props.position}
              onClick={this.props.onRefreshActors.bind(this)}
              className="btn btn-default"
            >
              <span className="glyphicon glyphicon-refresh" />
            </button>
            <button
              name={this.props.position}
              onClick={this.props.onAddActor.bind(this)}
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
                    <img className="img-circle" src={actor.image} alt="Actor image." />
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

const mapStateToProps = (store, ownProps) => ({
  actors: store.editor.scenes[ownProps.position].actors,
  position: ownProps.position.toString()
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
  onAddActor (event) {
    event.preventDefault();
    const position = event.target.name;
    console.log(position);
    dispatch(addActor(position));
  },
  onDeleteActor(event) {
    event.preventDefault();
    const eventNameArray = event.target.name.split('-')
      , position = +eventNameArray[0]
      , actorIndex = eventNameArray[1];
    dispatch(deleteActor(position, actorIndex));
  },
  onRefreshActors(event) {
    event.preventDefault();
    dispatch(generateActors(+event.target.name));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);

