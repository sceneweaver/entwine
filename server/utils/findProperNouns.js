import Actor from './actors-constructor';

// remove new lines and spaces
const splitString = str => {
  let arr = str.split('\n').join(' ');
  arr = arr.split(' ');
  return arr;
};

const removeAbbreviations = word => {
    return word // convert string to array of words; only include words (no empty strings)
      && word !== 'Mr.'
      && word !== 'Ms.'
      && word !== 'Mrs.'
      && (word.length > 2 || word[word.length - 1] !== '.'); // removes middle initials as to not confuse them with the end of a sentence
};

const removeFirstWordOfSentence = (word, i, arr) => {
    let prevWord = arr[i - 1];
    return i !== 0 // exclude the first word (will always be capitalized)
      && /^[a-zA-Z]/.test(arr[i]) // exclude anything that does not start with a letter
      && !word.includes('—') // excludes any two words that have been joined by an em-dash
      && prevWord[prevWord.length - 1] !== '.' // excludes first word of a sentence
      && prevWord[prevWord.length - 1] !== '!' // excludes first word of a sentence
      && prevWord[prevWord.length - 1] !== '?' // excludes first word of a sentence
      && prevWord[prevWord.length - 2] !== '.' // excludes first word of a sentence if previous sentence ended in close quote
      && prevWord[prevWord.length - 1] !== ':';
};

const replacePossessives = word => word.replace(/'s/g, ''); // remove 's from end of words

const convertArrayToObject = arr => {
  const unwantedWords = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Mon', 'Tue', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'I']; // these are words to not be included in the resulting object
  let pronounObj = {};
  let i = 0;
  while (i < arr.length) {
    if (/^[A-Z]/.test(arr[i])) { // check if word is capitalized
      let newWord = `${arr[i]}`;
      while (/^[A-Z]/.test(arr[i + 1])
        && arr[i + 1].replace(/,+/g, '') !== 'I' // do not consider 'I' as part of the word
        && newWord[newWord.length - 1] !== ',' // end newWord when punctuation occurs
        && newWord[newWord.length - 1] !== '.'
        && newWord[newWord.length - 1] !== '!'
        && newWord[newWord.length - 1] !== '?'
      ) {
        newWord += ` ${arr[i + 1]}`;
        i++;
      }
      newWord = newWord.replace(/[",.!?*:]+/g, ''); // Remove unnecesary punctuation
      if (!unwantedWords.includes(newWord)) { // Do not include irrelevant proper nouns
        pronounObj[newWord] ? pronounObj[newWord]++ : pronounObj[newWord] = 1; // count the number of occurences
      }
    }
    i++;
  }
  return pronounObj;
};

// convert obj of words to hash of actor objects with their respective information from wikipedia
const sortObjectByOccurrence = obj => {
  const promisesArray = [];
  for (let word in obj) {
    const newActor = new Actor();
    newActor.name = word;
    promisesArray.push(newActor.getWikiInfo());
  }
  return Promise.all(promisesArray)
    .then(updatedActors => {
      const hash = {};
      updatedActors.forEach(actor => {
        if (hash[obj[actor.name]]) { // place actors into object with the occurency as the key and actor object as the value
          hash[obj[actor.name]].push(actor);
        } else {
          hash[obj[actor.name]] = [actor];
        }
      });
      return hash;
    });
};

// merge each value array of hash into a final array based on order of occurency
const convertHashToOrderedArrayOfValues = (object) => {
  const sortedKeys = Object.keys(object).sort((a, b) => b - a);
  return sortedKeys.reduce((array, key) => array.concat(object[key]), []);
};

// convert a string of text to an array of actor objects sorted by occurency
export default function findProperNouns(text) {
  const filteredArrayOfWords = splitString(text)
          .filter(removeAbbreviations)
          .filter(removeFirstWordOfSentence)
          .map(replacePossessives)
      , objectOfWords = convertArrayToObject(filteredArrayOfWords);

  return sortObjectByOccurrence(objectOfWords)
    .then(hash => convertHashToOrderedArrayOfValues(hash));
}
