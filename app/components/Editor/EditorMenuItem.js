import React, { Component } from 'react';

/* ----- COMPONENT ----- */

class EditorMenuItem extends Component {
  render() {
    return (
      <div
        className="editor-scene-menu-item"
        id={`editor-scene-menu-item-${this.props.position}`}
        onClick={this.props.onSwitchScene}
      >
        <h4>Scene {this.props.position + 1}</h4>
      </div>
    );
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
    $('.editor-scene-menu-item').removeClass('active');
    $(`#editor-scene-menu-item-${ownProps.position}`).addClass('active');
    $('.editorscene-wrapper').removeClass('toggled');
    dispatch(deselectModule(ownProps.position));
    dispatch(setEditorScene(ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorMenuItem);

