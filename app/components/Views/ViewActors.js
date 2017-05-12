import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class ViewActors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      on: false,
      name: '',
      description: ''
    };
  }
  render() {
    return (
      <div>
        <div className="view-actors-heads-box">
          {
            this.props.actors ? (

              this.props.actors.map(actor => (
                <div
                  className="view-actors-head"
                  key={actor.name}
                  onMouseEnter={() => this.setState({
                    on: true,
                    name: actor.name,
                    description: actor.description
                  })}
                  onMouseLeave={() => this.setState({
                    on: false,
                    name: '',
                    description: ''
                  })}
                >
                  {
                    actor.image ? (
                      <div
                        className="view-image-icons"
                        style={{ backgroundImage: `url(${actor.image})`, height: this.state.name === actor.name ? 100 : 75, width: this.state.name === actor.name ? 100 : 75 }}
                      />
                    ) : (
                      <div
                        className="view-image-icons"
                        style={{ backgroundColor: '#0090FF', height: this.state.name === actor.name ? 100 : 75, width: this.state.name === actor.name ? 100 : 75 }}
                      >
                        {actor.name[0]}
                      </div>
                    )
                  }
                </div>
              ))
            ) : (
                null
              )
          }
        </div>
        <div className="view-actors-info-box">
          {
            this.state.on ? (
              <div>
                <h3 className="view-story-heading">{this.state.name}</h3>
                <p className="view-actors-desc">{this.state.description}</p>
              </div>
            ) : (
                null
              )
          }
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  actors: store.displayState.currScene.actors
});

export default connect(mapStateToProps)(ViewActors);
