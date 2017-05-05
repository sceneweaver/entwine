import React, { Component } from 'react'
import { setNouns } from '../reducers/analyze'
import {browserHistory} from 'react-router'
/* ----- COMPONENT ----- */

class Actors extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(evt) {
    this.props.setStory(evt.target.title.value);
    this.props.parseNouns(evt.target.fullStory.values);
    browserHistory.push('/checkactors');
  }

  addNounsToDB() {
    const nounsArr = this.props.nouns;
  }

  render() {
    return (
      <div>
        {
          this.props.nouns.map(noun => {
            return (
              <div>
                <h4>{noun.title}</h4>
              </div>
            )
          })
        }
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux'

function mapStateToProps (store, ownProps) {
  return {
    nouns: store.analyze.nouns
  };
};

function mapDispatchToProps(dispatch) {
    return {
      putNouns: (input) => {
        dispatch(setNouns(input));
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Actors);


