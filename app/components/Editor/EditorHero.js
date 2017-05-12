import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorHero extends Component {
  render() {
    return (
      <div className="hero-module">
        <div className="flexcontainer-module-header">

          <div className="module-collapse-btn">
            <button
              onClick={this.props.onHideHero}
              className="btn hero-module-btn"
            >
              Collapse &nbsp; <span className="glyphicon glyphicon-menu-right"></span>
            </button>
          </div>

          <h3 className="module-header">{this.props.sceneTitle ? this.props.sceneTitle : 'Scene ' + (+this.props.position + 1).toString() + " "} >> Hero Image</h3>

          <div className="flex-self-right">
            <button
              onClick={this.props.onRefreshActors}
              className="btn hero-module-btn"
            >
              Generate Hero &nbsp; <span className="glyphicon glyphicon-refresh" />
            </button>
            <button
              onClick={this.props.onAddActor}
              className="btn hero-module-btn"
            >
              Add Hero URL &nbsp; <span className="fa fa-file-image-o" />
            </button>
          </div>

        </div>

        <div className="hero-box">
          {this.props.hero
            ? (<img src={this.props.hero} />)
            : (<p>Analyze text to generate a hero -- or upload one yourself.</p>)
          }
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addActor, generateActors, toggleActors } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  sceneTitle: state.editor.scenes[ownProps.position].title,
  hero: state.editor.scenes[ownProps.position].hero,
  position: ownProps.position
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRefreshActors(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(generateActors(ownProps.position));
  },
  onAddActor(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addActor(ownProps.position));
  },
  onHideActors(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).toggleClass("toggled");
    dispatch(toggleActors(ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHero);
