/* -----------------    ACTIONS     ------------------ */

const ADD_SCENE = 'ADD_SCENE';
const DELETE_SCENE = 'DELETE_SCENE';

const SET_SCENE_TEXT = 'SET_SCENE_TEXT';
const SET_SCENE_TITLE = 'SET_SCENE_TITLE';

const TOGGLE_ACTORS = 'TOGGLE_ACTORS';

const SET_ACTORS = 'SET_ACTORS';
const CHANGE_ACTOR = 'CHANGE_ACTOR';
const ADD_ACTOR = 'ADD_ACTOR';
const DELETE_ACTOR = 'DELETE_ACTOR';

const FETCH_ACTOR_DESC = 'FETCH_ACTOR_DESC';
const FETCH_ACTOR_IMAGE = 'FETCH_ACTOR_IMAGE';
const FETCH_ACTOR_LINK = 'FETCH_ACTOR_LINK';


/* ------------   ACTION CREATORS     ------------------ */

export const toggleActors = (position, displayActors) => ({
  type: TOGGLE_ACTORS,
  position,
  displayActors
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

export const fetchActorDesc = (position, actorIndex, actorDesc) => ({
  type: FETCH_ACTOR_DESC,
  position,
  actorIndex,
  actorDesc
})


/* ------------       REDUCERS     ------------------ */

export default function reducer(state = {
  title: '',
  scenes: [{
    displayActors: false,
    position: 1,
    title: '',
    paragraphs: [''],
    actors: []
  }],
}, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {

    case TOGGLE_ACTORS:
      newState.scenes[action.position - 1].displayActors = action.displayActors;
      break;

    case ADD_SCENE:
      newState.scenes = [...newState.scenes, {
        displayActors: false,
        position: state.scenes.length + 1,
        title: '',
        paragraphs: [''],
        actors: []
      }]
      break;

    case DELETE_SCENE:
      let firstHalfOfScenes = newState.scenes.slice(0, action.position - 1)
        , secondHalfOfScenes = newState.scenes.slice(action.position).map(scene => {
          scene.position--;
          return scene;
        });
      newState.scenes = [...firstHalfOfScenes, ...secondHalfOfScenes];
      break;

    case SET_ACTORS:
      newState.scenes[action.position - 1].actors = action.nouns;
      break;

    case SET_SCENE_TEXT:
      newState.scenes[action.position - 1].paragraphs[0] = action.input;
      break;

    case SET_SCENE_TITLE:
      newState.scenes[action.position - 1].title = action.input;
      break;

    case CHANGE_ACTOR:
      newState.scenes[action.position - 1].actors[action.actorIndex][action.field] = action.input;
      break;

    case ADD_ACTOR:
      newState.scenes[action.position - 1].actors = newState.scenes[action.position - 1].actors.concat({
        title: '',
        description: '',
        link: '',
        image: ''
      });
      break;

    case DELETE_ACTOR:
      let firstHalfOfActors = newState.scenes[action.position - 1].actors.slice(0, +action.actorIndex)
        , secondHalfOfActors = newState.scenes[action.position - 1].actors.slice(+action.actorIndex + 1);
      newState.scenes[action.position - 1].actors = [...firstHalfOfActors, ...secondHalfOfActors];
      break;

    case FETCH_ACTOR_DESC:
      newState.scenes[action.position - 1].actors[action.actorIndex].description = action.actorDesc;
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
import wiki from 'wikijs';

const getWikiDesc = title => {
  return wiki().page(title)
  .then(page => page.summary());
}

export const generateActors = position => (dispatch, getState) => {
  const textBody = getState().editor.scenes[position - 1].paragraphs[0]
    , actorsArray = findProperNouns(textBody);
  // dispatch(setActors(position, actorsArray));
  // let actors = getState().editor.scenes[position - 1].actors;
  let updatedArray = actorsArray.map((actor, index) => {
    return dispatch(getWikiDesc(actor.title))
    // let updatedDescription = wiki().page(actor.title)
    // .then(page => page.summary())
    // .then(data => data.slice(0, 250));
      // fetchActorDesc(position, index, updatedDescription)
    // );
  });
    dispatch(setActors(position, updatedArray))
};

export const submitStory = title => (dispatch, getState) => {
  return axios.post('/api/stories', {
    title,
    scenes: getState().editor.scenes
  })
    .then(newStory => {
      browserHistory.push(`/stories/${newStory.data.id}`)
    })
}


