import React, { Component } from 'react'

/* ----- COMPONENT ----- */

export default class Scene extends Component {
  render() {
    console.log(this.props.dummyScene.actors)
    return (
      <div className="container">
        <div className="row">
          <h1>{this.props.dummyScene.title}</h1>
          <h2>{this.props.dummyScene.subhead}</h2>
        </div>
        <div className="row">
          <div className="col-md-4 textBlock">
            {this.props.dummyScene.text}
          </div>
          <div className="col-md-8 actorsBlock">
            {this.props.dummyScene.actors ?
              this.props.dummyScene.actors.map(actor => (
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

// import { connect } from 'react-redux'

// const mapStateToProps = (store, ownProps) => {
//   return {
//     title: store.scene.title,
//     subhead: store.scene.subhead,
//     text: store.scene.text,
//     actors: store.scene.actors
//   }
// }

// export default connect(mapStateToProps)(Scene)
