'use strict';

const { STRING, TEXT } = require('sequelize');

module.exports = db => db.define('actors', {
  title: {
    type: STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: TEXT
  },
  image: {
    type: STRING,
    validate: {
      isUrl: true
    }
  },
  link: {
    type: STRING,
    validate: {
      isUrl: true
    }
  }
});

module.exports.associations = (Actor, {Scene, Story}) => {
  Actor.belongsTo(Story);
  Actor.belongsTo(Scene, { through: "ScenesActors" })
}
