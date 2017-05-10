'use strict';

const router = require('express').Router()
  , HttpError = require('./utils/HttpError')
  , db = require('APP/db')
  , Scene = db.model('scenes')
  , nlp = require('compromise')

module.exports = router;

router.post('/nouns', (req, res, next) => {
  const text = req.body.text;
  const parsedText = nlp(text).nouns().out('array');
  let obj = {};
  let results = [];
  parsedText.forEach(word => {
    if (obj[word]) obj[word]++;
    else (obj[word] = 1);
  });
  for (const word in obj) {
    if (obj[word] >= 2) {
      results.push({
        title: word,
        description: null,
        image: null,
        link: null
      });
    }
  }
  res.send(results);
})

router.post('/places', (req, res, next) => {
  // let arr = [];

  // req.body.nounsArr.forEach(noun => {
  //   arr.push(noun.title)
  // })

  let results = [];
  // let nounsStr = arr.join(" ");
  // console.log("nO ", nounsStr)

  const places = nlp(req.body.textBody).places().out('array');
  console.log("PLACES", places)
  places.forEach(place => {
    results.push({
      name: place,
      latitude: "",
      longitude: ""
    })
  })
  res.send(results);
})
