import _ from 'lodash';

/* -----------------    CLASSES     ------------------ */

class Actor {
  constructor() {
    this.title = '';
    this.description = '';
    this.image = '';
    this.link = '';
  }
}

class Scene {
  constructor() {
    this.displayActors = false;
    this.title = '';
    this.position = 0;
    this.paragraphs = [''];
    this.actors = [new Actor()];
  }
  getPosition(index) {
    this.position = index;
  }
}

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

const setActors = (position, nouns) => ({
  type: SET_ACTORS,
  position,
  nouns
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



/* ------------       REDUCERS     ------------------ */

export default function reducer(state = {
  title: '',
  scenes: [new Scene()],
}, action) {
  const newState = _.merge({}, state);
  switch (action.type) {

    case SET_STORY_TITLE:
      newState.title = action.input;
      break;

    case TOGGLE_ACTORS:
      newState.scenes[action.position].displayActors = action.displayActors;
      break;

    case ADD_SCENE:
      const newScene = new Scene();
      newScene.getPosition(newState.scenes.length);
      newState.scenes = [...newState.scenes, newScene];
      break;

    case DELETE_SCENE:
      let firstHalfOfScenes = newState.scenes.slice(0, action.position)
        , secondHalfOfScenes = newState.scenes.slice(action.position + 1).map(scene => {
          scene.position--;
          return scene;
        });
      newState.scenes = [...firstHalfOfScenes, ...secondHalfOfScenes];
      break;

    case SET_ACTORS:
      newState.scenes[action.position].actors = action.nouns;
      break;

    case SET_SCENE_TEXT:
      newState.scenes[action.position].paragraphs[0] = action.input;
      break;

    case SET_SCENE_TITLE:
      newState.scenes[action.position].title = action.input;
      break;

    case CHANGE_ACTOR:
      newState.scenes[action.position].actors[action.actorIndex][action.field] = action.input;
      break;

    case ADD_ACTOR:
      newState.scenes[action.position].actors = newState.scenes[action.position].actors.concat([new Actor()]);
      break;

    case DELETE_ACTOR:
      let firstHalfOfActors = newState.scenes[action.position].actors.slice(0, +action.actorIndex)
        , secondHalfOfActors = newState.scenes[action.position].actors.slice(+action.actorIndex + 1);
      newState.scenes[action.position].actors = [...firstHalfOfActors, ...secondHalfOfActors];
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
  const textBody = getState().editor.scenes[position].paragraphs[0]
    , nounArray = findProperNouns(textBody);
  dispatch(setActors(position, nounArray));
}

export const submitStory = title => (dispatch, getState) => {
  return axios.post('/api/stories', {
    title,
    scenes: getState().editor.scenes
  })
    .then(newStory => {
      browserHistory.push(`/stories/${newStory.data.id}`)
    })
}
