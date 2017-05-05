import React, { Component } from 'react'
import { fetchNouns, setNouns } from '../reducers/analyze'
import {addStory} from '../reducers/setText'
import {browserHistory} from 'react-router'
/* ----- COMPONENT ----- */

class Editor extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(evt) {
    // vvv ******** these need to be chained?
    // parse text for actors
    // add actors to store
    // create story in db
    // create scene in db

    // vvv ********** does this happen here or the next page?
    // create and/or associate actors to scenes in the db

    this.props.parseNouns(evt.target.fullStory.values);
    this.props.setStory(evt.target.title.value);
    browserHistory.push('/checkactors');
  }

  render() {
    return (
      <div className="storyInput">
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Enter Story Title Here" name="storyTitle"/>
            <textarea rows="100" cols="78" type="text" className="form-control" placeholder="Enter story here" name="fullStory" />
          </div>
          <button className="btn btn-default">Submit and Generate Actors</button>
        </form>
      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux'

const mapStateToProps = (store, ownProps) => {
  return {
    nouns: this.store.analyze.nouns
  };
};

function mapDispatchToProps(dispatch) {
    return {
      parseNouns: (input) => {
        dispatch(fetchNouns(input));
      },
      setStory: (input) => {
        dispatch(addStory(input));
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
