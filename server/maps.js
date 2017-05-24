'use strict';

const router = require('express').Router()
    , HttpError = require('./utils/HttpError')
    , db = require('APP/db')
    , Map = db.model('maps');

module.exports = router;

// param middleware to set id param to 'actor';
router.param('mapId', (req, res, next, mapId) => {
  Map.findById(mapId)
  .then(map => {
    if (!map) throw HttpError(404);
    req.map = map;
    next();
    return null;
  })
  .catch(next);
});

// get all maps for a given story
router.get('/:storyId', (req, res, next) => {
  Map.findAll({where: {
    storyId: req.params.storyId
  }})
  .then(maps => {
    res.json(maps);
  })
  .catch(next);
});

// get all maps for a given scene
router.get('/:storyId/:sceneId', (req, res, next) => {
  Map.findAll({where: {
    storyId: req.params.storyId,
    sceneId: req.params.sceneId
  }})
  .then(maps => {
    res.json(maps);
  })
  .catch(next);
});
// get one map by id
router.get('/:id', (req, res, next) => {
  Map.findOne(req.map)
  .then(map => {
    res.json(map);
  })
  .catch(next);
});
// create an map
router.post('/', (req, res, next) => {
  Map.create(req.body)
  .then(createdMap => {
    createdMap.setScene(req.params.sceneId);
    res.status(201).json(createdMap);
  })
  .catch(next);
});
// edit an map
router.put('/:id', (req, res, next) => {
  req.map.update(req.body)
  .then(map => {
    res.json(map);
  })
  .catch(next);
});
// delete an map
router.delete('/:id', (req, res, next) => {
  req.map.destroy()
  .then(() => {
    res.status(204).end();
  })
  .catch(next);
});

