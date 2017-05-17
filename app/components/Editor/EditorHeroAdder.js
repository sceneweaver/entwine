import React, { Component } from 'react';

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

        <div className="user-hero-row">
          <h4>URL: &nbsp;</h4>
          <input
            type="text"
            name="heroURL"
            placeholder="Insert image URL here"
            onChange={this.props.onUserHeroChange}
          />
        </div>

        <div className="user-hero-row">
          <h4>Photographer: &nbsp;</h4>
          <input
            type="text"
            name="heroPhotog"
            placeholder="Insert photographer's name here"
            onChange={this.props.onUserHeroChange}
          />
        </div>

        <div className="user-hero-row">
          <h4>Credit: &nbsp;</h4>
          <input
            type="text"
            name="heroPhotogURL"
            placeholder="Link to photographer's website here"
            onChange={this.props.onUserHeroChange}
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
  onSaveHero(event, currState) {
    event.preventDefault();
    event.stopPropagation();
    const heroUnsplash = false;
    console.log("currState", currState);
    dispatch(setHero(ownProps.position, currState, heroUnsplash));
  }
});

export default connect(null, mapDispatchToProps)(EditorHeroAdder);
