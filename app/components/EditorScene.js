import React, { Component } from 'react';
import {
  CompositeDecorator,
  ContentBlock,
  ContentState,
  Editor,
  EditorState,
  convertFromRaw,
  convertToRaw,
  RichUtils
} from 'draft-js';

import {stateToHTML} from 'draft-js-export-html';

import EditorActors from './EditorActors';

class EditorScene extends Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.handleKeyCommand = this.handleKeyCommand.bind(this);
    this.toggleBlockType = (type) => this._toggleBlockType(type);
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

  onUnderlineClick() {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
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

  onSaveClick() {
    const content = this.state.editorState.getCurrentContent();
    console.log('coverted from raw...', stateToHTML(content))
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-1">
          <button
            className="btn btn-default"
            name={this.props.position}
            onClick={this.props.onDeleteScene}
          >
            <i className="fa fa-trash"></i> &nbsp; Delete
          </button>

          <button className="editor-btn" onClick={this.onBoldClick.bind(this)}><i className="fa fa-bold"></i></button>
          <button className="editor-btn" onClick={this.onItalicClick.bind(this)}><i className="fa fa-italic"></i></button>
          <button className="editor-btn" onClick={this.onUnderlineClick.bind(this)}><i className="fa fa-underline"></i></button>
          <button className="editor-btn" onClick={this.onBlockQuoteClick.bind(this)}><i className="fa fa-quote-right"></i></button>
          <button className="editor-btn" onClick={this.onUnorderedListClick.bind(this)}><i className="fa fa-list-ul"></i></button>
          <button className="editor-btn" onClick={this.onOrderedListClick.bind(this)}><i className="fa fa-list-ol"></i></button>
          <button className="editor-btn-save" onClick={this.onSaveClick.bind(this)}>Save this Shieeeet</button>
        </div>
        <div className="form-group col-md-5">
          <input
            placeholder="Scene Title"
            name={this.props.position}
            onChange={this.props.onSceneTitleChange}
            defaultValue={this.props.title}
          />
          <div className="editor-container">
            <Editor
              // placeholder="Text goes here"
              editorState={this.state.editorState}
              handleKeyCommand={this.handleKeyCommand}
              onChange={this.onChange}
              onTab={this.onTab}
            />
          </div>

          <textarea
            rows="10"
            cols="78"
            type="text"
            className="form-control"
            placeholder="Scene Text"
            name={this.props.position}
            defaultValue={this.props.text}
            onChange={this.props.onSceneTextChange}
          />
        </div>
        <div className="col-md-1">
          <div className="generate-actors flex-container editor-actors">
            <button
              className="btn btn-default"
              name={this.props.position}
              onClick={this.props.onGenerateActors}
            >
              Generate Actors
            </button>
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
    )
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { toggleActors, generateActors, setSceneText, setSceneTitle, deleteScene } from '../reducers/editor'

const mapStateToProps = (store, ownProps) => ({
  position: ownProps.position,
  title: store.editor.scenes[ownProps.position - 1].title,
  text: store.editor.scenes[ownProps.position - 1].paragraphs[0],
  displayActors: store.editor.scenes[ownProps.position - 1].displayActors
});

const mapDispatchToProps = dispatch => ({
  onGenerateActors(event) {
    event.preventDefault();
    dispatch(toggleActors(+event.target.name, true))
    dispatch(generateActors(+event.target.name));
  },
  onSceneTitleChange(event) {
    event.preventDefault();
    dispatch(setSceneTitle(+event.target.name, event.target.value))
  },
  onSceneTextChange(event) {
    event.preventDefault();
    dispatch(setSceneText(+event.target.name, event.target.value))
  },
  onDeleteScene(event) {
    event.preventDefault();
    dispatch(deleteScene(+event.target.name))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
