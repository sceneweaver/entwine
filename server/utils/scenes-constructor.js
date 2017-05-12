let key = 1;

export default class Scene {
  constructor() {
    this.displayActors = false;
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.paragraphsHTML = [''];
    this.actors = [];
    this.locations = [];
    this.whichModule = null;
    this.maps = [];
    this.key = key++;
  }
  getPosition(index) {
    this.position = index;
  }
}
