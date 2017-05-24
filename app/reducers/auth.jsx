/* -------------------<   ACTIONS   >--------------------- */

const AUTHENTICATED = 'AUTHENTICATED';
const SET = 'SET_CURRENT_USER';

/* ---------------<   ACTION CREATORS   >------------------- */

export const authenticated = user => ({
  type: AUTHENTICATED,
  user,
});

export const set = user => ({ type: SET, user });

/* -------------------<   REDUCERS   >--------------------- */

const initialState = {
  user: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATED:
      return action.user;
    case SET:
      return action.user;
  }
  return state;
};

/* ------------------<   DISPATCHERS   >-------------------- */
import axios from 'axios';

// Logging in
export const login = (username, password) => dispatch => {
  return axios.post('/api/auth/login/local', { username, password })
    .then(() => dispatch(whoami()))
    .catch(() => dispatch(whoami()));
};

// Logging out
export const logout = () => dispatch =>
  axios
    .post('/api/auth/logout')
    .then(() => dispatch(whoami()))
    .catch(() => dispatch(whoami()));

export const signup = credentials => dispatch => {
  return axios
    .post('/api/auth/signup', credentials)
    .then(res => res.data)
    .then(user => {
      dispatch(set(user)); // set current user
      return user;
    })
    .catch(err => console.error(`Creating user: ${user} unsuccesful`, err));
};

export const signupAndGoToUser = credentials => dispatch => {
  dispatch(signup(credentials))
    .then(user => {})
    .catch(err => console.error('Problem signing up:', err));
};

// Getting user info
export const whoami = () => dispatch =>
  axios
    .get('/api/auth/whoami')
    .then(response => {
      const user = response.data;
      dispatch(authenticated(user));
    })
    .catch(failed => dispatch(authenticated(null)));

export default reducer;
