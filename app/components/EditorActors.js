import React, { Component } from 'react'

/* ----- COMPONENT ----- */

export default class EditorActors extends Component {
  render() {
    return (
      <div className="actors">
        {this.props.actors.length ? (
          this.props.actors.map(noun => {
            return (
              <div key={noun.title}>
                <div className="media-left media-middle icon-container">
                  <img className="media-object img-circle" src={noun.image} />
                </div>
                <form key={noun.title}>
                  <label>Title:</label>
                  <input
                    className="borderlessInput"
                    name={`${noun.title}-title`}
                    value={noun.title}
                    onChange={this.props.handleFormChange}
                  />
                  <label>Description:</label>
                  <input
                    className="borderlessInput"
                    name={`${noun.title}-description`}
                    value={noun.description}
                    onChange={this.props.handleFormChange}
                  />
                  <label>Link:</label>
                  <input
                    className="borderlessInput"
                    name={`${noun.title}-link`}
                    value={noun.link}
                    onChange={this.props.handleFormChange}
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



