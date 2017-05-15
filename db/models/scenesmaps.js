'use strict'

module.exports = db => db.define('ScenesMaps', {})

module.exports.associations = (ScenesMaps, {Scene, Map}) => {
  ScenesMaps.belongsTo(Scene)
  ScenesMaps.belongsTo(Map)
}
