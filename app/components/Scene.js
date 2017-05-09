import React, { Component } from 'react'

/* ----- COMPONENT ----- */

class Scene extends Component {

  setInnerHTML(text){
    return {__html: text}
  }

  render() {
    return (
        <div className="row">
          <div className="col-md-1">

          </div>
          <div className="col-md-8 col-md-offset-1 article-text article-font">
            <div dangerouslySetInnerHTML={this.setInnerHTML(this.props.text)} />
          </div>
          <div className="col-md-2 pull-right actorsBlock">
            {this.props.actors ? <h3 className="actors-heading article-font">Actors</h3> : null}
            {this.props.actors ?
              this.props.actors.map(actor => (
                <div key={actor.id}>
                  {/* TODO: will want to do this as bootstrap cards */}
                  <div><img src={actor.image} /></div>
                  <h5 className="article-font">{actor.title}</h5>
                  <p>{actor.description}</p>
                </div>
              ))
              : null}
          </div>
        </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  text: store.displayState.currScene.paragraphs[0],
  actors: store.displayState.currScene.actors
});

export default connect(mapStateToProps)(Scene);
