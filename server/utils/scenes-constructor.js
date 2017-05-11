import Actor from './actors-constructor';
import Location from './locations-constructor';

export default class Scene {
  constructor() {
    this.displayActors = false;
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.actors = [new Actor()];
    this.locations = [];
    this.whichModule = null;
    this.maps = []
  }
  getPosition(index) {
    this.position = index;
  }
}
