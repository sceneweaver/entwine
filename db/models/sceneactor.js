'use strict'

module.exports = db => db.define('scenesactors')

module.exports.associations = (SceneActor, {Scene, Actor}) => {
  SceneActor.belongsTo(Scene)
  SceneActor.belongsTo(Actor)
}
