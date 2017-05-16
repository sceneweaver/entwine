import React, { Component } from 'react';

class EditorSceneButtons extends Component {
  componentWillReceiveProps(nextProps) {
    // if there are no locations, let the user add map
    if (nextProps.recommendations) {
      nextProps.recommendations.forEach(rec => {
        $(`#${rec}.module-btn`).addClass('highlighted-rec')
      })
    }
  }

  render() {
    return (
      <div className="editor-row">

        <div className="editor-btns-left-align btn-group">

          <button
            className="editor-btn draft-btns btn grey-text text-darken-3"
            onClick={this.props.onBold}
          >
            <i className="fa fa-bold" />
          </button>
          <button
            className="editor-btn draft-btns btn grey-text text-darken-3"
            onClick={this.props.onItalic}
          >
            <i className="fa fa-italic" />
          </button>
          <button
            className="editor-btn draft-btns btn grey-text text-darken-3"
            onClick={this.props.onBlockQuote}
          >
            <i className="fa fa-quote-right" />
          </button>
          <button
            className="editor-btn draft-btns btn grey-text text-darken-3"
            onClick={this.props.onUnorderedList}
          >
            <i className="fa fa-list-ul" />
          </button>
          <button
            className="editor-btn draft-btns btn grey-text text-darken-3"
            onClick={this.props.onOrderedList}
          >
            <i className="fa fa-list-ol" />
          </button>
          <button
            className="editor-btn draft-btns btn grey-text text-darken-3"
            onClick={this.props.onAddImage}
          >
            <i className="fa fa-file-image-o" />
          </button>

        </div>

        <div className="editor-btns-right-align btn-group">

          <button
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onToggleModule.bind(this, 'actors')}
            id="actors"
          >
            Actors &nbsp; <i className="fa fa-user-circle" aria-hidden="true"></i>

          </button>

          <button
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onToggleModule.bind(this, 'maps')}
            id="maps"
          >
            Map &nbsp; <i className="fa fa-globe" aria-hidden="true"></i>

          </button>

          <button
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onToggleModule.bind(this, 'hero')}
            id="hero"
          >
            Hero &nbsp; <i className="fa fa-picture-o" aria-hidden="true"></i>

          </button>

          <button
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onRecommendation.bind(this, this.props.whichScene)}
          >
            Recommend
          </button>


        </div>

      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import $ from 'jquery';
import { deselectModule, showModule, generateRecommendations } from '../../reducers/editor';

const mapDispatchToProps = (dispatch, ownProps) => ({
	onToggleModule(module, event) {
		event.preventDefault();
		if (ownProps.whichModule === module) {
			$(`#editorscene-wrapper-${ownProps.whichScene}`).removeClass('toggled');
			dispatch(deselectModule(ownProps.whichScene));
		} else {
			$(`#editorscene-wrapper-${ownProps.whichScene}`).addClass('toggled');
			dispatch(showModule(module));
		}
	},
  onRecommendation(position, event) {
		event.preventDefault();
		dispatch(generateRecommendations(position));
	}
});

export default connect(null, mapDispatchToProps)(EditorSceneButtons);
