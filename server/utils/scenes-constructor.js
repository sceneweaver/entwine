import { EditorState } from 'draft-js';
let key = 1;

export default class Scene {
  constructor() {
    this.editorState = EditorState.createEmpty();
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.paragraphsHTML = [''];
    this.actors = [];
    this.locations = [];
    this.whichModule = null;
    this.maps = [];
    this.key = key++;
    this.heroQuery = '';
    this.heroURL = '';
    this.heroPhotog = '';
    this.heroPhotogURL = '';
    this.heroUnsplash = false;
    this.recommendations = [];
  }
  getPosition(index) {
    this.position = index;
  }
}
