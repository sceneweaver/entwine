import React, { Component } from 'react';

import {
  Editor,
  EditorState,
  RichUtils
} from 'draft-js';

import {stateToHTML} from 'draft-js-export-html';
import EditorActors from './EditorActors';

class EditorScene extends Component {
   constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => {
      // converts text to plaintext to allow actors / wiki module to parse correctly
      let content = editorState.getCurrentContent();
      let contentPlainText = content.getPlainText();
      let contentHTML = stateToHTML(content);
      this.props.onSceneTextChange(this.props.position, contentPlainText);
      this.props.onSceneHTMLChange(this.props.position, contentHTML);
      // updates Draft JS editor state
      this.setState({editorState});
    }
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
  }

  handleKeyCommand(command) {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
    if (newState) {
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  onBoldClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  onItalicClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }

  onBlockQuoteClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'blockquote'));
  }

  onUnorderedListClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
  }

  onOrderedListClick() {
    this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-1">
          <button
            className="btn btn-default"
            onClick={this.props.onDeleteScene}
          >
             <i className="fa fa-trash"></i> &nbsp; Delete
          </button>

        </div>
        <div className="form-group col-md-5">
          <div className="editor-row">
            <input
              className="editor-scene-title"
              placeholder="Scene Title"
              name={this.props.position}
              onChange={this.props.onSceneTitleChange}
              value={this.props.title}
            />

            <div className="editor-right-align">
              <button className="editor-btn" onClick={this.onBoldClick.bind(this)}><i className="fa fa-bold"></i></button>
              <button className="editor-btn" onClick={this.onItalicClick.bind(this)}><i className="fa fa-italic"></i></button>
              <button className="editor-btn" onClick={this.onBlockQuoteClick.bind(this)}><i className="fa fa-quote-right"></i></button>
              <button className="editor-btn" onClick={this.onUnorderedListClick.bind(this)}><i className="fa fa-list-ul"></i></button>
              <button className="editor-btn" onClick={this.onOrderedListClick.bind(this)}><i className="fa fa-list-ol"></i></button>
            </div>
          </div>

          <div className="editor-container">
            <Editor
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              position={this.props.position}
            />
          </div>
        </div>
        <div className="col-md-1">
          <div className="generate-actors flexcontainer-vertical editor-actors">
            <div className="row">
              <button
                className="btn btn-default"
                onClick={this.props.onShowActors}
              >
                Show Actors
            </button>
            </div>
            <div className="row">
              <button
                className="btn btn-default"
                name={this.props.position}
                onClick={this.props.onGenerateMaps}
              >
                Generate Map
            </button>
            </div>
          </div>
        </div>
        <div className="col-md-5">
          {this.props.displayActors ?
            <EditorActors
              position={this.props.position}
            /> :
            null}
        </div>
      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { toggleActors, setSceneText, setSceneHTML, setSceneTitle, deleteScene } from '../reducers/editor';

const mapStateToProps = (store, ownProps) => ({
  editor: store.editor,
  position: ownProps.position,
  title: store.editor.scenes[ownProps.position].title,
  text: store.editor.scenes[ownProps.position].paragraphs[0],
  displayActors: store.editor.scenes[ownProps.position].displayActors
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onShowActors(event) {
    event.preventDefault();
    dispatch(toggleActors(ownProps.position, true));
  },
  onSceneTitleChange(event) {
    event.preventDefault();
    dispatch(setSceneTitle(ownProps.position, event.target.value));
  },
  onSceneTextChange(position, content) {
    event.preventDefault();
    dispatch(setSceneText(position, content));
  },
  onSceneHTMLChange(position, content) {
    event.preventDefault();
    dispatch(setSceneHTML(position, content));
  },
  onDeleteScene(event) {
    event.preventDefault();
    dispatch(deleteScene(ownProps.position));
  },
  onGenerateMaps(event) {
    event.preventDefault();
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
