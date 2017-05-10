import _ from 'lodash';
import wiki from 'wikijs';
import Actor from '../../server/utils/actors-constructor';
import Scene from '../../server/utils/scenes-constructor';

/* -----------------    ACTIONS     ------------------ */

const SET_STORY_TITLE = 'SET_STORY_TITLE';
const ADD_SCENE = 'ADD_SCENE';
const DELETE_SCENE = 'DELETE_SCENE';

const SET_SCENE_TEXT = 'SET_SCENE_TEXT';
const SET_SCENE_TITLE = 'SET_SCENE_TITLE';

const TOGGLE_ACTORS = 'TOGGLE_ACTORS';

const SET_ACTORS = 'SET_ACTORS';
const CHANGE_ACTOR = 'CHANGE_ACTOR';
const ADD_ACTOR = 'ADD_ACTOR';
const DELETE_ACTOR = 'DELETE_ACTOR';

const SET_LOCATIONS = 'SET_LOCATIONS';


/* ------------   ACTION CREATORS     ------------------ */

export const toggleActors = (position, displayActors) => ({
  type: TOGGLE_ACTORS,
  position,
  displayActors
})

export const changeStoryTitle = input => ({
  type: SET_STORY_TITLE,
  input
})

export const addScene = () => ({
  type: ADD_SCENE,
})

export const deleteScene = (position) => ({
  type: DELETE_SCENE,
  position
})

export const setSceneTitle = (position, input) => ({
  type: SET_SCENE_TITLE,
  position,
  input
})

export const setSceneText = (position, input) => ({
  type: SET_SCENE_TEXT,
  position,
  input
})

const setActors = (position, actors) => ({
  type: SET_ACTORS,
  position,
  actors
})

export const changeActor = (position, actorIndex, field, input) => ({
  type: CHANGE_ACTOR,
  position,
  actorIndex,
  field,
  input
})

export const addActor = position => ({
  type: ADD_ACTOR,
  position,
})

export const deleteActor = (position, actorIndex) => ({
  type: DELETE_ACTOR,
  position,
  actorIndex
})

export const setLocations = (position, locations) => ({
  type: SET_LOCATIONS,
  position,
  locations
})


/* ------------       REDUCERS     ------------------ */

export default function reducer (state = {
  title: '',
  scenes: [new Scene()],
}, action) {
  const newState = _.merge({}, state);
  switch (action.type) {

    case SET_STORY_TITLE:
      newState.title = action.input;
      break;

    case TOGGLE_ACTORS:
      newState.scenes[action.position].whichModule = 'actors';
      break;

    case ADD_SCENE:
      const newScene = new Scene();
      newScene.getPosition(newState.scenes.length);
      newState.scenes = [...newState.scenes, newScene];
      break;

    case DELETE_SCENE:
      const firstHalfOfScenes = newState.scenes.slice(0, +action.position)
        , secondHalfOfScenes = newState.scenes.slice(+action.position + 1).map(scene => {
          scene.position--;
          return scene;
        });
      newState.scenes = [...firstHalfOfScenes, ...secondHalfOfScenes];
      break;

    case SET_ACTORS:
      newState.scenes[action.position].actors = action.actors;
      break;

    case SET_SCENE_TEXT:
      newState.scenes[action.position].paragraphs[0] = action.input;
      break;

    case SET_SCENE_TITLE:
      newState.scenes[action.position].title = action.input;
      break;

    case CHANGE_ACTOR:
      const newActor = newState.scenes[action.position].actors[action.actorIndex];
      newActor[action.field] = action.input;
      const firstHalfOfChanges = newState.scenes[action.position].actors.slice(0, action.actorIndex)
        , secondHalfOfChanges = newState.scenes[action.position].actors.slice(action.actorIndex + 1);
      newState.scenes[action.position].actors = [...firstHalfOfChanges, newActor, ...secondHalfOfChanges];
      break;

    case ADD_ACTOR:
      newState.scenes[action.position].actors = newState.scenes[action.position].actors.concat([new Actor()]);
      break;

    case DELETE_ACTOR:
      const firstHalfOfActors = newState.scenes[action.position].actors.slice(0, +action.actorIndex)
        , secondHalfOfActors = newState.scenes[action.position].actors.slice(+action.actorIndex + 1);
      newState.scenes[action.position].actors = [...firstHalfOfActors, ...secondHalfOfActors];
      break;

    case SET_LOCATIONS:
      newState.scenes[action.position].locations = action.locations;
      newState.scenes[action.position].whichModule = 'maps';
      break;

    default:
      return newState;
  }
  return newState;
}

/* ------------       DISPATCHERS     ------------------ */

import axios from 'axios';
import { browserHistory } from 'react-router';
import findProperNouns from '../../server/utils/findProperNouns';

export const generateActors = position => (dispatch, getState) => {
  const textBody = getState().editor.scenes[position].paragraphs[0];
  findProperNouns(textBody)
  .then(actorsArray => dispatch(setActors(position, actorsArray)));
};

export const submitStory = () => (dispatch, getState) => {
  return axios.post('/api/stories', {
    title: getState().editor.title,
    scenes: getState().editor.scenes
  })
    .then(newStory => {
      browserHistory.push(`/stories/${newStory.data.id}`);
    });
};

export const generateMapLocations = position => (dispatch, getState) => {
  const textBody = getState().editor.scenes[position].paragraphs[0]
    , nounsArr = findProperNouns(textBody);
  return axios.post('/api/compromise/places', {textBody})
    .then(res => dispatch(setLocations(position, res.data)))
};
