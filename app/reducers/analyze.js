import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const GET_NOUNS = 'GET_NOUNS';

/* ------------   ACTION CREATORS     ------------------ */

const getNouns = nouns => ({ type: GET_NOUNS, nouns });

/* ------------       REDUCERS     ------------------ */

export default function reducer (nouns = {
  nouns: []
}, action) {
  const newState = Object.assign({}, nouns);
  switch (action.type) {
    case GET_NOUNS:
      newState.nouns = action.nouns;
      break;
    default:
      return nouns;
  }
  return newState;
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchNouns = (text) => dispatch => {
  return axios.post('/api/compromise/nouns', {text})
       .then(res => dispatch(getNouns(res.data)))
       .catch(err => console.error(err));
};

export const setNouns = (nounsArr) => (dispatch) => {
  axios.post('api/actors/bulk', {nounsArr});
};
