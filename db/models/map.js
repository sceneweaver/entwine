'use strict';

const { STRING, TEXT } = require('sequelize');

module.exports = db => db.define('maps', {
  html: {
    type: TEXT
  }
});

module.exports.associations = (Map, {Scene, Story}) => {
  Map.belongsTo(Story);
  Map.belongsTo(Scene, { through: "ScenesMaps" })
}
