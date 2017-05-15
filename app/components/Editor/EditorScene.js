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

import EditorSceneMediaInput from './EditorSceneMediaInput';

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
	if (type === 'img') {
		media = <Image src={src} />;
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
			urlValue: '',
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
		this.addImage = this._addImage.bind(this);
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
		this.setState({
			showURLInput: true,
			urlValue: '',
			urlType: type,
		}, () => {
			setTimeout(() => this.refs.url.focus(), 0);
		});
	}
	_addImage() {
		this._promptForMedia('img');
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
			<div className="form-group editorscene-texteditor">

				<div className="editor-row">

					<input
						className="editor-scene-title title-font"
						placeholder="Scene Title"
						name={this.props.whichScene}
						onChange={this.props.onSceneTitleChange}
						value={this.props.title}
					/>

				</div>

				<div className="editor-row">

					<div className="editor-btns-left-align btn-group">

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
						<button
							className="editor-btn btn btn-default"
							onClick={this.addImage}
						>
							<i className="fa fa-file-image-o" />
						</button>

					</div>

					<div className="editor-btns-right-align btn-group">

						<button
							className="btn btn-default module-btn"
							onClick={this.props.onToggleModule.bind(this, 'actors')}
						>
							Actors &nbsp; <span className="glyphicon glyphicon-user"></span>
						</button>

						<button
							className="btn btn-default module-btn"
							onClick={this.props.onToggleModule.bind(this, 'maps')}
						>
							Map &nbsp; <span className="glyphicon glyphicon-globe"></span>
						</button>

						<button
							className="btn btn-default module-btn"
							onClick={this.props.onToggleModule.bind(this, 'hero')}
						>
							Hero &nbsp; <span className="glyphicon glyphicon-picture"></span>
						</button>

					</div>

				</div>

				{this.state.showURLInput ?
					<EditorSceneMediaInput
						onURLChange={this.onURLChange}
						onURLInputKeyDown={this.onURLInputKeyDown}
						confirmMedia={this.confirmMedia}
						urlValue={this.state.urlValue}
					/> :
					null }

				<div className="editor-container" onClick={this.focus}>
					<Editor
						blockRendererFn={mediaBlockRenderer}
						editorState={this.state.editorState}
						handleKeyCommand={this.handleKeyCommand}
						onChange={this.onChange}
						position={this.props.position}
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
import { deselectModule, showModule, setSceneText, setSceneHTML, setSceneTitle } from '../../reducers/editor';

const mapStateToProps = (state) => ({
	whichScene: state.editor.whichScene,
	title: state.editor.scenes[state.editor.whichScene].title,
	text: state.editor.scenes[state.editor.whichScene].paragraphs[0],
	whichModule: state.editor.scenes[state.editor.whichScene].whichModule
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onToggleModule(module, event) {
		event.preventDefault();
		if (ownProps.whichModule === module) {
			$(`#editorscene-wrapper-${ownProps.whichScene}`).removeClass('toggled');
			dispatch(deselectModule(ownProps.whichScene));
		} else {
			$(`#editorscene-wrapper-${ownProps.whichScene}`).addClass('toggled');
			dispatch(showModule(module));
		}
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
