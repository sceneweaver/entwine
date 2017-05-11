import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const GET_SCENE = 'GET_SCENE';

/* ------------   ACTION CREATORS     ------------------ */

const getScene = scene => ({ type: GET_SCENE, scene });

/* ------------       REDUCERS     ------------------ */

export default function reducer (scene = {
  title: '',
  subhead: '',
  text: '',
  actors: [],
  mapModules: ''
}, action) {
  switch (action.type) {

    case GET_SCENE:
      return action.scene;

    default:
      return scene;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchScene = (storyId, sceneId) => dispatch => {
  axios.get(`/api/stories/${storyId}/scenes/${sceneId}`)
       .then(res => dispatch(getScene(res.data)))
       .catch(err => console.error(err));
};
