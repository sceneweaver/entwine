import React, { Component } from 'react';

const style = {
  heroAdderInput: {
    color: 'white',
    fontSize: '1.5rem',
  }
}

class EditorHeroAdder extends Component {
  constructor() {
    super();
    this.state = {
      heroURL: 'Insert header image URL',
      heroPhotog: 'Insert photog\'s name',
      heroPhotogURL: 'Insert her portfolio URL'
    };
    this.onUserHeroChange = this.onUserHeroChange.bind(this);
  }
  onUserHeroChange (event) {
    event.preventDefault();
    console.log("event.target.name", event.target.name);
    console.log("event.target.value", event.target.value);
     this.setState({
      [event.target.name]: event.target.value
    });
  }
  render() {
    return (
      <div className="hero-adder">

        <div className="hero-adder-row">
          <h4>URL:</h4>
          <input
            style={style.heroAdderInput}
            type="text"
            name="heroURL"
            value={this.state.heroURL}
            onChange={this.onUserHeroChange}
          />
        </div>

        <div className="hero-adder-row">
          <h4>Photographer:</h4>
          <input
            style={style.heroAdderInput}
            type="text"
            name="heroPhotog"
            value={this.state.heroPhotog}
            onChange={this.onUserHeroChange}
          />
        </div>

        <div className="hero-adder-row">
          <h4>Credit:</h4>
          <input
            style={style.heroAdderInput}
            type="text"
            name="heroPhotogURL"
            value={this.state.heroPhotogURL}
            onChange={this.onUserHeroChange}
          />
        </div>

        <button
          className="btn hero-module-btn"
          onClick={this.props.onSaveHero.bind(this, this.state)}
        >
          Save Image &nbsp; <i className="fa fa-floppy-o" aria-hidden="true"></i>
        </button>

      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { setHero } from '../../reducers/editor';

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSaveHero(currState, event) {
    event.preventDefault();
    event.stopPropagation();
    const heroUnsplash = false;
    console.log("currState", currState);
    dispatch(setHero(ownProps.position, currState, heroUnsplash));
  }
});

export default connect(null, mapDispatchToProps)(EditorHeroAdder);
