import React, { Component } from 'react';

const styles = {
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: '\'Georgia\', serif',
    marginRight: 10,
    padding: 3,
  },
}

class EditorSceneMediaInput extends Component {
  render() {
    return (
      <div
        className="editorscene-mediaurl-input"
        style={styles.urlInputContainer}
      >
        <label>
          Media URL: &nbsp;
					</label>
        <input
          onChange={this.props.onURLChange}
          ref="url"
          style={styles.urlInput}
          type="text"
          value={this.props.urlValue}
          onKeyDown={this.props.onURLInputKeyDown}
        />
        <button
          className="editor-btn btn btn-default"
          onMouseDown={this.props.confirmMedia}
        >
          Add Media
        </button>
      </div>
    );
  }

}

export default EditorSceneMediaInput;
