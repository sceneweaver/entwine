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
        if (!page) {
          return this;
        }
        else {
          return page.summary()
            .then(returnedDesc => {
              this.description = returnedDesc.slice(0, 250);
              return this;
            })
            .then(alteredActor => {
              return page.mainImage()
              .then(returnedImage => {
                alteredActor.image = returnedImage;
                return this;
              });
            })
            .catch(err => {
              return this;
            });
        }
      })
      .catch(err => {
        return this;
      });
  }
}
