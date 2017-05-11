import axios from 'axios';

/* -----------------    DUMMY DATA     ------------------ */

const fakeData = {
  title: 'This is our dummy story',
  scenes: [
    {
      id: 3,
      title: 'First scene!',
      paragraphs: ['When the campaign to expel the Islamic State from Mosul began, on October 17th, the Nineveh Province SWAT team was deployed far from the action, in the village of Kharbardan. For weeks, the élite police unit, made up almost entirely of native sons of Mosul, had been patrolling a bulldozed trench that divided bleak and vacant enemy-held plains from bleak and vacant government-held plains.', 'The men, needing a headquarters, had commandeered an abandoned mud-mortar house whose primary charm was its location: the building next door had been obliterated by an air strike, and the remains of half a dozen Islamic State fighters—charred torsos, limbs, and heads—still littered the rubble.'],
      paragraphsHTML: ['<p>When the campaign to expel the Islamic State from Mosul began, on October 17th, the Nineveh Province SWAT team was deployed far from the action, in the village of Kharbardan. For weeks, the élite police unit, made up almost entirely of native sons of Mosul, had been patrolling a bulldozed trench that divided bleak and vacant enemy-held plains from bleak and vacant government-held plains.', 'The men, needing a headquarters, had commandeered an abandoned mud-mortar house whose primary charm was its location: the building next door had been obliterated by an air strike, and the remains of half a dozen Islamic State fighters—charred torsos, limbs, and heads—still littered the rubble.</p>'],
      position: 0,
      actors: [
        {
          id: 1,
          name: 'Hillary Clinton',
          description: 'Hillary Diane Rodham Clinton (/ˈhɪləri daɪˈæn ˈrɒdəm ˈklɪntən/; born October 26, 1947) is an American politician who was the 67th United States Secretary of State from 2009 to 2013, U.S. Senator from New York from 2001 to 2009, First Lady of the Unit',
          image: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Hillary_Clinton_official_Secretary_of_State_portrait_crop.jpg'
        },
        {
          id: 2,
          name: 'Bill Clinton',
          description: 'William Jefferson Clinton (born William Jefferson Blythe III; August 19, 1946) is an American politician who served as the 42nd President of the United States from 1993 to 2001. Prior to the Presidency he was the 40th Governor of Arkansas from 1979 t',
          image: 'https://upload.wikimedia.org/wikipedia/commons/4/49/44_Bill_Clinton_3x4.jpg'
        }
      ]
    }, {
      id: 4,
      title: 'Second scene!',
      paragraphs: ['The rest of our story follows as so!'],
      paragraphsHTML: ['<p>The rest of our story follows as so!</p>'],
      position: 1,
      actors: []
    }, {
      id: 5,
      title: 'Third scene!',
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
    mapModules: ''
  }
}, action) {
  const newState = Object.assign({}, state)
  switch (action.type) {
    case SET_STORY:
      newState.title = action.title;
      newState.scenes = action.scenes;
      newState.currScene = action.currScene;
      newState.currScene.mapModules = action.currScene.mapModules[0]
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
import {setMap} from './editor';

export const fetchStory = (id) => dispatch => {
  axios.get(`/api/stories/${id}`)
    .then(res => {
      dispatch(setStory(res.data))
    })
    .catch(err => console.error(`Fetching story ${id} unsuccessful`, err));
};

export const setFakeState = () => dispatch => {
  dispatch(setStory(fakeData));
};

export const fetchScene = position => (dispatch, getState) => {
  dispatch(setCurrScene(getState().displayState.scenes[position]));
};
