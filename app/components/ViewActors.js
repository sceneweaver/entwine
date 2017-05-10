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
    console.log(this.state.name)
    return (
        <div className="actorsBlock">
          {
            this.props.actors ? (
              <h3 className="actors-heading article-font">Actors</h3>
            ) : (
              null
            )
          }
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
                  onMouseLeave={() => this.setState({on: false})}
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
                        style={{ backgroundColor: 'rgb(14, 186, 100)' }}
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
    );
  }
};

// console.log('hello')
// return (
//   <div>
//     <h5 className="article-font">{actor.name}</h5>
//     <p>{actor.description}</p>
//   </div>
// )

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  actors: store.displayState.currScene.actors
});

export default connect(mapStateToProps)(ViewActors);
