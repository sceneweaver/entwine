//run through findProperNouns
//run through googlemaps geolocation
//run through hero?


//copy logic from generate actors and add map to recommendations
//don't remove logic from generate and add

//recommendations returns 'what we recommend' and highlights the buttons
//if rec was run, pre-populate modules
//still able to re-populate with generate actors/add map

import findPlaces from './findPlaces';
import findProperNouns from '/findProperNouns';

export default function recommendations(text) {
  let rec = "Recommend "
  const nounsArr = findProperNouns(text)
  if (nounsArr.length > 0) {
    rec += " actors"
  }

  if (Array.isArray(findPlaces(nounsArr).coords)) {
    rec += " maps";
  }

}




