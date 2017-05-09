'use strict';

const { STRING, TEXT } = require('sequelize');

module.exports = db => db.define('locations', {
  name: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: TEXT
  },
  latitude: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  longitude: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

module.exports.associations = (Location, {Scene, Story}) => {
  Location.belongsTo(Story);
  Location.belongsTo(Scene, { through: "ScenesLocations" })
}
