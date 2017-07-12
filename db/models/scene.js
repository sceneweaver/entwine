'use strict';

const { STRING, ARRAY, TEXT, INTEGER, BOOLEAN } = require('sequelize');
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
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img'])
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
  },
  heroUnsplash: {
    type: BOOLEAN,
    defaultValue: false
  }
});

module.exports.associations = (Scene, { Story, Actor, Map }) => {
  //NOTE: moves defaultScope definition here to make sure other models exist before attempting to set eager loads.

  Scene.addScope('defaultScope', {
    include: [{
      model: Actor,
    }, {
      model: Map
    }]
  }, {
      override: true
    });

  Scene.belongsTo(Story);
  Scene.belongsToMany(Actor, { through: 'ScenesActors' });
  Scene.belongsToMany(Map, { through: 'ScenesMaps' });
};
