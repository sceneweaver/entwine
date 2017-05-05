import React, { Component } from 'react'

/* ----- COMPONENT ----- */

export default class EditorActors extends Component {
  constructor (props) {
    super(props);
    this.state = {
      actors: []
    }
    this.handleFormChange = this.handleFormChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      actors: nextProps.actors
    })
  }
  handleFormChange (event) {
    const eventNameArray = event.target.name.split('-')
        , noun = eventNameArray[0]
        , type = eventNameArray[1]
        , actors = this.state.actors;
    let index
      , actor;
    actors.forEach((a, i) => {
      if (a.title === noun) {
        index = i;
        actor = a;
      }
    })
    actor[type] = event.target.value;
    const newActors = actors.slice(0, index).concat(actor).concat(actors.slice(index + 1));
    this.setState({actors: newActors});
  }
  render() {
    console.log("this.state.actors in EditorActors", this.state.actors)
    return (
      <div className="actors">
        { this.state.actors.length ? (
          this.state.actors.map(noun => {
            return (
              <div key={noun.title}>
                <div className="media-left media-middle icon-container">
                  <img className="media-object img-circle product-list-photo" src={noun.image} />
                </div>
                <form key={noun.title}>
                  <label>Title:</label><input name={`${noun.title}-title`} value={noun.title} onChange={this.handleFormChange} />
                  <label>Description:</label><input name={`${noun.title}-description`} value={noun.description} onChange={this.handleFormChange} />
                  <label>Link:</label><input name={`${noun.title}-link`} value={noun.link} onChange={this.handleFormChange} />
                </form>
              </div>
            )
          })) : (<p>No actors yet</p>)
      }
      </div>
    )
  }
}



