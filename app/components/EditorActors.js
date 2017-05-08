import React, { Component } from 'react'

/* ----- COMPONENT ----- */

class EditorActors extends Component {
  render() {
    return (
      <div className="actors">
        {this.props.actors.length ? (
          this.props.actors.map((actor, index) => {
            return (
              <div key={actor.title}>
                <div className="media-left media-middle icon-container">
                  <img className="media-object img-circle" src={actor.image} />
                </div>
                <form key={index}>
                  <label>Title:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${index}-title`}
                    defaultValue={actor.title}
                    onChange={this.props.onActorsChange}
                  />
                  <label>Description:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${index}-description`}
                    defaultValue={actor.description}
                    onChange={this.props.onActorsChange}
                  />
                  <label>Link:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${index}-link`}
                    defaultValue={actor.link}
                    onChange={this.props.onActorsChange}
                  />
                </form>
              </div>
            )
          })) : (<p>No actors yet</p>)
        }
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { changeActor } from '../reducers/editor'

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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);

