/* -----------------    ACTIONS     ------------------ */

const ADD_SCENE = 'ADD_SCENE';
const CHANGE_ACTOR = 'CHANGE_ACTOR';
const SET_NOUNS = 'SET_NOUNS';
const SET_SCENE_TEXT = 'SET_SCENE_TEXT';


/* ------------   ACTION CREATORS     ------------------ */

export const addScene = () => ({
  type: ADD_SCENE,
})

const changeActor = (scene, actor, index) => ({
  type: CHANGE_ACTOR,
  scene,
  actor,
  index
})

const setNouns = (position, nouns) => ({
  type: SET_NOUNS,
  position,
  nouns
})

export const setSceneText = (position, input) => ({
  type: SET_SCENE_TEXT,
  position,
  input
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
      newState.scenes = state.scenes.push({
        position: state.scenes.length + 1,
        title: '',
        paragraphs: [''],
        actors: []
      });
      break;
    case CHANGE_ACTOR:
      newState.scenes[action.scene].actors = state.scenes[scene].actors.splice(action.index, 0, action.actor);
      break;
    case SET_NOUNS:
      newState.scenes[action.position-1].actors = action.nouns
      break;
    case SET_SCENE_TEXT:
      newState.scenes[action.position - 1].paragraphs[0] = action.input;
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

export const handleActorChange = (scene, changedActorTitle, type, input) => (dispatch, getState) => {
  const actors = getState().editor.scenes[scene].actors;
  let index
    , actor;
  actors.forEach((a, i) => {
    if (a.title === changedActorTitle) {
      index = i;
      actor = a;
    }
  })
  actor[type] = input;
  dispatch(changeActor(scene, actor, index));
}

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
