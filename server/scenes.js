'use strict';

const router = require('express').Router()
    , HttpError = require('./utils/HttpError')
    , db = require('APP/db')
    , Scene = db.model('scenes');

// /api/stories/5/scenes/2

module.exports = router;

// param middleware to set id param to 'scene';
router.param('sceneId', (req, res, next, sceneId) => {
  Scene.findById(sceneId)
  .then(scene => {
    if (!scene) throw HttpError(404);
    req.scene = scene;
    next();
    return null;
  })
  .catch(next);
});

// get one scene by id
router.get('/:sceneId', (req, res, next) => {
  Scene.findOne(req.scene)
  .then(scene => {
    res.json(scene)
  })
  .catch(next);
});
// create a scene
router.post('/', (req, res, next) => {
  Scene.create({ paragraphs: [req.body.paragraphs] })
  .then(scene => {
    return scene.setStory(req.params.storyId)
    .then(newScene => res.status(201).json(newScene))
  })
  .catch(next);
});
// edit a scene
router.put('/:sceneId', (req, res, next) => {
  req.scene.update(req.body)
  .then(scene => {
    res.json(scene);
  })
  .catch(next);
});
// delete a scene
router.delete('/:sceneId', (req, res, next) => {
  req.scene.destroy()
  .then(() => {
    res.status(204).end();
  })
  .catch(next);
});
