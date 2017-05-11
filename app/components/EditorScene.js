import React, { Component } from 'react';

import {
  Editor,
  EditorState,
  RichUtils
} from 'draft-js';

import { stateToHTML } from 'draft-js-export-html';
import EditorActors from './EditorActors';
import EditorMaps from './EditorMaps';

class EditorScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      displayModule: false
    };
    this.onChange = (editorState) => {
      // converts text to plaintext to allow actors / wiki module to parse correctly
      let content = editorState.getCurrentContent();
      let contentPlainText = content.getPlainText();
      let contentHTML = stateToHTML(content);
      this.props.onSceneTextChange(this.props.position, contentPlainText);
      this.props.onSceneHTMLChange(this.props.position, contentHTML);
      // updates Draft JS editor state
      this.setState({ editorState });
    };
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.focus = () => this.refs.editor.focus();
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
      <div className="editorscene-wrapper" id={`editorscene-wrapper-${this.props.position}`}>

        {/* ----- PAGE CONTENT ----- */}

        <div className="editorscene-content-wrapper">

          <div className="editorscene-buttons btn-group-vertical">
            <button
              className="btn btn-default editorscene-delete-btn"
              onClick={this.props.onDeleteScene}
            >
               <span className="glyphicon glyphicon-trash" ></span>
            </button>

            <button
              className="btn btn-default module-btn"
              onClick={this.props.onShowActors}
            >
              Actors &nbsp; <span className="glyphicon glyphicon-user"></span>
            </button>

            <button
              className="btn btn-default module-btn"
              name={this.props.position}
              onClick={this.props.onGenerateMaps}
            >
              Map &nbsp; <span className="glyphicon glyphicon-globe"></span>
            </button>

          </div>

          <div className="form-group editorscene-texteditor">

            <div className="editor-row">

              <input
                className="editor-scene-title"
                placeholder="Scene Title"
                name={this.props.position}
                onChange={this.props.onSceneTitleChange}
                value={this.props.title}
              />

              <div className="editor-right-align btn-group">
                <button className="editor-btn btn btn-default" onClick={this.onBoldClick.bind(this)}><i className="fa fa-bold"></i></button>
                <button className="editor-btn btn btn-default" onClick={this.onItalicClick.bind(this)}><i className="fa fa-italic"></i></button>
                <button className="editor-btn btn btn-default" onClick={this.onBlockQuoteClick.bind(this)}><i className="fa fa-quote-right"></i></button>
                <button className="editor-btn btn btn-default" onClick={this.onUnorderedListClick.bind(this)}><i className="fa fa-list-ul"></i></button>
                <button className="editor-btn btn btn-default" onClick={this.onOrderedListClick.bind(this)}><i className="fa fa-list-ol"></i></button>
              </div>
            </div>

            <div className="editor-container" onClick={this.focus}>
              <Editor
                editorState={this.state.editorState}
                handleKeyCommand={this.handleKeyCommand}
                onChange={this.onChange}
                position={this.props.position}
                ref="editor"
              />
            </div>
          </div>

        </div>

        {/* ----- SIDEBAR ----- */}

        <div className="editorscene-sidebar-wrapper">
          {
            this.props.whichModule === 'maps'
              ? <EditorMaps position={this.props.position} />
              : this.props.whichModule === 'actors'
                ? <EditorActors position={this.props.position} />
                : null
          }
        </div>


      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import $ from 'jquery';
import { connect } from 'react-redux';
import { toggleActors, setSceneText, setSceneHTML, setSceneTitle, deleteScene, generateMapLocations } from '../reducers/editor';

const mapStateToProps = (store, ownProps) => ({
  editor: store.editor,
  position: ownProps.position,
  title: store.editor.scenes[ownProps.position].title,
  text: store.editor.scenes[ownProps.position].paragraphs[0],
  displayActors: store.editor.scenes[ownProps.position].displayActors,
  whichModule: store.editor.scenes[ownProps.position].whichModule
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onShowActors(event) {
    event.preventDefault();
    $(`#editorscene-wrapper-${ownProps.position}`).toggleClass("toggled");
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
    let allowDelete = confirm(`Are you sure you want to delete scene ${+ownProps.position + 1}?`);
    if (allowDelete) {
      dispatch(deleteScene(+ownProps.position));
    }

  },
  onGenerateMaps(event) {
    event.preventDefault();
    dispatch(generateMapLocations(+ownProps.position));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
