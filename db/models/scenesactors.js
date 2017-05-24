'use strict';

module.exports = db => db.define('ScenesActors', {});

module.exports.associations = (ScenesActors, {Scene, Actor}) => {
  ScenesActors.belongsTo(Scene);
  ScenesActors.belongsTo(Actor);
};
