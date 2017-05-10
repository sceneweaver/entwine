import wiki from 'wikijs';

export default class Actor {
  constructor() {
    this.name = '';
    this.description = '';
    this.image = '';
    this.link = '';
  }
  getWikiInfo() {
    return wiki().page(this.name)
      .then(page => {
        return Promise.all([
          page.mainImage(),
          page.summary()
        ])
        .then(returnedArray => {
          this.image = returnedArray[0];
          this.description = returnedArray[1];
          return this;
        });
      });
  }
}
