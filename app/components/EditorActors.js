import React, { Component } from 'react'

/* ----- COMPONENT ----- */

class EditorActors extends Component {
  render() {
    return (
      <div className="actors">
        {this.props.actors.length ? (
          this.props.actors.map(actor => {
            return (
              <div key={actor.title}>
                <div className="media-left media-middle icon-container">
                  <img className="media-object img-circle" src={actor.image} />
                </div>
                <form key={actor.title}>
                  <label>Title:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${actor.title}-title`}
                    value={actor.title}
                    onChange={this.props.handleActorsChange}
                  />
                  <label>Description:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${actor.title}-description`}
                    value={actor.description}
                    onChange={this.props.handleActorsChange}
                  />
                  <label>Link:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${actor.title}-link`}
                    value={actor.link}
                    onChange={this.props.handleActorsChange}
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
import { handleActorsChange } from '../reducers/editor'

const mapStateToProps = (store, ownProps) => ({
  actors: store.editor.scenes[ownProps.position].actors,
  position: ownProps.position
});

const mapDispatchToProps = dispatch => ({
  handleActorsChange(event) {
    const eventNameArray = event.target.name.split('-')
      , scene = eventNameArray[0] - 1
      , changedActorTitle = eventNameArray[1]
      , type = eventNameArray[2]
      , input = event.target.value;
    dispatch(handleActorsChange(scene, changedActorTitle, type, input));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);

