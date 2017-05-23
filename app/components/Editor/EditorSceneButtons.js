import React, { Component } from 'react';

class EditorSceneButtons extends Component {
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
            id="actors"
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onToggleModule.bind(this, 'actors')}
          >
            Characters &nbsp; <i className="fa fa-user-circle" aria-hidden="true" />

          </button>

          <button
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onToggleModule.bind(this, 'maps')}
            id="maps"
          >
            Map &nbsp; <i className="fa fa-globe" aria-hidden="true" />

          </button>

          <button
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onToggleModule.bind(this, 'hero')}
            id="header-btn"
          >
            Header Image &nbsp; <i className="fa fa-picture-o" aria-hidden="true" />

          </button>

          <button
            id="recommend-btn"
            className="btn module-btn grey-text text-darken-3"
            onClick={this.props.onRecommendation.bind(this, this.props.whichScene)}
          >
            Recommend &nbsp; <i className="fa fa-lightbulb-o" aria-hidden="true" />
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
import ReactTimeout from 'react-timeout';

const mapDispatchToProps = (dispatch, ownProps) => ({
	onToggleModule(module, event) {
		event.preventDefault();
		if (ownProps.whichModule === module) {
			$(`#editorscene-wrapper-${ownProps.whichScene}`).removeClass('toggled');
      $('.editorscene-sidebar-bg').removeClass('toggled');
			dispatch(deselectModule(ownProps.whichScene));
		} else {
			$(`#editorscene-wrapper-${ownProps.whichScene}`).addClass('toggled');
      $('.editorscene-sidebar-bg').addClass('toggled');
			this.props.setTimeout(() => dispatch(showModule(module)), 501);
		}
	},
  onRecommendation(position, event) {
		event.preventDefault();
		dispatch(generateRecommendations(position));
	}
});

export default connect(null, mapDispatchToProps)(ReactTimeout(EditorSceneButtons));
