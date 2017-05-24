'use strict';

const { STRING, INTEGER } = require('sequelize');

module.exports = db => db.define('maps', {
  coords: {
    type: STRING
  },
  style: {
    type: STRING
  },
  zoom: {
    type: INTEGER
  },
});

module.exports.associations = (Map, {Scene, Story}) => {
  Map.belongsTo(Story);
  Map.belongsTo(Scene, { through: 'ScenesMaps' });
};
