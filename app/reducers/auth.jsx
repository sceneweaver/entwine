import { browserHistory } from 'react-router';
/* -------------------<   ACTIONS   >--------------------- */

const AUTHENTICATED = 'AUTHENTICATED';
const SET = 'SET_CURRENT_USER';
const CREATE = 'CREATE_USER';

/* ---------------<   ACTION CREATORS   >------------------- */
export const create = user => ({ type: CREATE, user });

export const authenticated = user => ({
  type: AUTHENTICATED,
  user,
});

export const set = user => ({ type: SET, user });

/* -------------------<   REDUCERS   >--------------------- */

const initialState = {
  users: []
}

const reducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case AUTHENTICATED:
      return action.user;
    case CREATE:
      return [action.user, ...users];
    case SET:
      return action.user;
  }
  return state;
};

/* ------------------<   DISPATCHERS   >-------------------- */
import axios from 'axios';

// Logging in
export const login = (username, password) => dispatch =>
  axios
    .post('/api/auth/login/local', { username, password })
    .then(() => dispatch(whoami()))
    .catch(() => dispatch(whoami()));

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
      console.log('we posted to signup with this user', user)
      dispatch(create(user)); // so new user appears in our master list
      console.log('got to after create user')
      dispatch(set(user)); // set current user
      return user;
    })
    .catch(err => console.error(`Creating user: ${user} unsuccesful`, err));
};

export const signupAndGoToUser = credentials => dispatch => {
  dispatch(signup(credentials))
    .then(user => {
      console.log("signed up the following user:", user)
      browserHistory.push('/')
    })
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












// import axios from 'axios'

// const reducer = (state=null, action) => {
//   switch (action.type) {
//   case AUTHENTICATED:
//     return action.user
//   }
//   return state
// }

// const AUTHENTICATED = 'AUTHENTICATED'
// export const authenticated = user => ({
//   type: AUTHENTICATED, user
// })

// export const login = (username, password) =>
//   dispatch =>
//     axios.post('/api/auth/login/local',
//       {username, password})
//       .then(() => dispatch(whoami()))
//       .catch(() => dispatch(whoami()))

// export const logout = () =>
//   dispatch =>
//     axios.post('/api/auth/logout')
//       .then(() => dispatch(whoami()))
//       .catch(() => dispatch(whoami()))

// export const whoami = () =>
//   dispatch =>
//     axios.get('/api/auth/whoami')
//       .then(response => {
//         const user = response.data
//         dispatch(authenticated(user))
//       })
//       .catch(failed => dispatch(authenticated(null)))

// export default reducer


