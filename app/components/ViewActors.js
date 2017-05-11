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
                  key={actor.name}
                  onMouseEnter={() => this.setState({
                    on: true,
                    name: actor.name,
                    description: actor.description
                  })}
                  onMouseLeave={() => this.setState({ on: false })}
                >
                  {
                    actor.image ? (
                      <div
                        className="img-circle"
                        style={{ backgroundImage: `url(${actor.image})` }}
                      />
                    ) : (
                        <div
                          className="img-circle-letter"
                          style={{ backgroundColor: '#0090FF' }}
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
                <h3 className="article-font">{this.state.name}</h3>
                <p className="article-font">{this.state.description}</p>
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
