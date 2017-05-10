import wiki from 'wikijs';

export class Actor {
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




/* findProperNouns refactor

const filteredWordsArray = splitStr(textBody).filter(removeAbbr).filter(filterWords).map(removePunctuation).filter(removeDates)
    , nounObj = arrToObj(filteredWordsArray);

return sortObjByOccurrence(nounObj)
.then(sortedObj => convertHashToOrderedArr(sortedObj))

*/
