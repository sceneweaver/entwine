'use strict';

const { STRING, ARRAY, TEXT, INTEGER } = require('sequelize');
const sanitizeHtml = require('sanitize-html');

module.exports = db => db.define('scenes', {
  title: {
    type: STRING
  },
  paragraphs: {
    type: ARRAY(TEXT),
    defaultValue: [],
    set: function (unsanitizedParagraphs) {
      const sanitizedParagraphs = unsanitizedParagraphs.map(sanitizeHtml);
      this.setDataValue('paragraphs', sanitizedParagraphs);
    }
  },
  paragraphsHTML: {
    type: ARRAY(TEXT),
    defaultValue: [],
    set: function (unsanitizedParagraphs) {
      const sanitizedParagraphs = unsanitizedParagraphs.map(dirty => sanitizeHtml(dirty, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
      }));
      this.setDataValue('paragraphsHTML', sanitizedParagraphs);
    }
  },
  position: { //TODO: research best way to set up a DB that tracks the ORDER of associated scenes in a story
    type: INTEGER
  },
  heroURL: {
    type: STRING,
    defaultValue: ''
  },
  heroPhotog: {
    type: STRING,
    defaultValue: ''
  },
  heroPhotogURL: {
    type: STRING,
    defaultValue: ''
  }
}, {
  defaultScope: {
    include: [{
      model: db.model('actors'),
    }, {
      model: db.model('maps')
    }]
  }
});

module.exports.associations = (Scene, {Story, Actor, Map}) => {
  Scene.belongsTo(Story);
  Scene.belongsToMany(Actor, { through: 'ScenesActors' });
  Scene.belongsToMany(Map, { through: 'ScenesMaps' });
};
