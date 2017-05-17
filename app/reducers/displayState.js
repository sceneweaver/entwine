import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const SET_STORY = 'SET_STORY';
const SET_SCENE = 'SET_SCENE';

/* ------------   ACTION CREATORS     ------------------ */

const setStory = story => ({
  type: SET_STORY,
  title: story.title,
  scenes: story.scenes,
  user: story.user,
  currScene: story.scenes[0]
});

export const setCurrScene = scene => ({
  type: SET_SCENE,
  currScene: scene
})

/* ------------       REDUCERS     ------------------ */

export default function reducer(state = {
  title: '',
  scenes: [],
  user: {},
  currScene: {
    id: 0, // need to adjust
    paragraphs: [],
    paragraphsHTML: [],
    position: 0,
    actors: [],
    locations: [],
    maps: [],
    heroURL: '',
    heroPhotog: '',
    heroPhotogURL: '',
    heroUnsplash: false
  }
}, action) {
  const newState = Object.assign({}, state);
  switch (action.type) {
    case SET_STORY:
      newState.title = action.title;
      newState.scenes = action.scenes;
      newState.currScene = action.currScene;
      newState.user = action.user;
      break;
    case SET_SCENE:
      newState.currScene = action.currScene;
      break;
    default:
      return newState;
  }
  return newState;
}

/* ------------       DISPATCHERS     ------------------ */
import { featuredStory } from '../components/featuredStory';

export const fetchStory = (id) => dispatch => {
  axios.get(`/api/stories/${id}`)
    .then(res => {
      dispatch(setStory(res.data))
    })
    .catch(err => console.error(`Fetching story ${id} unsuccessful`, err));
};

export const fetchFakeStory = () => dispatch => {
  axios.get(`/api/stories/`) // make random call to fake asynchronicity
    .then(() => dispatch(setStory(featuredStory)));
};

export const fetchScene = position => (dispatch, getState) => {
  dispatch(setCurrScene(getState().displayState.scenes[position]));
};
