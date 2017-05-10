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
        console.log('I found a page', page);
        if (!page) {
          console.log('Didnt find a page');
          return this;
        }
        else {
          return page.summary()
            .then(returnedDesc => {
              this.description = returnedDesc;
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
        console.log('something erred');
        return this;
      });
  }
}
