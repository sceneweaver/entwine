import secrets from '../../secrets.json';

let googleMapsClient = require('@google/maps').createClient({key: secrets.googlemaps});

export default function findPlaces(nounsArr) {
  let promArr = [];

  nounsArr.forEach(noun => {
    let currentProm = new Promise((resolve, reject) => {
      googleMapsClient.geocode({
        address: noun.name
      }, (err, response) => {

        if (!err && response.json.status === 'OK') {
          resolve({
            name: noun.name,
            coords: [response.json.results[0].geometry.location.lng, response.json.results[0].geometry.location.lat]
          });
        } else {
          reject(new Error('nope'));
        }
      })
    }).catch(error => {
      throw error;
    })

    promArr.push(currentProm);
  });

  return Promise
    .all(promArr)
    .then(locationArr => {
      return locationArr;
    })
    .catch(error => {
      throw error;
    })
}
