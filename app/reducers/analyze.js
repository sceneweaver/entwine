import axios from 'axios';

/* -----------------    ACTIONS     ------------------ */

const GET_NOUNS = 'GET_NOUNS'

/* ------------   ACTION CREATORS     ------------------ */

const getNouns = nouns => ({ type: GET_NOUNS, nouns })

/* ------------       REDUCERS     ------------------ */

export default function reducer (text = {
  nouns: []
}, action) {
  const newState = Object.assign({}, state)

  switch (action.type) {
    case GET_NOUNS:
      newState.nouns = action.nouns;
      break;
    default:
      return text;
  }

  return newState;
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchNouns = (text) => dispatch => {
  axios.post(`/api/nouns`, {text})
       .then(res => dispatch(getNouns(res.data)))
       .catch(err => console.error(`Fetching story ${id} unsuccessful`, err));
};

export const setNouns = (nounsArr) => dispatch => {
    axios.post('api/actors/bulk', {nounsArr})
}
