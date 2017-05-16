import _ from 'lodash';
import Actor from '../../server/utils/actors-constructor';
import Scene from '../../server/utils/scenes-constructor';
import Location from '../../server/utils/locations-constructor';
import MapModule from '../../server/utils/maps-constructor';

/* -----------------    ACTIONS     ------------------ */

const SET_STORY_TITLE = 'SET_STORY_TITLE';
const SET_EDITOR_SCENE = 'SET_EDITOR_SCENE';
const ADD_SCENE = 'ADD_SCENE';
const DELETE_SCENE = 'DELETE_SCENE';

const SET_EDITOR_STATE = 'SET_EDITOR_STATE';
const SET_SCENE_TEXT = 'SET_SCENE_TEXT';
const SET_SCENE_HTML = 'SET_SCENE_HTML';
const SET_SCENE_TITLE = 'SET_SCENE_TITLE';

const DESELECT_MODULE = 'DESELECT_MODULE';
const SHOW_MODULE = 'SHOW_MODULE';

const SET_ACTORS = 'SET_ACTORS';
const CHANGE_ACTOR = 'CHANGE_ACTOR';
const ADD_ACTOR = 'ADD_ACTOR';
const DELETE_ACTOR = 'DELETE_ACTOR';

const SET_LOCATION = 'SET_LOCATION';
const ADD_LOCATION = 'ADD_LOCATION';
const CHANGE_LOCATION = 'CHANGE_LOCATION';
const DELETE_LOCATION = 'DELETE_LOCATION';

const SET_MAP = 'SET_MAP';
const DELETE_MAP = 'DELETE_MAP';

const SET_HERO = 'SET_HERO';
const SET_HERO_QUERY = 'SET_HERO_QUERY';

const SET_RECOMMENDATIONS = 'SET_RECOMMENDATIONS';
const CLEAR_RECOMMENDATIONS = 'CLEAR_RECOMMENDATIONS';


/* ------------   ACTION CREATORS     ------------------ */

export const setEditorScene = (whichScene) => ({
  type: SET_EDITOR_SCENE,
  whichScene
});

export const deselectModule = (position) => ({
  type: DESELECT_MODULE,
  position
});

export const showModule = (module) => ({
  type: SHOW_MODULE,
  module
});

export const changeStoryTitle = input => ({
  type: SET_STORY_TITLE,
  input
});

export const addScene = () => ({
  type: ADD_SCENE,
});

export const deleteScene = (position) => ({
  type: DELETE_SCENE,
  position
});

export const setEditorState = (editorState) => ({
  type: SET_EDITOR_STATE,
  editorState
})

export const setSceneTitle = (input) => ({
  type: SET_SCENE_TITLE,
  input
});

export const setSceneText = (input) => ({
  type: SET_SCENE_TEXT,
  input
});

export const setSceneHTML = (input) => ({
  type: SET_SCENE_HTML,
  input
});

const setActors = (position, actors) => ({
  type: SET_ACTORS,
  position,
  actors
});

export const changeActor = (position, actorIndex, field, input) => ({
  type: CHANGE_ACTOR,
  position,
  actorIndex,
  field,
  input
});

export const addActor = position => ({
  type: ADD_ACTOR,
  position,
});

export const deleteActor = (position, actorIndex) => ({
  type: DELETE_ACTOR,
  position,
  actorIndex
});

export const setLocation = (position, locationArr) => ({
  type: SET_LOCATION,
  position,
  locationArr
});

export const addLocation = position => ({
  type: ADD_LOCATION,
  position
});

export const deleteLocation = (position) => ({
  type: DELETE_LOCATION,
  position
});

export const changeLocation = (position, locationIndex, field, input) => ({
  type: CHANGE_LOCATION,
  position,
  locationIndex,
  field,
  input
});

export const setMap = (position, coords, style, zoom) => ({
  type: SET_MAP,
  position,
  coords,
  style,
  zoom
});

export const deleteMap = (position) => ({
  type: DELETE_MAP,
  position,
});

export const setHeroQuery = (position, heroQuery) => ({
  type: SET_HERO_QUERY,
  position,
  heroQuery
});

export const setHero = (position, imageObj) => ({
  type: SET_HERO,
  position,
  heroURL: imageObj.heroURL,
  heroPhotog: imageObj.heroPhotog,
  heroPhotogURL: imageObj.heroPhotogURL
});

export const setRecommendations = (position, recString) => ({
  type: SET_RECOMMENDATIONS,
  position,
  recString
});

export const clearRecommendations= (position) => ({
  type: CLEAR_RECOMMENDATIONS,
  position
})

/* ------------       REDUCERS     ------------------ */

export default function reducer (state = {
  title: '',
  scenes: [new Scene()],
  whichScene: 0
}, action) {
  const newState = _.merge({}, state);
  switch (action.type) {

    case SET_STORY_TITLE:
      newState.title = action.input;
      break;

    case SET_EDITOR_SCENE:
      newState.whichScene = action.whichScene;
      break;

    case DESELECT_MODULE:
      newState.scenes[action.position].whichModule = null;
      break;

    case SHOW_MODULE:
      newState.scenes[state.whichScene].whichModule = action.module;
      break;

    case ADD_SCENE:
      const newScene = new Scene();
      newScene.getPosition(newState.scenes.length);
      newState.scenes = [...newState.scenes, newScene];
      newState.whichScene = newState.scenes.length - 1;
      break;

    case SET_EDITOR_STATE:
      newState.scenes[state.whichScene].editorState = action.editorState;
      break;

    case DELETE_SCENE:
      const firstHalfOfScenes = newState.scenes.slice(0, +action.position)
          , secondHalfOfScenes = newState.scenes.slice(+action.position + 1).map(scene => {
            scene.position--;
            return scene;
        });
      newState.scenes = [...firstHalfOfScenes, ...secondHalfOfScenes];
      newState.whichScene = action.position - 1 > -1 ? action.position - 1 : 0;
      break;

    case SET_ACTORS:
      newState.scenes[action.position].actors = action.actors;
      break;

    case SET_SCENE_TEXT:
      newState.scenes[state.whichScene].paragraphs[0] = action.input;
      break;

    case SET_SCENE_HTML:
      newState.scenes[state.whichScene].paragraphsHTML[0] = action.input;
      break;

    case SET_SCENE_TITLE:
      newState.scenes[state.whichScene].title = action.input;
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

    case SET_LOCATION:
      newState.scenes[action.position].locations = action.locationArr;
      break;

    case CHANGE_LOCATION:
      const newLocation = newState.scenes[action.position].locations[action.locationIndex];
      newLocation[action.field] = action.input;
      const firstHalfOfLocationChanges = newState.scenes[action.position].locations.slice(0, action.locationIndex)
        , secondHalfOfLocationChanges = newState.scenes[action.position].locations.slice(action.locationIndex + 1);
      newState.scenes[action.position].locations = [...firstHalfOfLocationChanges, newLocation, ...secondHalfOfLocationChanges];
      break;

    case ADD_LOCATION:
      newState.scenes[action.position].locations = newState.scenes[action.position].locations.concat([new Location()]);
      break;

    case DELETE_LOCATION:
      newState.scenes[action.position].locations = [];
      break;

    case SET_MAP:
      newState.scenes[action.position].maps = [new MapModule(action.coords, action.style, action.zoom)];
      break;

    case DELETE_MAP:
      newState.scenes[action.position].maps = []
      break;

    case SET_HERO_QUERY:
      newState.scenes[action.position].heroQuery = action.heroQuery;
      break;

    case SET_HERO:
      newState.scenes[action.position].heroURL = action.heroURL;
      newState.scenes[action.position].heroCredit = action.heroCredit;
      break;

    case SET_RECOMMENDATIONS:
      newState.scenes[action.position].recommendations = newState.scenes[action.position].recommendations.concat(action.recString);
      break;

    case CLEAR_RECOMMENDATIONS:
      newState.scenes[action.position].recommendations = [];
      break;

    default:
      return newState;
  }
  return newState;
}

/* ------------       DISPATCHERS     ------------------ */

import axios from 'axios';
import { browserHistory } from 'react-router';
import { create } from './stories';
import findProperNouns from '../../server/utils/findProperNouns';
import findPlaces from '../../server/utils/findPlaces';
import findHeroImage from '../../server/utils/findHeroImage';

import { convertToRaw } from 'draft-js';

export const generateActors = position => (dispatch, getState) => {
  const textBody = getState().editor.scenes[position].paragraphs[0];
  findProperNouns(textBody)
  .then(actorsArray => dispatch(setActors(position, actorsArray)));
};

export const generateHero = position => (dispatch, getState) => {
  const heroQuery = getState().editor.scenes[position].heroQuery;
  findHeroImage(heroQuery)
  .then(imageData => dispatch(setHero(position, imageData)));
};

export const submitStory = (user) => (dispatch, getState) => {
  const scenes = getState().editor.scenes;
  scenes.forEach(scene => {
    scene.editorState = null;
  });
  return axios.post('/api/stories', {
    title: getState().editor.title,
    scenes,
    userId: getState().auth.id
  })
  .then(newStory => {
    dispatch(create(newStory.data));
    browserHistory.push(`/stories/${newStory.data.id}`);
  });
};

export const generateMapLocations = position => (dispatch, getState) => {
  const textBody = getState().editor.scenes[position].paragraphs[0];
  findProperNouns(textBody)
  .then(actorsArray => {
    if (!actorsArray[0]) return findPlaces([{name: 'Fullstack Academy'}]);
    else return findPlaces(actorsArray);
  })
  .then(placesArr => {
    dispatch(setLocation(position, placesArr));
  });
};

export const generateRecommendations = position => (dispatch, getState) => {
  if (getState().editor.scenes[position].recommendations)
  dispatch(clearRecommendations(position));
  const textBody = getState().editor.scenes[position].paragraphs[0];
  findProperNouns(textBody)
  .then(actorsArray => {
    if (actorsArray.length > 0) {
      dispatch(setActors(position, actorsArray));
      dispatch(setRecommendations(position, 'actors'));
    }
    if (actorsArray[0]) return findPlaces(actorsArray);
  })
  .then(placesArr => {
    if (placesArr.length > 0) {
      dispatch(setLocation(position, placesArr));
      dispatch(setRecommendations(position, 'maps'));
    }
  });
};
