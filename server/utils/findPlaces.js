import secrets from '../../secrets.json';

let googleMapsClient = require('@google/maps').createClient({key: secrets.googlemaps});

export default function findPlaces(nounsArr) {
  let promArr = [];

  for (var i = 0; i < nounsArr.length; i++) {
    let currentProm = new Promise((resolve, reject) => {
      googleMapsClient.geocode({
        address: nounsArr[i].name
      }, (err, response) => {

        if (!err && response.json.status === 'OK') {
          let results = response.json.results[0],
          coords = results.geometry.location,
          style,
          zoom;

        // if location type includes park or natural_feature, use 'outdoors' map
        // https://developers.google.com/places/supported_types
        if (results.types.includes('natural_feature') || results.types.includes('park')) {
          style = 'outdoors';
          zoom = 5;
        } else {
          style = 'light';
        }

        // if location type includes country or administrative area, set the zoom levels appropriately
        if (results.types.includes('country')) zoom = 3;
        else if (results.types.includes('administrative_area_level_1')) zoom = 5;
        else if (results.types.includes('administrative_area_level_2')) zoom = 7;
        else if (results.types.includes('administrative_area_level_3')) zoom = 8;
        else zoom = 12;

          resolve({
            name: nounsArr[i].name,
            coords: [response.json.results[0].geometry.location.lng, response.json.results[0].geometry.location.lat],
            style: style,
            zoom: zoom,
          });
        }
      })
    })
    return currentProm
      .then(location => {
        return location;
      })
      .catch(error => {
        throw error;
      })
    }

    // promArr.push(currentProm);
  }

  // return Promise
  //   .all(promArr)
  //   .then(locationArr => {
  //     return locationArr;
  //   })
  //   .catch(error => {
  //     throw error;
  //   })
// }
