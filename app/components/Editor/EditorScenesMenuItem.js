import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorScenesMenuItem extends Component {
  render() {
    return (
      <div className="editor-scene-menu-item">

        <button
          className="btn btn-default editorscene-delete-btn"
          onClick={this.props.onDeleteScene}
        >
          <span className="glyphicon glyphicon-trash" ></span>
        </button>

        <div>
          <h4>Scene {this.props.position + 1}</h4>
          <h2>{this.props.sceneTitle}</h2>
        </div>

      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import $ from 'jquery';
import { connect } from 'react-redux';
import {  deleteScene  } from '../../reducers/editor';

const mapStateToProps = (store, ownProps) => ({
	position: ownProps.position,
  sceneTitle: ownProps.sceneTitle
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onDeleteScene(event) {
		event.preventDefault();
		let allowDelete = confirm(`Are you sure you want to delete scene ${+ownProps.position + 1}?`);
		if (allowDelete) {
			dispatch(deleteScene(+ownProps.position));
		}
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScenesMenuItem);

