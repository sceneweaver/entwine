import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const SET_SCENE = 'SET_SCENE'

/* ------------   ACTION CREATORS     ------------------ */

const setScene = text => ({ type: SET_SCENE, text });

/* ------------       REDUCERS     ------------------ */

export default function reducer (text = '', action) {

  switch (action.type) {
    case SET_SCENE:
      return action.text;
    default:
      return text;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const addStory = (title) => {
  return axios.post('/api/stories', {title})
    .then()
  //TODO: set story to state
};

export const addScene = (id) => dispatch => {
  axios.post(`/api/stories/${id}/nouns`)
       .then(res => dispatch(setScene(res.data)))
       .catch(err => console.error(`Fetching story ${id} unsuccessful`, err));
};
