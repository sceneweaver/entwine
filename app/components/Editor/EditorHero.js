import React, { Component } from 'react';

import EditorHeroAdder from './EditorHeroAdder';
import EditorHeroGenerator from './EditorHeroGenerator';

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
              Close
            </button>
          </div>

          <h3 className="module-header">{this.props.sceneTitle ? this.props.sceneTitle : 'Scene ' + (+this.props.position + 1).toString() + ' '} >> Header Image</h3>

          <button
            className="btn hero-module-btn"
            onClick={this.props.onRemoveHero}
          >
            REMOVE HEADER &nbsp; <span className="glyphicon glyphicon-trash"  />
          </button>

        </div>

        <div className="hero-box">
          <EditorHeroGenerator
            position={this.props.position}
          />
          <EditorHeroAdder
            position={this.props.position}
          />
        </div>

        <div className="hero-viewer">

          {
            this.props.heroUnsplash
              ? (
                <div className="hero-image-container">
                  <img src={this.props.heroURL} />
                  <div className="hero-credit">
                    <h4>Photo by <a href={this.props.heroPhotogURL}>{this.props.heroPhotog}</a> / <a href="http://unsplash.com">Unsplash</a></h4>
                  </div>
                </div>
              )
              : this.props.heroURL && this.props.heroURL !== 'Not found'
                ? (
                  <div className="hero-image-container">
                    <img src={this.props.heroURL} />
                    <div className="hero-credit">
                      <h5>Photo by <a href={this.props.heroPhotogURL}>{this.props.heroPhotog}</a></h5>
                    </div>
                  </div>
                )
                : this.props.heroURL === 'Not found'
                  ? (
                    <div className="hero-image-container">
                      <h3>No image found.</h3>
                      <p>Try another keyword!</p>
                    </div>
                  )
                  : (
                    <div className="hero-image-container">
                      <h3>Each scene can have either an interactive map or a header photo.</h3>
                      <p>Use the generator above to grab a header-worthy image, or add your own. <br /> Make sure to credit your photographer!</p>
                    </div>
                  )
          }

        </div>

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { deselectModule, setHero } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
  sceneTitle: state.editor.scenes[ownProps.position].title,
  heroPhotog: state.editor.scenes[ownProps.position].heroPhotog,
  heroPhotogURL: state.editor.scenes[ownProps.position].heroPhotogURL,
  heroURL: state.editor.scenes[ownProps.position].heroURL,
  heroQuery: state.editor.scenes[ownProps.position].heroQuery,
  heroUnsplash: state.editor.scenes[ownProps.position].heroUnsplash,
  position: ownProps.position
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onRemoveHero(event) {
    event.preventDefault();
    event.stopPropagation();
    dispatch(setHero(ownProps.position, {
      heroURL: '',
      heroPhotog: '',
      heroPhotogURL: '',
      heroUnsplash: false
    }));
  },
  onHideHero(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).removeClass('toggled');
    $('.editorscene-sidebar-bg').removeClass('toggled');
    dispatch(deselectModule(ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHero);
