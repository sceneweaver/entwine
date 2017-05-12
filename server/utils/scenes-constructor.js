let key = 1;

export default class Scene {
  constructor() {
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
    this.heroCredit = {
      photog: '',
      photogURL: ''
    };
  }
  getPosition(index) {
    this.position = index;
  }
}
