import secrets from '../../secrets.json';

let googleMapsClient = require('@google/maps').createClient({key: secrets.googlemaps});

export default function findPlaceCoords(name) {
  let promArr = [];

    let currentProm = new Promise((resolve, reject) => {
      googleMapsClient.geocode({
        address: name
      }, (err, response) => {

        if (!err && response.json.status === 'OK') {
          resolve({
            name: name,
            coords: [response.json.results[0].geometry.location.lng, response.json.results[0].geometry.location.lat]
          });
        }
        // else {
        //   reject(new Error('nope'));
        // }
      })
    }).catch(error => {
      throw error;
    })

    promArr.push(currentProm);

  return Promise
    .all(promArr)
    .then(locationArr => {
      return locationArr;
    })
    .catch(error => {
      throw error;
    })
}
