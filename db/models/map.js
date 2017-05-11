'use strict';

const { STRING, TEXT } = require('sequelize');

module.exports = db => db.define('mapModules', {
  html: {
    type: TEXT
  }
});

module.exports.associations = (MapModule, {Scene, Story}) => {
  MapModule.belongsTo(Story);
  MapModule.belongsTo(Scene, { through: "ScenesMaps" })
}
