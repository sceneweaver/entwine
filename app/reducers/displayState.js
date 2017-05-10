import axios from 'axios';

/* -----------------    DUMMY DATA     ------------------ */

const fakeData = {
  title: 'This is our dummy story',
  scenes: [
    {
      id: 3,
      paragraphs: ['When the campaign to expel the Islamic State from Mosul began, on October 17th, the Nineveh Province SWAT team was deployed far from the action, in the village of Kharbardan. For weeks, the élite police unit, made up almost entirely of native sons of Mosul, had been patrolling a bulldozed trench that divided bleak and vacant enemy-held plains from bleak and vacant government-held plains.', 'The men, needing a headquarters, had commandeered an abandoned mud-mortar house whose primary charm was its location: the building next door had been obliterated by an air strike, and the remains of half a dozen Islamic State fighters—charred torsos, limbs, and heads—still littered the rubble.'],
      paragraphsHTML: ['<p>When the campaign to expel the Islamic State from Mosul began, on October 17th, the Nineveh Province SWAT team was deployed far from the action, in the village of Kharbardan. For weeks, the élite police unit, made up almost entirely of native sons of Mosul, had been patrolling a bulldozed trench that divided bleak and vacant enemy-held plains from bleak and vacant government-held plains.', 'The men, needing a headquarters, had commandeered an abandoned mud-mortar house whose primary charm was its location: the building next door had been obliterated by an air strike, and the remains of half a dozen Islamic State fighters—charred torsos, limbs, and heads—still littered the rubble.</p>'],
      position: 0,
      actors: [
        {
          id: 1,
          name: 'Islamic State',
          description: 'also known as ISIL, ISIS...',
          image: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
        },
        {
          id: 2,
          name: 'Nineveh Province SWAT team',
          description: 'description for the Nineveh Province SWAT team',
          image: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
        }
      ]
    }, {
      id: 4,
      paragraphs: ['The rest of our story follows as so!'],
      paragraphsHTML: ['<p>The rest of our story follows as so!</p>'],
      position: 1,
      actors: []
    }, {
      id: 5,
      paragraphs: ['More of our story appears here.', 'In two paragraphs.'],
      paragraphsHTML: ['<p>More of our story appears here.</p>', '<p>In two paragraphs.</p>'],
      position: 2,
      actors: [
        {
          id: 3,
          name: 'Dean Guo',
          description: 'generally excellent',
          image: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
        }
      ]
    }
  ]
}

/* -----------------    ACTIONS     ------------------ */

const SET_STORY = 'SET_STORY';
const SET_SCENE = 'SET_SCENE';

/* ------------   ACTION CREATORS     ------------------ */

const setStory = story => ({
  type: SET_STORY,
  title: story.title,
  scenes: story.scenes,
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
  currScene: {
    id: 0, // need to adjust
    paragraphs: [],
    paragraphsHTML: [],
    position: 0,
    actors: [],
    locations: [],
  }
}, action) {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case SET_STORY:
      newState.title = action.title;
      newState.scenes = action.scenes;
      newState.currScene = action.currScene;
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

export const fetchStory = (id) => dispatch => {
  axios.get(`/api/stories/${id}`)
    .then(res => {
      dispatch(setStory(res.data))
    })
    .catch(err => console.error(`Fetching story ${id} unsuccessful`, err));
};

export const setFakeState = () => dispatch => {
  dispatch(setStory(fakeData))
};


