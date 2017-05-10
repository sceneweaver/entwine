import React, { Component } from 'react';
import ViewActors from './ViewActors';

/* ----- COMPONENT ----- */

class Scene extends Component {

  setInnerHTML(html){
    return {__html: html}
  }

  render() {
    return (
        <div className="row">
          <div className="col-md-1">
          </div>
          <div className="col-md-8 col-md-offset-1 article-text article-font">
            <div dangerouslySetInnerHTML={this.setInnerHTML(this.props.html)} />
          </div>
          <div className="col-md-2 pull-right">
            <ViewActors />
          </div>
        </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';

const mapStateToProps = store => ({
  html: store.displayState.currScene.paragraphsHTML[0],
  actors: store.displayState.currScene.actors
});

export default connect(mapStateToProps)(Scene);
