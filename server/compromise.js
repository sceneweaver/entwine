'use strict';

const router = require('express').Router()
  , nlp = require('compromise');

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
});

router.post('/places', (req, res, next) => {
  const text = req.body.textBody;
  let results = [];

  const places = nlp(text).places().out('array');

  places.forEach(place => {
    results.push({
      name: place,
      latitude: '',
      longitude: ''
    });
  });
  res.send(results);
});
