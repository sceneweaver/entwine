// import wiki from 'wikijs';
// import findProperNouns from './findProperNouns';
const wiki = require('wikijs')
// const findProperNouns = require('./findProperNouns')

function findPlaces(word) {
  wiki.default().page(word)
  .then(texas => texas.coordinates())
  .then(console.log)
}

findPlaces('paris')


// const DDG = require('node-ddg-api').DDG;
// const ddg = new DDG('my-app-name');
// const findProperNouns = require('findProperNouns');

// export default function findPlaces(text) {
//   var properNouns = findProperNouns(text);
//   var placesArr = [];
//   properNouns.forEach(noun => {
//     ddg.instantAnswer(noun, {skip_disambig: '0'}, function(err, response) {
//       var responseResult = response.RelatedTopics[0].Result.split(" ");

//     })
//   })
// }
// ddg.instantAnswer('france', {skip_disambig: '0'}, function(err, response) {
//   console.log(response.RelatedTopics[0].Result);
// });


// // [ { Result: '<a href="https://duckduckgo.com/Mosul">Mosul</a> A city in northern Iraq. Since October 2016 it has been the site of a military operation led...',

// //     Icon:
// //      { URL: 'https://duckduckgo.com/i/80643245.jpg',
// //        Height: '',
// //        Width: '' },

// //     FirstURL: 'https://duckduckgo.com/Mosul',

// //     Text: 'Mosul A city in northern Iraq. Since October 2016 it has been the site of a military operation led...' },

// //   { Result: '<a href="https://duckduckgo.com/Mosul_Dam">Mosul Dam</a>The largest dam in Iraq.',
// //     Icon:
// //      { URL: 'https://duckduckgo.com/i/0fca7912.jpg',
// //        Height: '',
// //        Width: '' },
// //     FirstURL: 'https://duckduckgo.com/Mosul_Dam',
// //     Text: 'Mosul Dam The largest dam in Iraq.' },

// //   { Result: '<a href="https://duckduckgo.com/University_of_Mosul">University of Mosul</a>A public university located in Mosul.',
// //     Icon:
// //      { URL: 'https://duckduckgo.com/i/3eb6bda8.png',
// //        Height: '',
// //        Width: '' },
// //     FirstURL: 'https://duckduckgo.com/University_of_Mosul',
// //     Text: 'University of Mosul A public university located in Mosul.' },

// //   { Topics: [ [Object], [Object], [Object] ], Name: 'Places' },

// //   { Topics: [ [Object] ], Name: 'Places' },

// //   { Topics: [ [Object], [Object] ], Name: 'Other uses' },

// //   { Topics: [ [Object], [Object], [Object], [Object] ],
// //     Name: 'See also' } ]



