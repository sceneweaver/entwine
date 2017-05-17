import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorHero extends Component {
  render() {
    return (
      <div className="hero-module">
        <div className="flexcontainer-module-header hero-module-header">

          <div className="module-collapse-btn">
            <button
              onClick={this.props.onHideHero}
              className="btn hero-module-btn"
            >
              <i className="fa fa-minus" aria-hidden="true"></i>
            </button>
          </div>

          <h3 className="module-header">{this.props.sceneTitle ? this.props.sceneTitle : 'Scene ' + (+this.props.position + 1).toString() + " "} >> Hero Image</h3>

          <button
            className="btn hero-module-btn"
            onClick={this.props.onRemoveHero}
          >
            REMOVE HERO &nbsp; <span className="glyphicon glyphicon-trash" ></span>
          </button>

        </div>

        <div className="hero-box">
          <h4>
            Keyword: &nbsp;
            </h4>
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
                <div className="unsplash">
                  <h4>Photo by <a href={this.props.heroPhotogURL}>{this.props.heroPhotog}</a> / <a href="http://unsplash.com">Unsplash</a></h4>
                </div>
              </div>
              )
            : (
              <p>No hero set.</p>
            )
          }
        </div>

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { generateHero, setHeroQuery, deselectModule, setHero } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  sceneTitle: state.editor.scenes[ownProps.position].title,
  heroPhotog: state.editor.scenes[ownProps.position].heroPhotog,
  heroPhotogURL: state.editor.scenes[ownProps.position].heroPhotogURL,
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
  onRemoveHero(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(setHero(ownProps.position, {
      heroURL: '',
      heroPhotog: '',
      heroPhotogURL: ''
    }));
  },
  onHideHero(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).removeClass("toggled");
    $('.editorscene-sidebar-bg').removeClass('toggled');
    dispatch(deselectModule(ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHero);
