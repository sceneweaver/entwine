import React, { Component } from 'react'

/* ----- COMPONENT ----- */

export default class Scene extends Component {
  render() {
    console.log(this.props)
    return (
      <div className="container">
        <div className="row">
          <h1>{this.props.title}</h1>
        </div>
        <div className="row">
          <div className="col-md-4 textBlock">
            {this.props.text}
          </div>
          <div className="col-md-8 actorsBlock">
            {this.props.actors ?
              this.props.actors.map(actor => (
                <div key={actor.id}>
                  {/* TODO: will want to do this as bootstrap cards */}
                  <div><img src={actor.image} /></div>
                  <h4>{actor.title}</h4>
                  <p>{actor.description}</p>
                </div>
              ))
              : null}
          </div>
        </div>
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

// import { connect } from 'react-redux';

// const mapStateToProps = store => ({
//   title: store.story.title
// })

// export default connect(mapStateToProps)(Story);
