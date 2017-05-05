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
