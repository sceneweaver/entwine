'use strict';

const router = require('express').Router()
    , HttpError = require('./utils/HttpError')
    , db = require('APP/db')
    , Actor = db.model('actors')
    , Scene = db.model('scenes');

module.exports = router;

// param middleware to set id param to 'actor';
router.param('actorId', (req, res, next, actorId) => {
  Actor.findById(actorId)
  .then(actor => {
    if (!actor) throw HttpError(404);
    req.actor = actor;
    next();
    return null;
  })
  .catch(next);
});

// get all actors for a given story
router.get('/:storyId', (req, res, next) => {
  Actor.findAll({where: {
    storyId: req.params.storyId
  }})
  .then(actors => {
    res.json(actors);
  })
  .catch(next);
});

// get all actors for a given scene
router.get('/:storyId/:sceneId', (req, res, next) => {
  Actor.findAll({where: {
    storyId: req.params.storyId,
    sceneId: req.params.sceneId
  }})
  .then(actors => {
    res.json(actors);
  })
  .catch(next);
});
// get one actor by id
router.get('/:id', (req, res, next) => {
  Actor.findOne(req.actor)
  .then(actor => {
    res.json(actor)
  })
  .catch(next);
});
// create an actor
router.post('/', (req, res, next) => {
  Actor.create(req.body)
  .then(actor => {
    actor.setScene()
    res.status(201).json(actor);
  })
  .catch(next);
})
//bulk create actors
router.post('/:sceneId/bulk', (req, res, next) => {
  req.body.actors.forEach(actor => {
    Actor.create({
      title: actor.title,
      description: actor.description,
      image: actor.image,
      link: actor.link,
    })
    .then(actor => {
      actor.setScene(req.params.sceneId)
    })
  })
  res.sendStatus(201);
});
// edit an actor
router.put('/:id', (req, res, next) => {
  req.actor.update(req.body)
  .then(actor => {
    res.json(actor);
  })
  .catch(next);
});
// delete an actor
router.delete('/:id', (req, res, next) => {
  req.actor.destroy()
  .then(() => {
    res.status(204).end();
  })
  .catch(next);
});

