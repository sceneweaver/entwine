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

        </div>

        <div className="hero-box">
          <label>
            Keyword: &nbsp;
            </label>
          <input
            type="text"
            onChange={this.props.onHeroQueryChange}
            value={this.props.heroQuery}
          />
          <button
            onClick={this.props.onGenerateHero}
            className="btn hero-module-btn"
          >
            Generate Hero &nbsp; <span className="glyphicon glyphicon-refresh" />
          </button>
        </div>

        <div className="hero-viewer">
          {this.props.heroURL
            ? (
              <div className="hero-image-container">
                <img src={this.props.heroURL} />
                <div className="hero-credit">
                  <h4>Photo by <a href={this.props.heroCredit.photogURL}>{this.props.heroCredit.photog}</a> / <a href="http://unsplash.com">Unsplash</a></h4>
                </div>
              </div>
              )
            : (<p>Analyze text to generate a hero -- or upload one yourself.</p>)
          }
        </div>

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addActor, generateHero, setHeroQuery, toggleHero } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  sceneTitle: state.editor.scenes[ownProps.position].title,
  heroCredit: state.editor.scenes[ownProps.position].heroCredit,
  heroURL: state.editor.scenes[ownProps.position].heroURL,
  heroQuery: state.editor.scenes[ownProps.position].heroQuery,
  position: ownProps.position
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onHeroQueryChange(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(setHeroQuery(ownProps.position, event.target.value));
  },
  onGenerateHero(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(generateHero(ownProps.position));
  },
  onAddActor(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(addActor(ownProps.position));
  },
  onHideActors(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).toggleClass("toggled");
    dispatch(toggleHero(ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHero);
