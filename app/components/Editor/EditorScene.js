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

const style = {
	blackText: {
		color: 'black',
	}
};

const Image = (props) => {
	return <img src={props.src} style={{ media: { width: '100%' } }} />;
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

		this.recommendationString = this.recommendationString.bind(this);
	}

	onChange(editorState) {
		// converts text to plaintext to allow actors / wiki module to parse correctly
		let content = editorState.getCurrentContent()
			, contentPlainText = content.getPlainText()
			, contentHTML = stateToHTML(content, stateToHTMLOptions);
		this.props.onSceneTextChange(contentPlainText);
		this.props.onSceneHTMLChange(contentHTML);
		this.props.onEditorStateChange(editorState);
	}

	_handleKeyCommand(command) {
		const newState = RichUtils.handleKeyCommand(this.props.editorState, command);
		if (newState) {
			this.onChange(newState);
			return 'handled';
		}
		return 'not-handled';
	}

	_onBold() {
		this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'BOLD'));
	}

	_onItalic() {
		this.onChange(RichUtils.toggleInlineStyle(this.props.editorState, 'ITALIC'));
	}

	_onBlockQuote() {
		this.onChange(RichUtils.toggleBlockType(this.props.editorState, 'blockquote'));
	}

	_onUnorderedList() {
		this.onChange(RichUtils.toggleBlockType(this.props.editorState, 'unordered-list-item'));
	}

	_onOrderedList() {
		this.onChange(RichUtils.toggleBlockType(this.props.editorState, 'ordered-list-item'));
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

	_onURLChange(event) {
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
		const { urlValue, urlType } = this.state
			, editorState = this.props.editorState
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

	recommendationString(recArr) {
		let string = 'We noticed you have ';
		let secondHalf = ' We recommend using the ';

		recArr.forEach((rec, i) => {
			let detected = '';
			if (rec === 'actors') detected = 'characters';
			if (rec === 'maps') detected = 'locations';

			if (i === recArr.length - 1 && recArr.length > 1) {
				string += ' and ' + detected;
			} else if (i === 0) {
				string += detected;
			} else {
				string += ', ' + detected;
			}

			if (i === recArr.length - 1 && recArr.length > 1) {
				secondHalf += ' and ' + rec;
			} else if (i === 0) {
				secondHalf += rec;
			} else {
				secondHalf += ', ' + rec;
			}

		return string;
	});

	string += '!' + secondHalf;
	if (recArr.length > 1) {
		string += '  modules!';
	} else {
		string += ' module!';
	}

	return (
		<p className="rec-string">{string}</p>
	);
}

componentWillReceiveProps(nextProps) {
		$(`.module-btn`).removeClass('highlighted-rec');

    if (nextProps.recommendations.length > 0) {
      nextProps.recommendations.forEach(rec => {
        $(`#${rec}.module-btn`).addClass('highlighted-rec');
      });
    }
  }

	render() {
		return (
			<div className="editor-scene-editor">

				<div className="editor-row">

					<input
						style={style.blackText}
						id="editor-scene-title"
						className="title-font"
						placeholder={`Title Scene ${this.props.whichScene + 1}`}
						name={this.props.whichScene}
						onChange={this.props.onSceneTitleChange}
						value={this.props.title}
					/>

					<button
						className="btn btn-default editorscene-delete-btn"
						onClick={this.props.onDeleteScene}
					>
						<span className="glyphicon glyphicon-trash"  />
					</button>

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
					recommendations={this.props.recommendations}
				/>

				{this.state.showURLInput ?
					<EditorSceneMediaInput
						onURLChange={this.onURLChange}
						onURLInputKeyDown={this.onURLInputKeyDown}
						confirmMedia={this.confirmMedia}
						urlValue={this.state.urlValue}
					/> :
					null}

				{this.props.recommendations.length > 0 ?
					this.recommendationString(this.props.recommendations)
				: null}

				{this.props.editorState ?
					<div
						className="editor-container"
						onClick={this.focus}
					>
						<Editor
							blockRendererFn={mediaBlockRenderer}
							editorState={this.props.editorState}
							handleKeyCommand={this.handleKeyCommand}
							onChange={this.onChange}
							ref="editor"
							position={this.props.position}
						/>
					</div> :
					null}
			</div>
		);
	}
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { deleteScene, setSceneText, setSceneHTML, setSceneTitle, setEditorState, generateRecommendations } from '../../reducers/editor';

const mapStateToProps = (state) => ({
	editorState: state.editor.scenes[state.editor.whichScene].editorState,
	whichScene: state.editor.whichScene,
	title: state.editor.scenes[state.editor.whichScene].title,
	text: state.editor.scenes[state.editor.whichScene].paragraphs[0],
	whichModule: state.editor.scenes[state.editor.whichScene].whichModule,
	recommendations: state.editor.scenes[state.editor.whichScene].recommendations
});

const mapDispatchToProps = (dispatch, ownProps) => ({
	onDeleteScene(event) {
		event.preventDefault();
		let allowDelete = confirm(`Are you sure you want to delete scene ${+ownProps.whichScene + 1}?`);
		if (allowDelete) {
			dispatch(deleteScene(+ownProps.whichScene));
		}
	},
	onSceneTitleChange(event) {
		event.preventDefault();
		dispatch(setSceneTitle(event.target.value));
	},
	onSceneTextChange(content) {
		dispatch(setSceneText(content));
	},
	onSceneHTMLChange(content) {
		dispatch(setSceneHTML(content));
	},
	onEditorStateChange(editorState) {
		dispatch(setEditorState(editorState));
	},
	onRecommendation(position, event) {
		event.preventDefault();
		dispatch(generateRecommendations(position));
	}

});

export default connect(mapStateToProps, mapDispatchToProps)(EditorScene);
