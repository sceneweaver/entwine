import axios from 'axios';

/* -----------------    DUMMY DATA     ------------------ */

const fakeData = {
  title: 'This is our dummy story',
  scenes: [
    {
      id: 3,
      text: ['When the campaign to expel the Islamic State from Mosul began, on October 17th, the Nineveh Province SWAT team was deployed far from the action, in the village of Kharbardan. For weeks, the élite police unit, made up almost entirely of native sons of Mosul, had been patrolling a bulldozed trench that divided bleak and vacant enemy-held plains from bleak and vacant government-held plains.', 'The men, needing a headquarters, had commandeered an abandoned mud-mortar house whose primary charm was its location: the building next door had been obliterated by an air strike, and the remains of half a dozen Islamic State fighters—charred torsos, limbs, and heads—still littered the rubble.'],
      position: 1,
      actors: [
        {
          id: 1,
          title: 'Islamic State',
          description: 'also known as ISIL, ISIS...',
          image: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
        },
        {
          id: 2,
          title: 'Nineveh Province SWAT team',
          description: 'description for the Nineveh Province SWAT team',
          image: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
        }
      ]
    }, {
      id: 4,
      text: ['The rest of our story follows as so!'],
      position: 2,
      actors: []
    }
  ]
}

/* -----------------    ACTIONS     ------------------ */

const GET_STORY = 'GET_STORY';
const SET_STORY = 'SET_STORY';

/* ------------   ACTION CREATORS     ------------------ */

const getStory = story => ({ type: GET_STORY, story });
const setStory = story => ({ type: SET_STORY, story });

/* ------------       REDUCERS     ------------------ */

export default function reducer(story = {
  title: '',
  scenes: [],
}, action) {
  switch (action.type) {
    case GET_STORY:
      return action.story;
    case SET_STORY:
      return action.story;
    default:
      return story;
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const fetchStory = (id) => dispatch => {
  axios.get(`/api/stories/${id}`)
    .then(res => dispatch(getStory(res.data)))
    .catch(err => console.error(`Fetching story ${id} unsuccessful`, err));
};

export const setFakeState = () => dispatch => {
  dispatch(setStory(fakeData))
};

