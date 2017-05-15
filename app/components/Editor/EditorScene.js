import React, { Component } from 'react';

import {
	AtomicBlockUtils,
	Editor,
	EditorState,
	RichUtils,
	Entity
} from 'draft-js';

import { stateToHTML } from 'draft-js-export-html';

import EditorSceneMediaInput from './EditorSceneMediaInput';
import EditorSceneButtons from './EditorSceneButtons';

/* ----- DRAFT.JS EDITOR UTILS ----- */

const Image = (props) => {
	return <img src={props.src} style={{media: {width: '100%'}}} />;
};

const Media = (props) => {
	const entity = props.contentState.getEntity(
		props.block.getEntityAt(0)
	);
	const { src } = entity.getData()
			, type = entity.getType();
	return type === 'img' ? <Image src={src} /> : null;
};

const mediaBlockRenderer = (block) => {
	return block.getType() === 'atomic' ?
		{ component: Media, editable: false }
		: null;
};

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
		this.onChange = this.onChange.bind(this);
		this.focus = () => this.refs.editor.focus();

		this.handleKeyCommand = this._handleKeyCommand.bind(this);
		this.onBold = this._onBold.bind(this);
		this.onItalic = this._onItalic.bind(this);
		this.onBlockQuote = this._onBlockQuote.bind(this);
		this.onUnorderedList = this._onUnorderedList.bind(this);
		this.onOrderedList = this._onOrderedList.bind(this);

		this.onAddImage = this._onAddImage.bind(this);
		this.onURLChange = this._onURLChange.bind(this);
		this.onURLInputKeyDown = this._onURLInputKeyDown.bind(this);
		this.confirmMedia = this._confirmMedia.bind(this);
	}

	onChange(editorState) {
		// converts text to plaintext to allow actors / wiki module to parse correctly
			let content = editorState.getCurrentContent()
				, contentPlainText = content.getPlainText()
				, contentHTML = stateToHTML(content, stateToHTMLOptions);
			this.props.onSceneTextChange(contentPlainText);
			this.props.onSceneHTMLChange(contentHTML);
			// updates Draft JS editor state
			this.setState({ editorState });
	}

	_handleKeyCommand(command) {
		const newState = RichUtils.handleKeyCommand(this.state.editorState, command);
		if (newState) {
			this.onChange(newState);
			return 'handled';
		}
		return 'not-handled';
	}

	_onBold() {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
	}

	_onItalic() {
		this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
	}

	_onBlockQuote() {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'blockquote'));
	}

	_onUnorderedList() {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'unordered-list-item'));
	}

	_onOrderedList() {
		this.onChange(RichUtils.toggleBlockType(this.state.editorState, 'ordered-list-item'));
	}

	_onAddImage() {
		this._promptForMedia('img');
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

	_onURLChange (event) {
		this.setState({
			urlValue: event.target.value
		});
	}

	_onURLInputKeyDown(event) {
		if (event.which === 13) {
			this._confirmMedia(event);
		}
	}

	_confirmMedia(event) {
		event.preventDefault();
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

	render() {
		return (
			<div className="editorscene-texteditor">

				<div className="editor-row">

					<input
						className="editor-scene-title title-font"
						placeholder="Scene Title"
						name={this.props.whichScene}
						onChange={this.props.onSceneTitleChange}
						value={this.props.title}
					/>

				</div>

				<EditorSceneButtons
					onBold={this.onBold}
					onItalic={this.onItalic}
					onBlockQuote={this.onBlockQuote}
					onUnorderedList={this.onUnorderedList}
					onOrderedList={this.onOrderedList}
					onAddImage={this.onAddImage}
					whichScene={this.props.whichScene}
					whichModule={this.props.whichModule}
				/>

				{this.state.showURLInput ?
					<EditorSceneMediaInput
						onURLChange={this.onURLChange}
						onURLInputKeyDown={this.onURLInputKeyDown}
						confirmMedia={this.confirmMedia}
						urlValue={this.state.urlValue}
					/> :
					null}

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

import { connect } from 'react-redux';
import { setSceneText, setSceneHTML, setSceneTitle } from '../../reducers/editor';

const mapStateToProps = (state) => ({
	whichScene: state.editor.whichScene,
	title: state.editor.scenes[state.editor.whichScene].title,
	text: state.editor.scenes[state.editor.whichScene].paragraphs[0],
	whichModule: state.editor.scenes[state.editor.whichScene].whichModule
});

const mapDispatchToProps = (dispatch) => ({
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
