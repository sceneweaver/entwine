'use strict';

const { STRING, TEXT } = require('sequelize');

module.exports = db => db.define('locations', {
  name: {
    type: STRING
  },
  description: {
    type: TEXT,
    allowNull: false
  },
  latitude: {
    type: STRING,
    allowNull: false
  },
  longitude: {
    type: STRING,
    allowNull: false
  }
});

module.exports.associations = (Location, {Scene, Story}) => {
  Location.belongsTo(Story);
  Location.belongsTo(Scene, { through: 'ScenesLocations' });
};
