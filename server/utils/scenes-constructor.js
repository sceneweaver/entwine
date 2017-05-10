import Actor from './actors-constructor';

export default class Scene {
  constructor() {
    this.displayActors = false;
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.paragraphsHTML = [''];
    this.actors = [new Actor()];
    this.locations = [];
  }
  getPosition(index) {
    this.position = index;
  }
}
