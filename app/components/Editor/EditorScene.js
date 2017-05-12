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
import EditorActors from './EditorActors';
import EditorMaps from './EditorMaps';

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
	} else if (type === 'image') {
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
					, mediaEntityInstanceData = mediaEntityInstance.getData();
			return '<div><img src="' + mediaEntityInstanceData.src + '"/></div>';
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
			this.props.onSceneTextChange(this.props.position, contentPlainText);
			this.props.onSceneHTMLChange(this.props.position, contentHTML);
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
		this._promptForMedia('image');
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
				<div style={styles.urlInputContainer}>
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
					<button onMouseDown={this.confirmMedia}>
						Confirm
                </button>
				</div>;
		}

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
							onClick={this.props.onShowMaps}
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
								<div style={styles.buttons}>
									<button onMouseDown={this.addAudio} style={{ marginRight: 10 }}>
										Add Audio
                </button>
									<button onMouseDown={this.addImage} style={{ marginRight: 10 }}>
										Add Image
                </button>
									<button onMouseDown={this.addVideo} style={{ marginRight: 10 }}>
										Add Video
                </button>
								</div>
							</div>
						</div>

						{urlInput}

						<div className="editor-container" onClick={this.focus}>
							<Editor
								blockRendererFn={mediaBlockRenderer}
								editorState={this.state.editorState}
								handleKeyCommand={this.handleKeyCommand}
								onChange={this.onChange}
								position={this.props.position}
								placeholder="Write your story"
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
import { toggleActors, setSceneText, setSceneHTML, setSceneTitle, deleteScene, toggleMaps } from '../../reducers/editor';

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
	onShowMaps(event) {
		event.preventDefault();
		$(`#editorscene-wrapper-${ownProps.position}`).toggleClass("toggled");
		dispatch(toggleMaps(ownProps.position));
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
	}
});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
