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
                    defaultValue={actor.title}
                    onChange={this.props.onActorsChange}
                  />
                  <label>Description:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${actor.title}-description`}
                    defaultValue={actor.description}
                    onChange={this.props.onActorsChange}
                  />
                  <label>Link:</label>
                  <input
                    className="borderlessInput"
                    name={`${this.props.position}-${actor.title}-link`}
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
import { handleActorChange } from '../reducers/editor'

const mapStateToProps = (store, ownProps) => ({
  actors: store.editor.scenes[ownProps.position - 1].actors,
  position: ownProps.position
});

const mapDispatchToProps = dispatch => ({
  onActorsChange(event) {
    event.preventDefault();
    const eventNameArray = event.target.name.split('-')
      , position = eventNameArray[0]
      , changedActorTitle = eventNameArray[1]
      , type = eventNameArray[2]
      , input = event.target.value;
    console.log(input);
    dispatch(handleActorChange(position, changedActorTitle, type, input));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorActors);

