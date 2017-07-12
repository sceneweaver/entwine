import React, { Component } from 'react';

const style = {
  heroAdderInput: {
    color: 'white',
    fontSize: '1.5rem',
    borderBottom: '0.5px solid white'
  }
};

class EditorHeroAdder extends Component {
  constructor() {
    super();
    this.state = {
      heroURL: '',
      heroPhotog: '',
      heroPhotogURL: ''
    };
    this.onUserHeroChange = this.onUserHeroChange.bind(this);
  }
  onUserHeroChange (event) {
    event.preventDefault();
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
            placeholder="Insert custom image URL"
            value={this.state.heroURL}
            onChange={this.onUserHeroChange}
          />
        </div>

        <div className="hero-adder-row">
          <h4>Name:</h4>
          <input
            style={style.heroAdderInput}
            type="text"
            name="heroPhotog"
            placeholder="Insert photographer name"
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
            placeholder="Insert photographer URL"
            value={this.state.heroPhotogURL}
            onChange={this.onUserHeroChange}
          />
        </div>

        <button
          className="btn hero-module-btn"
          onClick={this.props.onSaveHero.bind(this, this.state)}
        >
          Save Image &nbsp; <i className="fa fa-floppy-o" aria-hidden="true" />
        </button>

      </div>
    );
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
    dispatch(setHero(ownProps.position, currState, heroUnsplash));
  }
});

export default connect(null, mapDispatchToProps)(EditorHeroAdder);
