import React, { Component } from 'react'

/* ----- COMPONENT ----- */

class Actors extends Component {
  render() {
    return (
      <div className="actors">
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
import { setNouns } from '../reducers/analyze'

function mapStateToProps(store, ownProps) {
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


