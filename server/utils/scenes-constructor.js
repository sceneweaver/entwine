import Actor from './actors-constructor';

export default class Scene {
  constructor() {
    this.displayActors = false;
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.actors = [new Actor()];
    this.locations = [];
    this.whichModule = null;
  }
  getPosition(index) {
    this.position = index;
  }
}
