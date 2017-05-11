'use strict';

const { STRING, ARRAY } = require('sequelize');

module.exports = db => db.define('stories', {
  title: {
    type: STRING,
    allowNull: false
  },
  tags: {
    type: ARRAY(STRING),
    defaultValue: [],
    set: function (tags) {
      tags = tags || [];
      if (typeof tags === 'string') {
        tags = tags.split(',').map(str => str.trim())
      }
      this.setDataValue('tags', tags);
    }
  }
}, {
  defaultScope: {
    include: [{
      model: db.model('scenes')
    }],
    order: [
      [db.model('scenes'), 'position', 'ASC']
    ]
  }
});

module.exports.associations = (Story, {User, Scene, Actor, MapModule}) => {
  Story.belongsTo(User);
  Story.hasMany(Scene);
  Story.hasMany(Actor);
  Story.hasMany(MapModule);
};
