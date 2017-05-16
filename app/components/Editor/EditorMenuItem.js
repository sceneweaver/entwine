import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorMenuItem extends Component {
  render() {
    return (
      <div className="editor-scene-menu-item">
        <button
          className="btn btn-default"
          onClick={this.props.onSwitchScene}
        >
          <h4>Scene {this.props.position + 1}</h4>
        </button>

      </div>
    )
  }
}

/* ----- CONTAINER ----- */

import $ from 'jquery';
import { connect } from 'react-redux';
import { setEditorScene, deselectModule } from '../../reducers/editor';

const mapStateToProps = (store, ownProps) => ({
	position: ownProps.position,
  sceneTitle: ownProps.sceneTitle,
  whichModule: ownProps.whichModule
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onSwitchScene(event) {
    event.preventDefault();
    $('.editorscene-wrapper').removeClass('toggled');
    dispatch(deselectModule(ownProps.position));
    dispatch(setEditorScene(ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMenuItem);

