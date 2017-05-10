import Actor from './actors-constructor';

export class Scene {
  constructor() {
    this.displayActors = false;
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.actors = [new Actor()];
    this.locations = [];
  }
  getPosition(index) {
    this.position = index;
  }
}
