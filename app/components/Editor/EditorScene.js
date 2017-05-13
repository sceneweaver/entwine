import React, { Component } from 'react';

import {
	AtomicBlockUtils,
	Editor,
	EditorState,
	RichUtils,
	convertToRaw,
	Entity
} from 'draft-js';

import { stateToHTML } from 'draft-js-export-html';

/* ----- COMPONENT STYLES & DRAFT.JS EDITOR UTILS ----- */

const styles = {
	root: {
		fontFamily: '\'Georgia\', serif',
		padding: 20,
		width: 600,
	},
	buttons: {
		marginBottom: 10,
	},
	urlInputContainer: {
		marginBottom: 10,
	},
	urlInput: {
		fontFamily: '\'Georgia\', serif',
		marginRight: 10,
		padding: 3,
	},
	editor: {
		border: '1px solid #ccc',
		cursor: 'text',
		minHeight: 80,
		padding: 10,
	},
	button: {
		marginTop: 10,
		textAlign: 'center',
	},
	media: {
		width: '100%',
	},
};

const Audio = (props) => {
	return <audio controls src={props.src} style={styles.media} />;
};
const Image = (props) => {
	return <img src={props.src} style={styles.media} />;
};
const Video = (props) => {
	return <video controls src={props.src} style={styles.media} />;
};
const Media = (props) => {
	const entity = props.contentState.getEntity(
		props.block.getEntityAt(0)
	);
	const { src } = entity.getData();
	const type = entity.getType();
	let media;
	if (type === 'audio') {
		media = <Audio src={src} />;
	} else if (type === 'img') {
		media = <Image src={src} />;
	} else if (type === 'video') {
		media = <Video src={src} />;
	}
	return media;
};

function mediaBlockRenderer(block) {
	if (block.getType() === 'atomic') {
		return {
			component: Media,
			editable: false,
		};
	}
	return null;
}

let stateToHTMLOptions = {
	blockRenderers: {
		atomic: (block) => {
			const mediaKey = block.getEntityAt(0)
				, mediaEntityInstance = Entity.get(mediaKey)
				, mediaEntityInstanceData = mediaEntityInstance.getData()
				, mediaEntityInstanceType = mediaEntityInstance.getType();
			return `<div><${mediaEntityInstanceType} src="${mediaEntityInstanceData.src}" /></div>`;
		},
	},
};

/* ----- COMPONENT ----- */

class EditorScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorState: EditorState.createEmpty(),
			showURLInput: false,
			url: '',
			urlType: '',
			displayModule: false
		};
		this.onChange = (editorState) => {
			// converts text to plaintext to allow actors / wiki module to parse correctly
			let content = editorState.getCurrentContent()
				, contentPlainText = content.getPlainText()
				, contentHTML = stateToHTML(content, stateToHTMLOptions);
			this.props.onSceneTextChange(contentPlainText);
			this.props.onSceneHTMLChange(contentHTML);
			// updates Draft JS editor state
			this.setState({ editorState });
		};
		this.handleKeyCommand = this.handleKeyCommand.bind(this);
		this.focus = () => this.refs.editor.focus();

		this.onURLChange = event => this.setState({ urlValue: event.target.value });
		this.addAudio = this._addAudio.bind(this);
		this.addImage = this._addImage.bind(this);
		this.addVideo = this._addVideo.bind(this);
		this.confirmMedia = this._confirmMedia.bind(this);
		this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
	}

	handleKeyCommand(command) {
		const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
		if (newState) {
			this.onChange(newState);
			return 'handled';
		}
		return 'not-handled';
	}

	// BEGIN EXPERIMENT: MEDIA EDITOR

	_confirmMedia(e) {
		e.preventDefault();
		const { editorState, urlValue, urlType } = this.state
			, contentState = editorState.getCurrentContent()
			, contentStateWithEntity = contentState.createEntity(
				urlType,
				'IMMUTABLE',
				{ src: urlValue }
			)
			, entityKey = contentStateWithEntity.getLastCreatedEntityKey()
			, newEditorState = EditorState.set(
				editorState,
				{ currentContent: contentStateWithEntity }
			);
		this.onChange(AtomicBlockUtils.insertAtomicBlock(
			newEditorState,
			entityKey,
			' '
		));
		this.setState({
			showURLInput: false,
			urlValue: '',
		}, () => {
			setTimeout(() => this.focus(), 0);
		});
	}
	_onURLInputKeyDown(e) {
		if (e.which === 13) {
			this._confirmMedia(e);
		}
	}
	_promptForMedia(type) {
		const { editorState } = this.state;
		this.setState({
			showURLInput: true,
			urlValue: '',
			urlType: type,
		}, () => {
			setTimeout(() => this.refs.url.focus(), 0);
		});
	}
	_addAudio() {
		this._promptForMedia('audio');
	}
	_addImage() {
		this._promptForMedia('img');
	}
	_addVideo() {
		this._promptForMedia('video');
	}

	// END MEDIA EDITOR EXPERIMENT

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
		let urlInput;
		if (this.state.showURLInput) {
			urlInput =
				(<div className="editorscene-mediaurl-input" style={styles.urlInputContainer}>
					<label>
						Media URL: &nbsp;
					</label>
					<input
						onChange={this.onURLChange}
						ref="url"
						style={styles.urlInput}
						type="text"
						value={this.state.urlValue}
						onKeyDown={this.onURLInputKeyDown}
					/>
					<button
						className="editor-btn btn btn-default"
						onMouseDown={this.confirmMedia}
					>
						Add Media
                </button>
				</div>);
		}

		return (
			<div className="form-group editorscene-texteditor">

				<div className="editor-row">

					<input
						className="editor-scene-title"
						placeholder="Scene Title"
						name={this.props.whichScene}
						onChange={this.props.onSceneTitleChange}
						value={this.props.title}
					/>

				</div>

				<div className="editor-row">

					<div className="editor-right-align btn-group">

						<button
							className="editor-btn btn btn-default"
							onClick={this.onBoldClick.bind(this)}
						>
							<i className="fa fa-bold" />
						</button>
						<button
							className="editor-btn btn btn-default"
							onClick={this.onItalicClick.bind(this)}
						>
							<i className="fa fa-italic" />
						</button>
						<button
							className="editor-btn btn btn-default"
							onClick={this.onBlockQuoteClick.bind(this)}
						>
							<i className="fa fa-quote-right" />
						</button>
						<button
							className="editor-btn btn btn-default"
							onClick={this.onUnorderedListClick.bind(this)}
						>
							<i className="fa fa-list-ul" />
						</button>
						<button
							className="editor-btn btn btn-default"
							onClick={this.onOrderedListClick.bind(this)}
						>
							<i className="fa fa-list-ol" />
						</button>
						{/* <button
									onMouseDown={this.addAudio}
								>
									Add Audio
                </button> */}
						<button
							className="editor-btn btn btn-default"
							onClick={this.addImage}
						>
							<i className="fa fa-file-image-o" />
						</button>
						{/* <button onMouseDown={this.addVideo} style={{ marginRight: 10 }}>
									Add Video
                </button> */}

					</div>

					<div className="btn-group">

						<button
							className="btn btn-default module-btn"
							onClick={this.props.onShowActors}
						>
							Actors &nbsp; <span className="glyphicon glyphicon-user"></span>
						</button>

						<button
							className="btn btn-default module-btn"
							onClick={this.props.onShowMaps}
						>
							Map &nbsp; <span className="glyphicon glyphicon-globe"></span>
						</button>

						<button
							className="btn btn-default module-btn"
							onClick={this.props.onShowHero}
						>
							Hero &nbsp; <span className="glyphicon glyphicon-picture"></span>
						</button>

					</div>

				</div>

				{urlInput}

				<div className="editor-container" onClick={this.focus}>
					<Editor
						blockRendererFn={mediaBlockRenderer}
						editorState={this.state.editorState}
						handleKeyCommand={this.handleKeyCommand}
						onChange={this.onChange}
						position={this.props.whichScene}
						ref="editor"
					/>
				</div>
			</div>
		);
	}
}

/* ----- CONTAINER ----- */

import $ from 'jquery';
import { connect } from 'react-redux';
import { toggleActors, toggleMaps, toggleHero, setSceneText, setSceneHTML, setSceneTitle } from '../../reducers/editor';
import store from '../../store';

const mapStateToProps = (state) => ({
	whichScene: state.editor.whichScene,
	title: state.editor.scenes[state.editor.whichScene].title,
	text: state.editor.scenes[state.editor.whichScene].paragraphs[0],
	whichModule: state.editor.scenes[state.editor.whichScene].whichModule
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onShowActors(event) {
		event.preventDefault();
		$(`#editorscene-wrapper-${ownProps.whichScene}`).toggleClass("toggled");
		dispatch(toggleActors());
	},
	onShowMaps(event) {
		event.preventDefault();
		$(`#editorscene-wrapper-${ownProps.whichScene}`).toggleClass("toggled");
		dispatch(toggleMaps());
	},
	onShowHero(event) {
		event.preventDefault();
		$(`#editorscene-wrapper-${ownProps.whichScene}`).toggleClass("toggled");
		dispatch(toggleHero());
	},
	onSceneTitleChange(event) {
		event.preventDefault();
		dispatch(setSceneTitle(event.target.value));
	},
	onSceneTextChange(content) {
		event.preventDefault();
		dispatch(setSceneText(content));
	},
	onSceneHTMLChange(content) {
		event.preventDefault();
		dispatch(setSceneHTML(content));
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
