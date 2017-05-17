import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorHeroGenerator extends Component {
  render() {
    return (
      <div className="hero-generator">

        <div className="hero-generator-input">

          <h4>
            Keyword: &nbsp;
          </h4>

          <input
            type="text"
            onChange={this.props.onHeroQueryChange}
            value={this.props.heroQuery}
          />

        </div>

        <button
          onClick={this.props.onGenerateHero}
          className="btn hero-module-btn"
        >
          Generate Hero &nbsp; <i className="fa fa-refresh" aria-hidden="true"></i>
        </button>

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { generateHero, setHeroQuery } from '../../reducers/editor';

const mapStateToProps = (state, ownProps) => ({
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorHeroGenerator);
