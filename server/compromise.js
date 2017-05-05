'use strict';

const router = require('express').Router()
    , HttpError = require('./utils/HttpError')
    , db = require('APP/db')
    , Scene = db.model('scenes')
    , nlp = require('compromise')

module.exports = router;

router.post('/nouns', (req, res, next) => {
  const text = req.body.text;
  const parsedText = nlp(text).nouns();
  let obj = {};
  let results =[];
  parsedText.out('array')
  .forEach(word => {
    if (obj[word]) obj[word]++;
    else (obj[word] = 1);
  });
  for (const word in obj) {
    if (obj[word] > 1) {
      results.push({name: word});
    }
  }
  res.send(results);
})
.catch(next);
