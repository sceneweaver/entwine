import React, { Component } from 'react';

class EditorSceneButtons extends Component {
  render() {
    return (
      <div className="editor-row">

        <div className="editor-btns-left-align btn-group">

          <button
            className="editor-btn btn btn-default"
            onClick={this.props.onBold}
          >
            <i className="fa fa-bold" />
          </button>
          <button
            className="editor-btn btn btn-default"
            onClick={this.props.onItalic}
          >
            <i className="fa fa-italic" />
          </button>
          <button
            className="editor-btn btn btn-default"
            onClick={this.props.onBlockQuote}
          >
            <i className="fa fa-quote-right" />
          </button>
          <button
            className="editor-btn btn btn-default"
            onClick={this.props.onUnorderedList}
          >
            <i className="fa fa-list-ul" />
          </button>
          <button
            className="editor-btn btn btn-default"
            onClick={this.props.onOrderedList}
          >
            <i className="fa fa-list-ol" />
          </button>
          <button
            className="editor-btn btn btn-default"
            onClick={this.props.onAddImage}
          >
            <i className="fa fa-file-image-o" />
          </button>

        </div>

        <div className="editor-btns-right-align btn-group">

          <button
            className="btn btn-default module-btn"
            onClick={this.props.onToggleModule.bind(this, 'actors')}
          >
            Actors &nbsp; <i className="fa fa-user-circle" aria-hidden="true"></i>

          </button>

          <button
            className="btn btn-default module-btn"
            onClick={this.props.onToggleModule.bind(this, 'maps')}
          >
            Map &nbsp; <i className="fa fa-globe" aria-hidden="true"></i>

          </button>

          <button
            className="btn btn-default module-btn"
            onClick={this.props.onToggleModule.bind(this, 'hero')}
          >
            Hero &nbsp; <i className="fa fa-picture-o" aria-hidden="true"></i>

          </button>

          <button
            className="btn btn-default module-btn"
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
      $('.editorscene-sidebar-bg').removeClass('toggled');
			dispatch(deselectModule(ownProps.whichScene));
		} else {
			$(`#editorscene-wrapper-${ownProps.whichScene}`).addClass('toggled');
      $('.editorscene-sidebar-bg').addClass('toggled');
			dispatch(showModule(module));
		}
	},
  onRecommendation(position, event) {
		event.preventDefault();
		dispatch(generateRecommendations(position));
	}
});

export default connect(null, mapDispatchToProps)(EditorSceneButtons);
