'use strict';

const { STRING, TEXT } = require('sequelize');

module.exports = db => db.define('actors', {
  name: {
    type: STRING,
    allowNull: false
  },
  description: {
    type: TEXT
  },
  image: {
    type: STRING,
    defaultValue: ''
  },
  link: {
    type: STRING,
    defaultValue: ''
  }
});

module.exports.associations = (Actor, {Scene, Story}) => {
  Actor.belongsTo(Story);
  Actor.belongsTo(Scene, { through: "ScenesActors" })
}
