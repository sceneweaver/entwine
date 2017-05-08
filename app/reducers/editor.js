/* -----------------    ACTIONS     ------------------ */

const ADD_SCENE = 'ADD_SCENE';
const DELETE_SCENE = 'DELETE_SCENE';

const SET_SCENE_TEXT = 'SET_SCENE_TEXT';
const SET_NOUNS = 'SET_NOUNS';

const CHANGE_ACTOR = 'CHANGE_ACTOR';
const ADD_ACTOR = 'ADD_ACTOR';
const DELETE_ACTOR = 'DELETE_ACTOR';


/* ------------   ACTION CREATORS     ------------------ */

export const addScene = () => ({
  type: ADD_SCENE,
})

export const deleteScene = (position) => ({
  type: DELETE_SCENE,
  position
})

export const setSceneText = (position, input) => ({
  type: SET_SCENE_TEXT,
  position,
  input
})

const setNouns = (position, nouns) => ({
  type: SET_NOUNS,
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
  scenes: [{
    position: 1,
    title: '',
    paragraphs: [''],
    actors: []
  }],
}, action) {
  const newState = Object.assign({}, state)
  switch (action.type) {

    case ADD_SCENE:
      newState.scenes.push({
        position: state.scenes.length + 1,
        title: '',
        paragraphs: [''],
        actors: [{
          title: '',
          description: '',
          link: '',
          image: ''
        }]
      });
      break;

    case DELETE_SCENE:
      newState.scenes.splice(position - 1, 1);
      break;

    case SET_NOUNS:
      newState.scenes[action.position - 1].actors = action.nouns
      break;

    case SET_SCENE_TEXT:
      newState.scenes[action.position - 1].paragraphs[0] = action.input;
      break;

    case CHANGE_ACTOR:
      newState.scenes[action.position - 1].actors[action.actorIndex][action.field] = action.input;
      break;

    case ADD_ACTOR:
      newState.scenes[action.position - 1].actors.push({
        title: '',
        description: '',
        link: '',
        image: ''
      })
      break;

    case DELETE_ACTOR:
      newState.scenes[action.position - 1].actors.splice(action.actorIndex, 1);
      break;

    default:
      return newState;
  }
  return newState;
}

/* ------------       DISPATCHERS     ------------------ */

import axios from 'axios';
import { browserHistory } from 'react-router';
import findPronouns from '../../server/utils/findPronouns'

export const generateActors = position => (dispatch, getState) => {
  const textBody = getState().editor.scenes[position - 1].paragraphs[0]
    , nounArray = findPronouns(textBody);
  dispatch(setNouns(position, nounArray));
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
